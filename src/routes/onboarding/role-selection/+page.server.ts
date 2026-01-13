import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface ProfileData {
	persona_type: string | null;
	onboarding_completed: boolean | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/onboarding/role-selection');
	}

	// Check if user already completed onboarding
	const { data: profile } = await locals.supabase
		.from('user_profiles')
		.select('persona_type, onboarding_completed')
		.eq('id', user.id)
		.single<ProfileData>();

	// If onboarding is complete, redirect to learn
	if (profile?.onboarding_completed) {
		throw redirect(303, '/learn');
	}

	return {
		currentPersona: profile?.persona_type ?? null
	};
};

export const actions: Actions = {
	selectRole: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const personaType = formData.get('personaType') as string;

		// Validate persona type
		const validPersonas = ['career-pivoter', 'business-student', 'team-lead', 'curious-explorer'];
		if (!personaType || !validPersonas.includes(personaType)) {
			return fail(400, { error: 'Please select a valid role' });
		}

		// Check if profile exists
		const { data: existingProfile } = await locals.supabase
			.from('user_profiles')
			.select('id')
			.eq('id', user.id)
			.single();

		if (existingProfile) {
			// Update existing profile
			const { error } = await (locals.supabase.from('user_profiles') as any)
				.update({
					persona_type: personaType,
					updated_at: new Date().toISOString()
				})
				.eq('id', user.id);

			if (error) {
				console.error('Error updating persona:', error);
				return fail(500, { error: 'Failed to save your selection' });
			}
		} else {
			// Create new profile
			const { error } = await (locals.supabase.from('user_profiles') as any).insert({
				id: user.id,
				persona_type: personaType,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			});

			if (error) {
				console.error('Error creating profile:', error);
				return fail(500, { error: 'Failed to save your selection' });
			}
		}

		throw redirect(303, '/onboarding/goal-setting');
	}
};
