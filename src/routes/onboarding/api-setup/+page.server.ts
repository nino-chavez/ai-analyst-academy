import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { updateUserProfile } from '$lib/db';

interface ProfileData {
	persona_type: string | null;
	daily_goal_minutes: number | null;
	onboarding_completed: boolean | null;
}

/**
 * Onboarding API Setup page
 *
 * With the hybrid model, this page now just explains the AI features:
 * - Default mode uses platform's OpenRouter API key (no user setup needed)
 * - Power users can BYOK via localStorage (done in sandbox settings)
 *
 * No API key storage happens server-side.
 */
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

	return {
		personaType: profile.persona_type
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
	}
};
