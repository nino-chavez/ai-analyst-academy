import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GoalSettingSchema } from '$lib/validation/schemas';
import { updateUserProfile } from '$lib/db';

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
		const rawDailyGoal = formData.get('dailyGoal');

		// Validate goal using Zod schema (only accepts 15, 30, 60, 90)
		const parseResult = GoalSettingSchema.safeParse({ dailyGoal: rawDailyGoal });
		if (!parseResult.success) {
			return fail(400, { error: 'Please select a valid daily goal' });
		}

		const { dailyGoal } = parseResult.data;

		// Update profile
		const { error } = await updateUserProfile(locals.supabase, user.id, {
			daily_goal_minutes: dailyGoal,
			updated_at: new Date().toISOString()
		});

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
		await updateUserProfile(locals.supabase, user.id, {
			daily_goal_minutes: 30,
			updated_at: new Date().toISOString()
		});

		throw redirect(303, '/onboarding/api-setup');
	}
};
