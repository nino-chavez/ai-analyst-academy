import type { PageServerLoad } from './$types';

/**
 * Sandbox page server load
 *
 * The sandbox now uses a hybrid model:
 * - Default: Platform's OpenRouter API key (configured server-side)
 * - BYOK: User's own API key (stored client-side in localStorage, never on server)
 *
 * No database queries needed - the page works for all authenticated users.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	return {
		isAuthenticated: !!session && !!user
	};
};
