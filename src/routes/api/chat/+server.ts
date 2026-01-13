import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { UserApiKey } from '$lib/types/database';

// Decrypt the stored API key
function decryptKey(encrypted: string, userId: string): string | null {
	try {
		const decoded = Buffer.from(encrypted, 'base64').toString('utf-8');
		const [storedUserId, key] = decoded.split(':');
		if (storedUserId !== userId) return null;
		return key;
	} catch {
		return null;
	}
}

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

// OpenAI API call
async function callOpenAI(apiKey: string, messages: ChatMessage[]): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
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

// Anthropic API call
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
			model: 'claude-3-5-haiku-latest',
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

// Google Gemini API call
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
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

	const { messages, persona, provider = 'openai' } = await request.json();

	if (!messages || !Array.isArray(messages)) {
		throw error(400, 'Messages array is required');
	}

	if (!persona || !personaPrompts[persona]) {
		throw error(400, 'Valid persona is required');
	}

	// Fetch the user's API key for the selected provider
	const { data: apiKeyData } = await locals.supabase
		.from('user_api_keys')
		.select('encrypted_key, is_valid')
		.eq('user_id', user.id)
		.eq('provider', provider)
		.single() as { data: Pick<UserApiKey, 'encrypted_key' | 'is_valid'> | null };

	if (!apiKeyData || !apiKeyData.is_valid) {
		throw error(400, `No valid ${provider} API key configured. Please add one in Settings.`);
	}

	// Decrypt the API key
	const apiKey = decryptKey(apiKeyData.encrypted_key, user.id);
	if (!apiKey) {
		throw error(500, 'Failed to decrypt API key');
	}

	// Build messages with system prompt
	const systemPrompt = personaPrompts[persona];
	const fullMessages: ChatMessage[] = [
		{ role: 'system', content: systemPrompt },
		...messages
	];

	try {
		let responseText: string;

		switch (provider) {
			case 'openai':
				responseText = await callOpenAI(apiKey, fullMessages);
				break;
			case 'anthropic':
				responseText = await callAnthropic(apiKey, fullMessages);
				break;
			case 'google':
				responseText = await callGoogle(apiKey, fullMessages);
				break;
			default:
				throw error(400, `Unsupported provider: ${provider}`);
		}

		return json({ content: responseText });
	} catch (err) {
		console.error('AI API error:', err);

		// Mark the key as invalid if it's an auth error
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		if (errorMessage.includes('401') || errorMessage.includes('invalid') || errorMessage.includes('Incorrect API key')) {
			await (locals.supabase.from('user_api_keys') as any)
				.update({ is_valid: false })
				.eq('user_id', user.id)
				.eq('provider', provider);
		}

		throw error(500, `AI request failed: ${errorMessage}`);
	}
};
