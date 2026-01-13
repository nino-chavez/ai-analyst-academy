import type { PageServerLoad, Actions } from './$types';
import { loadCurriculum, getModuleNavigation } from '$content/loader';
import { error, fail } from '@sveltejs/kit';
import type { ModuleProgress, ModuleProgressInsert, ModuleProgressUpdate } from '$lib/types/database';
import { updateUserStreak } from '$lib/utils/streak';
import { getModuleProgress, insertModuleProgress, updateModuleProgress } from '$lib/db';

interface SavedProgress {
	sectionsViewed: string[];
	conceptsUnderstood: string[];
	exercisesCompleted: string[];
	checklistItems: Record<string, Record<string, boolean>>;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const phaseNumber = parseInt(params.phase, 10);

	if (isNaN(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) {
		error(404, 'Phase not found');
	}

	const curriculum = await loadCurriculum();
	const phase = curriculum.phases.find((p) => p.metadata.order === phaseNumber);

	if (!phase) {
		error(404, 'Phase not found');
	}

	const module = phase.modules.find((m) => m.slug === params.module);

	if (!module) {
		error(404, 'Module not found');
	}

	const navigation = await getModuleNavigation(module.slug);

	// Load existing progress if user is authenticated
	let savedProgress: SavedProgress | null = null;
	const { session, user } = await locals.safeGetSession();

	if (session && user) {
		const { data: progress } = await locals.supabase
			.from('module_progress')
			.select('sections_viewed, concepts_understood, exercises_completed, checklist_items')
			.eq('user_id', user.id)
			.eq('module_id', module.id)
			.single<Pick<ModuleProgress, 'sections_viewed' | 'concepts_understood' | 'exercises_completed' | 'checklist_items'>>();

		if (progress) {
			savedProgress = {
				sectionsViewed: progress.sections_viewed || [],
				conceptsUnderstood: progress.concepts_understood || [],
				exercisesCompleted: progress.exercises_completed || [],
				checklistItems: (progress.checklist_items as Record<string, Record<string, boolean>>) || {}
			};
		}
	}

	return {
		phase: {
			id: phase.metadata.id,
			title: phase.metadata.title,
			order: phase.metadata.order,
			color: phase.metadata.color
		},
		module: {
			id: module.id,
			title: module.title,
			slug: module.slug,
			phaseId: module.phaseId,
			estimatedMinutes: module.estimatedMinutes,
			bloomLevel: module.bloomLevel,
			content: module.content,
			htmlContent: module.htmlContent,
			sections: module.sections,
			concepts: module.concepts,
			exercises: module.exercises,
			checklists: module.checklists
		},
		navigation: {
			prev: navigation.prev,
			next: navigation.next
		},
		phaseNumber,
		savedProgress,
		isAuthenticated: !!session
	};
};

export const actions: Actions = {
	saveProgress: async ({ request, locals, params }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const moduleId = formData.get('moduleId') as string;
		const phaseId = formData.get('phaseId') as string;
		const sectionsViewed = JSON.parse(formData.get('sectionsViewed') as string || '[]') as string[];
		const conceptsUnderstood = JSON.parse(formData.get('conceptsUnderstood') as string || '[]') as string[];
		const exercisesCompleted = JSON.parse(formData.get('exercisesCompleted') as string || '[]') as string[];
		const checklistItems = JSON.parse(formData.get('checklistItems') as string || '{}') as Record<string, Record<string, boolean>>;

		// Check if progress record exists
		const { data: existing } = await getModuleProgress(locals.supabase, user.id, moduleId);

		if (existing) {
			// Update existing record
			const updateData: ModuleProgressUpdate = {
				sections_viewed: sectionsViewed,
				concepts_understood: conceptsUnderstood,
				exercises_completed: exercisesCompleted,
				checklist_items: checklistItems,
				updated_at: new Date().toISOString()
			};

			const { error: updateError } = await updateModuleProgress(
				locals.supabase,
				user.id,
				moduleId,
				updateData
			);

			if (updateError) {
				return fail(500, { error: 'Failed to save progress' });
			}
		} else {
			// Create new record
			const insertData: ModuleProgressInsert = {
				user_id: user.id,
				module_id: moduleId,
				phase_id: phaseId,
				sections_viewed: sectionsViewed,
				concepts_understood: conceptsUnderstood,
				exercises_completed: exercisesCompleted,
				checklist_items: checklistItems,
				started_at: new Date().toISOString()
			};

			const { error: insertError } = await insertModuleProgress(locals.supabase, insertData);

			if (insertError) {
				return fail(500, { error: 'Failed to save progress' });
			}
		}

		// Update user streak
		await updateUserStreak(locals.supabase, user.id);

		return { success: true };
	}
};
