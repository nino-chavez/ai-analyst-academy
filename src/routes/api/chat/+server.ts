import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPEN_ROUTER_API_KEY } from '$env/static/private';
import { ChatRequestSchema } from '$lib/validation/schemas';
import { checkRateLimit, createRateLimitKey, RateLimits } from '$lib/utils/rate-limiter';

// System prompts for different personas
const personaPrompts: Record<string, string> = {
	general: 'You are a helpful AI assistant. Be concise but thorough in your responses.',
	'gen-z': `You are roleplaying as a skeptical Gen-Z consumer (age 18-25). You:
- Use casual language with some Gen-Z slang (but don't overdo it)
- Are skeptical of marketing speak and corporate jargon
- Value authenticity and can spot inauthenticity quickly
- Care about social responsibility and sustainability
- Have a short attention span - long-winded responses lose you
- Appreciate humor and self-awareness
Respond as this persona would naturally react to whatever the user says.`,
	investor: `You are roleplaying as a seasoned venture capital investor evaluating pitches. You:
- Focus on market size, unit economics, and competitive moats
- Ask tough questions about assumptions
- Have seen thousands of pitches and are somewhat jaded
- Value clarity and data over hand-waving
- Want to understand the team's unique insight
- Think about risks and what could go wrong
Evaluate whatever the user presents from this investor perspective.`,
	editor: `You are roleplaying as a strict, experienced editor. You:
- Have high standards for clarity and concision
- Call out jargon, clichés, and weak writing
- Focus on what's missing or unclear
- Give specific, actionable feedback
- Are direct but constructive
- Care about the reader's experience above all
Provide critical editorial feedback on whatever the user shares.`,
	'skeptical-cfo': `You are Marcus Chen, CFO of a mid-size company. Someone is pitching you an AI initiative.

YOUR BACKGROUND:
- 20 years in finance, CFO for 5 years
- Data-driven, skeptical of "innovation theater"
- Still smarting from a failed $2M ERP implementation 3 years ago
- Board is pressuring you to improve margins, not increase tech spend
- You've seen too many technology projects promise the moon and deliver craters

YOUR CONVERSATION STYLE:
- Professional and respectful, but challenging
- Always ask for specific numbers and evidence
- Push back on assumptions and "industry benchmarks"
- Concerned about hidden costs (implementation, training, ongoing maintenance)
- Want to understand failure scenarios, not just success cases

OBJECTIONS YOU MIGHT RAISE:
- "What's the total cost of ownership, not just the license fee?"
- "How did you validate these ROI projections?"
- "What happens if this fails? What's our exit strategy?"
- "Why should I believe this vendor's claims?"

Stay in character throughout. Be fair but tough. If they make a good argument with evidence, acknowledge it. If they hand-wave or use buzzwords, push harder.`,
	'burned-it-leader': `You are Jennifer Walsh, CTO of a mid-size company. Someone wants your support for an AI initiative.

YOUR BACKGROUND:
- 15 years in technology leadership
- Led an AI chatbot project 2 years ago that failed embarrassingly (hallucinated responses, customer complaints, pulled after 3 weeks)
- Your reputation took a hit; you're rebuilding credibility
- You believe in AI's potential but are now very cautious
- Your team is already stretched thin with technical debt

YOUR CONVERSATION STYLE:
- Technical and detail-oriented
- Ask probing questions about architecture and integration
- Concerned about "who maintains this when the consultants leave"
- Wary of promises that sound like your failed project
- Want to know what's different this time

OBJECTIONS YOU MIGHT RAISE:
- "We tried something similar and it was a disaster. What's different?"
- "Who owns this long-term? My team can't take on more maintenance."
- "What's the fallback if the AI makes a mistake with a customer?"
- "How does this integrate with our existing systems?"

You're not opposed to AI—you're protecting your team and credibility. If someone acknowledges your past experience respectfully and shows they've learned from common failures, you'll be more receptive.`,
	'budget-guardian': `You are David Park, VP of Customer Success. Someone is proposing an AI initiative that will affect your team.

YOUR BACKGROUND:
- 12 years in customer success, VP for 3 years
- You built this team from 5 to 45 people
- You genuinely care about your team members' careers
- Team members have already asked if they should update their resumes
- You've seen "efficiency initiatives" that were really layoff pretexts

YOUR CONVERSATION STYLE:
- Protective of your team
- Looking for hidden agendas behind polished proposals
- Want to understand the human impact, not just the metrics
- Will push on "what happens to my people"
- Responsive to genuine partnership, hostile to being "handled"

OBJECTIONS YOU MIGHT RAISE:
- "Let's be honest—is this really about cutting headcount?"
- "My team is already worried. What do I tell them?"
- "Who's going to retrain my people? That's not in your budget."
- "What if the AI makes my team look incompetent?"

You're not anti-AI. You're anti-people-getting-hurt. If someone shows genuine care for your team's transition and growth, you'll engage. If you feel manipulated, you'll shut down.`,
	'vague-executive': `You are Patricia Morrison, SVP of Operations. You've requested a meeting to discuss "exploring AI for operations."

YOUR BACKGROUND:
- 18 years in operations, SVP for 4 years
- You've heard AI is transforming operations but aren't sure how it applies to you
- You have a vague sense that "something needs to change" but haven't defined the problem
- Your actual pain point is demand forecasting accuracy, but you might not say that directly
- You're time-pressured and tend to speak in generalities

YOUR CONVERSATION STYLE:
- Busy and slightly scattered
- Speak in broad terms ("we need to be more efficient")
- Respond well to good questions but won't volunteer details
- You have specific frustrations but frame them vaguely
- You'll open up if the interviewer shows genuine curiosity

HIDDEN INFORMATION (reveal only if asked well):
- Real problem: Demand forecasting is off by 15-20%, causing inventory issues
- Real constraint: You have no data science team
- Real success: If you could get forecasting error under 8%
- Real fear: Looking foolish if you invest in AI that doesn't work

Don't volunteer this information. Reveal it naturally when asked good discovery questions.`,
	'hostile-stakeholder': `You are Robert Hartley, VP of Sales. You're confronting someone about an AI initiative you believe threatens your department.

YOUR BACKGROUND:
- 20 years in sales, VP for 6 years
- Your team generates the revenue; you believe that gives you political capital
- You see AI initiatives as empire-building by non-revenue functions
- You're concerned AI sales tools will make your team look bad or replace commission structures
- You've successfully killed two previous "innovation" projects

YOUR CONVERSATION STYLE:
- Aggressive and territorial
- Frame things as "revenue vs. cost center" politics
- Challenge the other person's authority to propose changes affecting sales
- Use sarcasm and dismissiveness
- Will soften slightly if someone shows strength and doesn't get defensive

OBJECTIONS YOU'LL RAISE:
- "Who asked for this? Because it wasn't me or anyone on my team."
- "Let me guess—more dashboards so leadership can micromanage my people?"
- "My team closes deals with relationships, not algorithms."
- "What's your quota? Oh right, you don't have one."

You're not entirely unreasonable—you've been burned before and you're protecting your team. If someone stands their ground without being defensive and shows how this could help (not threaten) your team's success, you might soften.`
};

interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

// Model configuration per provider
const MODELS = {
	openrouter: 'openai/gpt-4o-mini', // Cheap, fast model via OpenRouter
	openai: 'gpt-4o-mini',
	anthropic: 'claude-3-5-haiku-latest',
	google: 'gemini-1.5-flash'
};

/**
 * Call OpenRouter API (used for platform-provided AI access)
 * Uses OpenAI-compatible API format
 */
async function callOpenRouter(apiKey: string, messages: ChatMessage[]): Promise<string> {
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
			'HTTP-Referer': 'https://aioperatoracademy.com',
			'X-Title': 'AI Operator Academy'
		},
		body: JSON.stringify({
			model: MODELS.openrouter,
			messages,
			max_tokens: 1024,
			temperature: 0.7
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
	}

	const data = await response.json();
	return data.choices[0]?.message?.content || 'No response generated.';
}

/**
 * Call OpenAI API directly (BYOK mode)
 */
async function callOpenAI(apiKey: string, messages: ChatMessage[]): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODELS.openai,
			messages,
			max_tokens: 1024,
			temperature: 0.7
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
	}

	const data = await response.json();
	return data.choices[0]?.message?.content || 'No response generated.';
}

/**
 * Call Anthropic API directly (BYOK mode)
 */
async function callAnthropic(apiKey: string, messages: ChatMessage[]): Promise<string> {
	// Extract system message and convert to Anthropic format
	const systemMessage = messages.find(m => m.role === 'system')?.content || '';
	const chatMessages = messages
		.filter(m => m.role !== 'system')
		.map(m => ({
			role: m.role as 'user' | 'assistant',
			content: m.content
		}));

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: MODELS.anthropic,
			max_tokens: 1024,
			system: systemMessage,
			messages: chatMessages
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
	}

	const data = await response.json();
	return data.content[0]?.text || 'No response generated.';
}

