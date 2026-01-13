import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface ProfileData {
	persona_type: string | null;
	daily_goal_minutes: number | null;
	onboarding_completed: boolean | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/onboarding/goal-setting');
	}

	// Check if user has selected a role first
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
		personaType: profile.persona_type,
		currentGoal: profile.daily_goal_minutes ?? 30
	};
};

export const actions: Actions = {
	setGoal: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const dailyGoal = parseInt(formData.get('dailyGoal') as string) || 30;

		// Validate goal
		if (dailyGoal < 15 || dailyGoal > 120) {
			return fail(400, { error: 'Daily goal must be between 15 and 120 minutes' });
		}

		// Update profile
		const { error } = await (locals.supabase.from('user_profiles') as any)
			.update({
				daily_goal_minutes: dailyGoal,
				updated_at: new Date().toISOString()
			})
			.eq('id', user.id);

		if (error) {
			console.error('Error updating goal:', error);
			return fail(500, { error: 'Failed to save your goal' });
		}

		throw redirect(303, '/onboarding/api-setup');
	},

	skip: async ({ locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Set default goal and continue
		await (locals.supabase.from('user_profiles') as any)
			.update({
				daily_goal_minutes: 30,
				updated_at: new Date().toISOString()
			})
			.eq('id', user.id);

		throw redirect(303, '/onboarding/api-setup');
	}
};
