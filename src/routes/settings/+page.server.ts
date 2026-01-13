import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { UserProfileUpdate } from '$lib/types/database';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		return {
			profile: null,
			email: null
		};
	}

	// Fetch user profile
	const { data: profile, error } = await locals.supabase
		.from('user_profiles')
		.select('*')
		.eq('id', user.id)
		.single();

	if (error && error.code !== 'PGRST116') {
		console.error('Error fetching profile:', error);
	}

	return {
		profile: profile ?? {
			id: user.id,
			display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner',
			avatar_url: user.user_metadata?.avatar_url || null,
			daily_goal_minutes: 30,
			persona_type: null,
			skill_level: null,
			onboarding_completed: false
		},
		email: user.email
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const displayName = formData.get('displayName') as string;
		const dailyGoal = parseInt(formData.get('dailyGoal') as string) || 30;

		// Validate input
		if (!displayName || displayName.trim().length === 0) {
			return fail(400, { error: 'Display name is required' });
		}

		if (displayName.length > 100) {
			return fail(400, { error: 'Display name is too long' });
		}

		if (dailyGoal < 15 || dailyGoal > 120) {
			return fail(400, { error: 'Daily goal must be between 15 and 120 minutes' });
		}

		const updateData: UserProfileUpdate = {
			display_name: displayName.trim(),
			daily_goal_minutes: dailyGoal,
			updated_at: new Date().toISOString()
		};

		// Check if profile exists
		const { data: existingProfile } = await locals.supabase
			.from('user_profiles')
			.select('id')
			.eq('id', user.id)
			.single();

		if (existingProfile) {
			// Update existing profile
			const { error } = await (locals.supabase.from('user_profiles') as any)
				.update(updateData)
				.eq('id', user.id);

			if (error) {
				console.error('Error updating profile:', error);
				return fail(500, { error: 'Failed to update profile' });
			}
		} else {
			// Create new profile
			const { error } = await (locals.supabase.from('user_profiles') as any)
				.insert({
					id: user.id,
					...updateData
				});

			if (error) {
				console.error('Error creating profile:', error);
				return fail(500, { error: 'Failed to create profile' });
			}
		}

		return { success: true };
	},

	updateEmail: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const newEmail = formData.get('email') as string;

		// Validate email
		if (!newEmail || !newEmail.includes('@')) {
			return fail(400, { error: 'Invalid email address' });
		}

		// Update email via Supabase Auth
		const { error } = await locals.supabase.auth.updateUser({
			email: newEmail
		});

		if (error) {
			console.error('Error updating email:', error);
			return fail(500, { error: error.message });
		}

		return {
			success: true,
			message: 'A confirmation email has been sent to your new address'
		};
	}
};
