import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { UserApiKey } from '$lib/types/database';
import { decrypt, isNewEncryptionFormat, migrateOldKey } from '$lib/utils/crypto';
import { ChatRequestSchema } from '$lib/validation/schemas';
import { checkRateLimit, createRateLimitKey, RateLimits } from '$lib/utils/rate-limiter';
import { updateUserApiKey } from '$lib/db';

/**
 * Decrypts an API key, handling both old and new encryption formats.
 * Automatically migrates old Base64 keys to the new AES-256-GCM format.
 */
function decryptKeyWithMigration(
	encrypted: string,
	userId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	supabase: any,
	provider: string
): string | null {
	// Check if this is the new encryption format
	if (isNewEncryptionFormat(encrypted)) {
		try {
			return decrypt(encrypted, userId);
		} catch (err) {
			console.error('Failed to decrypt key with new format:', err);
			return null;
		}
	}

	// Try to migrate old format
	const migrated = migrateOldKey(encrypted, userId);
	if (migrated) {
		// Update the key to the new format in the background (fire and forget)
		supabase
			.from('user_api_keys')
			.update({
				encrypted_key: migrated.newEncryptedKey,
				updated_at: new Date().toISOString()
			})
			.eq('user_id', userId)
			.eq('provider', provider)
			.then(() => {
				console.log(`Migrated ${provider} API key to new encryption format for user ${userId}`);
			});

		return migrated.plainKey;
	}

	return null;
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

	const { messages, persona, provider } = parseResult.data;

	// Validate persona exists in our prompts
	if (!personaPrompts[persona]) {
		throw error(400, 'Invalid persona specified');
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

	// Decrypt the API key (handles both old and new formats, with automatic migration)
	const apiKey = decryptKeyWithMigration(apiKeyData.encrypted_key, user.id, locals.supabase, provider);
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
			await updateUserApiKey(locals.supabase, user.id, provider, { is_valid: false });
		}

		throw error(500, `AI request failed: ${errorMessage}`);
	}
};
