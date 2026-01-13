import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateUserProfile } from '$lib/db';

interface ProfileData {
	persona_type: string | null;
	daily_goal_minutes: number | null;
	onboarding_completed: boolean | null;
}

interface ApiKeyData {
	provider: string;
	key_hint: string | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/onboarding/api-setup');
	}

	// Check if user has selected a role and goal
	const { data: profile } = await locals.supabase
		.from('user_profiles')
		.select('persona_type, daily_goal_minutes, onboarding_completed')
		.eq('id', user.id)
		.single<ProfileData>();

	// If onboarding is complete, redirect to learn
	if (profile?.onboarding_completed) {
		throw redirect(303, '/learn');
	}

	// If no persona selected, redirect back to role selection
	if (!profile?.persona_type) {
		throw redirect(303, '/onboarding/role-selection');
	}

	// Check for existing API keys
	const { data: apiKeys } = await locals.supabase
		.from('user_api_keys')
		.select('provider, key_hint')
		.eq('user_id', user.id);

	const configuredProviders = (apiKeys as ApiKeyData[] | null)?.map((k) => k.provider) ?? [];

	return {
		personaType: profile.persona_type,
		hasApiKeys: configuredProviders.length > 0,
		configuredProviders
	};
};

export const actions: Actions = {
	complete: async ({ locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Mark onboarding as complete
		const { error } = await updateUserProfile(locals.supabase, user.id, {
			onboarding_completed: true,
			updated_at: new Date().toISOString()
		});

		if (error) {
			console.error('Error completing onboarding:', error);
			return fail(500, { error: 'Failed to complete onboarding' });
		}

		throw redirect(303, '/learn');
	},

	skip: async ({ locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Mark onboarding as complete (even without API keys)
		await updateUserProfile(locals.supabase, user.id, {
			onboarding_completed: true,
			updated_at: new Date().toISOString()
		});

		throw redirect(303, '/learn');
	}
};
