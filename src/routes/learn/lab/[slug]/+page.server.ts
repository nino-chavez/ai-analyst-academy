import type { PageServerLoad, Actions } from './$types';
import { loadCurriculum, loadLab } from '$content/loader';
import { error, fail } from '@sveltejs/kit';
import type { LabProgress, LabProgressInsert, LabProgressUpdate } from '$lib/types/database';
import { updateUserStreak } from '$lib/utils/streak';

interface SavedLabProgress {
	status: string | null;
	sectionsViewed: string[];
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const lab = await loadLab(params.slug);

	if (!lab) {
		error(404, 'Lab not found');
	}

	const curriculum = await loadCurriculum();

	// Determine if this is the capstone
	const isCapstone = lab.phase === 'capstone';

	// Find the phase for non-capstone labs
	let phase = null;
	let phaseId = 'capstone';
	if (!isCapstone && typeof lab.phase === 'number') {
		const foundPhase = curriculum.phases.find((p) => p.metadata.order === lab.phase);
		if (foundPhase) {
			phase = {
				id: foundPhase.metadata.id,
				title: foundPhase.metadata.title,
				order: foundPhase.metadata.order,
				color: foundPhase.metadata.color
			};
			phaseId = foundPhase.metadata.id;
		}
	}

	// Load existing progress if user is authenticated
	let savedProgress: SavedLabProgress | null = null;
	const { session, user } = await locals.safeGetSession();

	if (session && user) {
		const { data: progress } = await locals.supabase
			.from('lab_progress')
			.select('status, work_data')
			.eq('user_id', user.id)
			.eq('lab_id', lab.id)
			.single<Pick<LabProgress, 'status' | 'work_data'>>();

		if (progress) {
			const workData = progress.work_data as { sectionsViewed?: string[] } | null;
			savedProgress = {
				status: progress.status,
				sectionsViewed: workData?.sectionsViewed || []
			};
		}
	}

	return {
		lab: {
			id: lab.id,
			title: lab.title,
			slug: lab.slug,
			phase: lab.phase,
			labNumber: lab.labNumber,
			estimatedMinutes: lab.estimatedMinutes,
			estimatedHours: lab.estimatedHours,
			objectives: lab.objectives,
			prerequisites: lab.prerequisites,
			content: lab.content,
			htmlContent: lab.htmlContent,
			sections: lab.sections
		},
		phase,
		phaseId,
		isCapstone,
		savedProgress,
		isAuthenticated: !!session
	};
};

export const actions: Actions = {
	saveProgress: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const labId = formData.get('labId') as string;
		const phaseId = formData.get('phaseId') as string;
		const sectionsViewed = JSON.parse(formData.get('sectionsViewed') as string || '[]') as string[];
		const isCompleted = formData.get('isCompleted') === 'true';

		// Check if progress record exists
		const { data: existing } = await (locals.supabase
			.from('lab_progress') as any)
			.select('id')
			.eq('user_id', user.id)
			.eq('lab_id', labId)
			.single() as { data: { id: string } | null };

		const workData = { sectionsViewed };
		const status = isCompleted ? 'completed' : 'in_progress';

		if (existing) {
			// Update existing record
			const updateData: LabProgressUpdate = {
				status,
				work_data: workData,
				updated_at: new Date().toISOString(),
				completed_at: isCompleted ? new Date().toISOString() : null
			};

			// Type assertion needed due to Supabase SSR typing quirk
			const { error: updateError } = await (locals.supabase.from('lab_progress') as any)
				.update(updateData)
				.eq('id', existing.id);

			if (updateError) {
				return fail(500, { error: 'Failed to save progress' });
			}
		} else {
			// Create new record
			const insertData: LabProgressInsert = {
				user_id: user.id,
				lab_id: labId,
				phase_id: phaseId,
				status,
				work_data: workData,
				started_at: new Date().toISOString(),
				completed_at: isCompleted ? new Date().toISOString() : null
			};

			// Type assertion needed due to Supabase SSR typing quirk
			const { error: insertError } = await (locals.supabase.from('lab_progress') as any)
				.insert(insertData);

			if (insertError) {
				return fail(500, { error: 'Failed to save progress' });
			}
		}

		// Update user streak
		await updateUserStreak(locals.supabase, user.id);

		return { success: true };
	}
};
