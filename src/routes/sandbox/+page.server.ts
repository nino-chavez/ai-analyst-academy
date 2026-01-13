import type { PageServerLoad } from './$types';
import type { UserApiKey } from '$lib/types/database';

interface ConfiguredProvider {
	provider: string;
	keyHint: string;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		return {
			hasApiKeys: false,
			configuredProviders: [] as ConfiguredProvider[]
		};
	}

	// Fetch user's API keys
	const { data: apiKeys } = await locals.supabase
		.from('user_api_keys')
		.select('provider, key_hint, is_valid')
		.eq('user_id', user.id)
		.eq('is_valid', true) as { data: Pick<UserApiKey, 'provider' | 'key_hint' | 'is_valid'>[] | null };

	const validKeys = (apiKeys ?? []).filter(k => k.is_valid);

	const configuredProviders: ConfiguredProvider[] = validKeys.map(k => ({
		provider: k.provider,
		keyHint: k.key_hint ?? ''
	}));

	return {
		hasApiKeys: configuredProviders.length > 0,
		configuredProviders
	};
};
