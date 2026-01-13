import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { UserApiKey } from '$lib/types/database';
import { encrypt } from '$lib/utils/crypto';
import { insertUserApiKey, updateUserApiKey, deleteUserApiKey } from '$lib/db';

/**
 * Encrypts an API key using AES-256-GCM.
 * Uses the user ID as additional authenticated data (AAD) to bind the key to the user.
 */
function encryptKey(key: string, userId: string): string {
	return encrypt(key, userId);
}

function getKeyHint(key: string): string {
	// Show first 4 and last 4 characters
	if (key.length <= 12) {
		return `${key.substring(0, 4)}...`;
	}
	return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		return {
			keys: []
		};
	}

	// Fetch user's API keys
	const { data: apiKeys } = await locals.supabase
		.from('user_api_keys')
		.select('*')
		.eq('user_id', user.id) as { data: UserApiKey[] | null };

	// Map to safe format (don't expose encrypted keys to client)
	const keys = (apiKeys ?? []).map((key) => ({
		provider: key.provider,
		configured: true,
		keyHint: key.key_hint ?? '',
		isValid: key.is_valid ?? true,
		createdAt: key.created_at
	}));

	// Add missing providers
	const providers = ['openai', 'anthropic', 'google'];
	const configuredProviders = keys.map(k => k.provider);

	for (const provider of providers) {
		if (!configuredProviders.includes(provider)) {
			keys.push({
				provider,
				configured: false,
				keyHint: '',
				isValid: true,
				createdAt: null
			});
		}
	}

	// Sort by provider name
	keys.sort((a, b) => {
		const order = { openai: 1, anthropic: 2, google: 3 };
		return (order[a.provider as keyof typeof order] ?? 99) - (order[b.provider as keyof typeof order] ?? 99);
	});

	return {
		keys
	};
};

export const actions: Actions = {
	saveKey: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const provider = formData.get('provider') as string;
		const apiKey = formData.get('apiKey') as string;

		// Validate provider
		if (!['openai', 'anthropic', 'google'].includes(provider)) {
			return fail(400, { error: 'Invalid provider' });
		}

		// Validate API key format
		if (!apiKey || apiKey.trim().length === 0) {
			return fail(400, { error: 'API key is required' });
		}

		const patterns: Record<string, RegExp> = {
			openai: /^sk-[a-zA-Z0-9]{32,}$/,
			anthropic: /^sk-ant-[a-zA-Z0-9-]{90,}$/,
			google: /^[a-zA-Z0-9_-]{35,45}$/
		};

		if (!patterns[provider].test(apiKey.trim())) {
			return fail(400, { error: 'Invalid API key format. Please check your key.' });
		}

		const trimmedKey = apiKey.trim();
		const encryptedKey = encryptKey(trimmedKey, user.id);
		const keyHint = getKeyHint(trimmedKey);

		// Check if key already exists for this provider
		const { data: existingKey } = await locals.supabase
			.from('user_api_keys')
			.select('id')
			.eq('user_id', user.id)
			.eq('provider', provider)
			.single() as { data: { id: string } | null };

		if (existingKey) {
			// Update existing key
			const { error } = await updateUserApiKey(locals.supabase, user.id, provider, {
				encrypted_key: encryptedKey,
				key_hint: keyHint,
				is_valid: true,
				updated_at: new Date().toISOString()
			});

			if (error) {
				console.error('Error updating API key:', error);
				return fail(500, { error: 'Failed to update API key' });
			}
		} else {
			// Insert new key
			const { error } = await insertUserApiKey(locals.supabase, {
				user_id: user.id,
				provider,
				encrypted_key: encryptedKey,
				key_hint: keyHint,
				is_valid: true
			});

			if (error) {
				console.error('Error saving API key:', error);
				return fail(500, { error: 'Failed to save API key' });
			}
		}

		return { success: true, provider };
	},

	removeKey: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const provider = formData.get('provider') as string;

		// Validate provider
		if (!['openai', 'anthropic', 'google'].includes(provider)) {
			return fail(400, { error: 'Invalid provider' });
		}

		const { error } = await deleteUserApiKey(locals.supabase, user.id, provider);

		if (error) {
			console.error('Error removing API key:', error);
			return fail(500, { error: 'Failed to remove API key' });
		}

		return { success: true, removed: provider };
	}
};
