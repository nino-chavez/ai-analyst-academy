import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface ProfileData {
	persona_type: string | null;
	daily_goal_minutes: number | null;
	onboarding_completed: boolean | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/onboarding');
	}

	// Check user's onboarding progress
	const { data: profile } = await locals.supabase
		.from('user_profiles')
		.select('persona_type, daily_goal_minutes, onboarding_completed')
		.eq('id', user.id)
		.single<ProfileData>();

	// If onboarding is complete, redirect to learn
	if (profile?.onboarding_completed) {
		throw redirect(303, '/learn');
	}

	// Determine where user should be in the flow
	if (!profile?.persona_type) {
		throw redirect(303, '/onboarding/role-selection');
	}

	if (!profile?.daily_goal_minutes) {
		throw redirect(303, '/onboarding/goal-setting');
	}

	// Default to API setup
	throw redirect(303, '/onboarding/api-setup');
};
