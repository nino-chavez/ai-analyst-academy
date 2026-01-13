import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { UserProfileInsert } from '$lib/types/database';
import { getSafeRedirect } from '$lib/utils/redirect';
import { insertUserProfile } from '$lib/db';

interface ProfileCheck {
	id: string;
	onboarding_completed: boolean | null;
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	// Validate the redirect URL to prevent open redirect attacks
	const next = getSafeRedirect(url.searchParams.get('next'));

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			// Check if user profile exists, create if not
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();
			if (user) {
				const { data: profile } = await locals.supabase
					.from('user_profiles')
					.select('id, onboarding_completed')
					.eq('id', user.id)
					.single<ProfileCheck>();

				if (!profile) {
					// Create initial profile - new user needs onboarding
					const newProfile: UserProfileInsert = {
						id: user.id,
						display_name:
							user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner',
						avatar_url: user.user_metadata?.avatar_url || null,
						onboarding_completed: false
					};
					await insertUserProfile(locals.supabase, newProfile);
					// New user - redirect to onboarding
					redirect(303, '/onboarding');
				}

				// Existing user - check if they completed onboarding
				if (!profile.onboarding_completed) {
					redirect(303, '/onboarding');
				}
			}
			redirect(303, next);
		}
	}

	// Auth code exchange failed, redirect to login with error
	redirect(303, '/auth/login?error=Could not authenticate');
};
