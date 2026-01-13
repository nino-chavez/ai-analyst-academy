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
Provide critical editorial feedback on whatever the user shares.`
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
