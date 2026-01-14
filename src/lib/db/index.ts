/**
 * Typed Database Access Layer
 *
 * This module provides type-safe wrappers around Supabase operations.
 * The `as any` casts are necessary because Supabase's generated types
 * return `never` for Insert/Update operations when RLS policies can't
 * be statically analyzed (common with user-based policies).
 *
 * By centralizing these casts here, we:
 * 1. Keep route handlers clean and readable
 * 2. Ensure consistent error handling
 * 3. Document the workaround in one place
 * 4. Make it easy to fix when Supabase improves type generation
 */

import type {
	UserProfileInsert,
	UserProfileUpdate,
	ModuleProgressInsert,
	ModuleProgressUpdate,
	LabProgressInsert,
	LabProgressUpdate,
	PhaseDeliverableInsert,
	PhaseDeliverableUpdate,
	SavedPromptInsert,
	SavedPromptUpdate
} from '$lib/types/database';

// Use a flexible type that accepts any Supabase client with the expected methods
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = { from: (table: string) => any };

// =============================================================================
// User Profiles
// =============================================================================

export async function insertUserProfile(
	supabase: SupabaseClient,
	profile: UserProfileInsert
) {
	return (supabase.from('user_profiles') as any).insert(profile);
}

export async function updateUserProfile(
	supabase: SupabaseClient,
	userId: string,
	updates: UserProfileUpdate
) {
	return (supabase.from('user_profiles') as any)
		.update(updates)
		.eq('id', userId);
}

export async function getUserProfile(
	supabase: SupabaseClient,
	userId: string,
	columns: string = '*'
) {
	return supabase
		.from('user_profiles')
		.select(columns)
		.eq('id', userId)
		.single();
}

// =============================================================================
// Module Progress
// =============================================================================

export async function insertModuleProgress(
	supabase: SupabaseClient,
	progress: ModuleProgressInsert
) {
	return (supabase.from('module_progress') as any).insert(progress);
}

export async function updateModuleProgress(
	supabase: SupabaseClient,
	userId: string,
	moduleId: string,
	updates: ModuleProgressUpdate
) {
	return (supabase.from('module_progress') as any)
		.update(updates)
		.eq('user_id', userId)
		.eq('module_id', moduleId);
}

export async function getModuleProgress(
	supabase: SupabaseClient,
	userId: string,
	moduleId: string,
	columns: string = 'id, user_id, module_id, phase_id, started_at, completed_at, sections_viewed, concepts_understood, exercises_completed'
) {
	return supabase
		.from('module_progress')
		.select(columns)
		.eq('user_id', userId)
		.eq('module_id', moduleId)
		.single();
}

export async function upsertModuleProgress(
	supabase: SupabaseClient,
	progress: ModuleProgressInsert
) {
	return (supabase.from('module_progress') as any).upsert(progress, {
		onConflict: 'user_id,module_id'
	});
}

// =============================================================================
// Lab Progress
// =============================================================================

export async function insertLabProgress(
	supabase: SupabaseClient,
	progress: LabProgressInsert
) {
	return (supabase.from('lab_progress') as any).insert(progress);
}

export async function updateLabProgress(
	supabase: SupabaseClient,
	userId: string,
	labId: string,
	updates: LabProgressUpdate
) {
	return (supabase.from('lab_progress') as any)
		.update(updates)
		.eq('user_id', userId)
		.eq('lab_id', labId);
}

export async function getLabProgress(
	supabase: SupabaseClient,
	userId: string,
	labId: string,
	columns: string = 'id, user_id, lab_id, phase_id, status, started_at, completed_at, score, feedback, deliverable_url'
) {
	return supabase
		.from('lab_progress')
		.select(columns)
		.eq('user_id', userId)
		.eq('lab_id', labId)
		.single();
}

export async function upsertLabProgress(
	supabase: SupabaseClient,
	progress: LabProgressInsert
) {
	return (supabase.from('lab_progress') as any).upsert(progress, {
		onConflict: 'user_id,lab_id'
	});
}

// =============================================================================
// Phase Deliverables
// =============================================================================

export async function insertPhaseDeliverable(
	supabase: SupabaseClient,
	deliverable: PhaseDeliverableInsert
) {
	return (supabase.from('phase_deliverables') as any).insert(deliverable);
}

export async function updatePhaseDeliverable(
	supabase: SupabaseClient,
	id: string,
	updates: PhaseDeliverableUpdate
) {
	return (supabase.from('phase_deliverables') as any)
		.update(updates)
		.eq('id', id);
}

export async function deletePhaseDeliverable(
	supabase: SupabaseClient,
	id: string
) {
	return (supabase.from('phase_deliverables') as any)
		.delete()
		.eq('id', id);
}

// =============================================================================
// Review Queue
// =============================================================================

export async function insertReviewQueueItem(
	supabase: SupabaseClient,
	item: {
		user_id: string;
		concept_id: string;
		module_id: string;
		next_review_at: string;
		ease_factor?: number;
		interval_days?: number;
		review_count?: number;
	}
) {
	return (supabase.from('review_queue') as any).insert(item);
}

export async function updateReviewQueueItem(
	supabase: SupabaseClient,
	id: string,
	updates: {
		next_review_at?: string;
		last_reviewed_at?: string;
		ease_factor?: number;
		interval_days?: number;
		review_count?: number;
		updated_at?: string;
	}
) {
	return (supabase.from('review_queue') as any)
		.update(updates)
		.eq('id', id);
}

export async function deleteReviewQueueItem(
	supabase: SupabaseClient,
	id: string
) {
	return (supabase.from('review_queue') as any)
		.delete()
		.eq('id', id);
}

// =============================================================================
// Saved Prompts
// =============================================================================

export async function insertSavedPrompt(
	supabase: SupabaseClient,
	prompt: SavedPromptInsert
) {
	return (supabase.from('saved_prompts') as any).insert(prompt);
}

export async function updateSavedPrompt(
	supabase: SupabaseClient,
	id: string,
	updates: SavedPromptUpdate
) {
	return (supabase.from('saved_prompts') as any)
		.update(updates)
		.eq('id', id);
}

export async function deleteSavedPrompt(
	supabase: SupabaseClient,
	id: string
) {
	return (supabase.from('saved_prompts') as any)
		.delete()
		.eq('id', id);
}

export async function incrementPromptUseCount(
	supabase: SupabaseClient,
	id: string
) {
	// First get current count, then increment
	const { data } = await supabase
		.from('saved_prompts')
		.select('use_count')
		.eq('id', id)
		.single();

	const currentCount = data?.use_count ?? 0;

	return (supabase.from('saved_prompts') as any)
		.update({ use_count: currentCount + 1, updated_at: new Date().toISOString() })
		.eq('id', id);
}
