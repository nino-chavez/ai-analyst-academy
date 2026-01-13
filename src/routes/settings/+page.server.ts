import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { UserProfileUpdate } from '$lib/types/database';
import { insertUserProfile, updateUserProfile } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		return {
			profile: null,
			email: null
		};
	}

	// Fetch user profile - only select needed columns
	const { data: profile, error } = await locals.supabase
		.from('user_profiles')
		.select('id, display_name, avatar_url, daily_goal_minutes, persona_type, skill_level, onboarding_completed')
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
			const { error } = await updateUserProfile(locals.supabase, user.id, updateData);

			if (error) {
				console.error('Error updating profile:', error);
				return fail(500, { error: 'Failed to update profile' });
			}
		} else {
			// Create new profile
			const { error } = await insertUserProfile(locals.supabase, {
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
	},

	deleteAccount: async ({ locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}


		// Soft delete user profile (reset data) to avoid RLS delete restrictions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { data, error: profileError } = await (locals.supabase.from('user_profiles') as any)
			.update({
				display_name: `Deleted User ${user.email?.slice(0, 4) || ''}`,
				daily_goal_minutes: 30,
				avatar_url: null,
				persona_type: null,
				skill_level: null,
				onboarding_completed: false
			})
			.eq('id', user.id)
			.select();
		
		if (profileError) {
			console.error('Error resetting profile:', profileError);
			return fail(500, { error: `Failed to delete profile: ${profileError.message}` });
		}

		// Check if any rows were updated
		if (!data || data.length === 0) {
			// If no profile found, that's fine, we proceed to sign out
			console.warn('Profile not found during deletion, proceeding to sign out.');
		}

		// Sign out the user (this invalidates their session)
		await locals.supabase.auth.signOut();

		// Note: Full user deletion from auth.users requires admin API
		// For now, we delete their data and sign them out
		// The user record remains but is effectively orphaned

		return {
			success: true,
			deleted: true
		};
	}
};