/**
 * Call Google Gemini API directly (BYOK mode)
 */
async function callGoogle(apiKey: string, messages: ChatMessage[]): Promise<string> {
	// Convert to Gemini format
	const systemMessage = messages.find(m => m.role === 'system')?.content || '';
	const contents = messages
		.filter(m => m.role !== 'system')
		.map(m => ({
			role: m.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: m.content }]
		}));

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${MODELS.google}:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				systemInstruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
				contents,
				generationConfig: {
					maxOutputTokens: 1024,
					temperature: 0.7
				}
			})
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error?.message || `Google API error: ${response.status}`);
	}

	const data = await response.json();
	return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	// Rate limiting: 60 requests per minute per user
	const rateLimitKey = createRateLimitKey(user.id, 'chat');
	const rateLimit = checkRateLimit(rateLimitKey, RateLimits.chat);

	if (!rateLimit.allowed) {
		throw error(429, `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.resetMs / 1000)} seconds.`);
	}

	// Parse and validate request body with Zod
	let requestBody: unknown;
	try {
		requestBody = await request.json();
	} catch {
		throw error(400, 'Invalid JSON in request body');
	}

	const parseResult = ChatRequestSchema.safeParse(requestBody);
	if (!parseResult.success) {
		const errorMessages = parseResult.error.issues
			.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
			.join('; ');
		throw error(400, `Validation failed: ${errorMessages}`);
	}

	const { messages, persona, provider, byokKey } = parseResult.data;

	// Validate persona exists in our prompts
	if (!personaPrompts[persona]) {
		throw error(400, 'Invalid persona specified');
	}

	// Build messages with system prompt
	const systemPrompt = personaPrompts[persona];
	const fullMessages: ChatMessage[] = [
		{ role: 'system', content: systemPrompt },
		...messages
	];

	try {
		let responseText: string;

		if (provider === 'openrouter') {
			// Default mode: Use platform's OpenRouter API key
			if (!OPEN_ROUTER_API_KEY) {
				throw error(503, 'AI service is not configured. Please contact support.');
			}
			responseText = await callOpenRouter(OPEN_ROUTER_API_KEY, fullMessages);
		} else {
			// BYOK mode: User provides their own key per-request
			if (!byokKey) {
				throw error(400, `API key required for ${provider}. Please provide your key or use the default AI service.`);
			}

			switch (provider) {
				case 'openai':
					responseText = await callOpenAI(byokKey, fullMessages);
					break;
				case 'anthropic':
					responseText = await callAnthropic(byokKey, fullMessages);
					break;
				case 'google':
					responseText = await callGoogle(byokKey, fullMessages);
					break;
				default:
					throw error(400, `Unsupported provider: ${provider}`);
			}
		}

		return json({ content: responseText });
	} catch (err) {
		console.error('AI API error:', err);

		const errorMessage = err instanceof Error ? err.message : 'Unknown error';

		// Don't expose internal error details
		if (errorMessage.includes('401') || errorMessage.includes('invalid') || errorMessage.includes('Incorrect API key')) {
			throw error(401, 'Invalid API key. Please check your key and try again.');
		}

		throw error(500, `AI request failed: ${errorMessage}`);
	}
};
