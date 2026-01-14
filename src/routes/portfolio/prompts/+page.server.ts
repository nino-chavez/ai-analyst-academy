import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { SavedPrompt } from '$lib/types/database';
import { TABLES } from '$lib/supabase';
import { insertSavedPrompt, updateSavedPrompt, deleteSavedPrompt } from '$lib/db';

// Prompt categories for organization (prefixed with _ to avoid SvelteKit export validation)
const _PROMPT_CATEGORIES = [
	{ value: 'analysis', label: 'Analysis' },
	{ value: 'coding', label: 'Coding' },
	{ value: 'writing', label: 'Writing' },
	{ value: 'research', label: 'Research' },
	{ value: 'brainstorm', label: 'Brainstorming' },
	{ value: 'other', label: 'Other' }
] as const;

type PromptCategory = (typeof _PROMPT_CATEGORIES)[number]['value'];

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?next=/portfolio/prompts');
	}

	// Fetch user's saved prompts
	const { data: prompts, error } = await locals.supabase
		.from(TABLES.SAVED_PROMPTS)
		.select('id, title, prompt_text, category, tags, lab_id, use_count, is_public, created_at, updated_at')
		.eq('user_id', user.id)
		.order('updated_at', { ascending: false });

	if (error) {
		console.error('Error fetching prompts:', error);
	}

	// Calculate stats
	const savedPrompts = (prompts || []) as SavedPrompt[];
	const stats = {
		totalPrompts: savedPrompts.length,
		totalUses: savedPrompts.reduce((sum, p) => sum + (p.use_count || 0), 0),
		categoryCounts: savedPrompts.reduce(
			(acc, p) => {
				const cat = p.category || 'other';
				acc[cat] = (acc[cat] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		)
	};

	return {
		prompts: savedPrompts,
		stats,
		categories: _PROMPT_CATEGORIES
	};
};

export const actions: Actions = {
	// Create a new saved prompt
	create: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio/prompts');
		}

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const promptText = formData.get('promptText')?.toString().trim();
		const category = formData.get('category')?.toString() || 'other';
		const tagsStr = formData.get('tags')?.toString().trim();
		const labId = formData.get('labId')?.toString().trim() || null;

		if (!title) {
			return fail(400, { error: 'Title is required', field: 'title' });
		}

		if (!promptText) {
			return fail(400, { error: 'Prompt text is required', field: 'promptText' });
		}

		// Parse tags from comma-separated string
		const tags = tagsStr
			? tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
			: null;

		const { error } = await insertSavedPrompt(locals.supabase, {
			user_id: user.id,
			title,
			prompt_text: promptText,
			category,
			tags,
			lab_id: labId
		});

		if (error) {
			console.error('Error creating prompt:', error);
			return fail(500, { error: 'Failed to save prompt' });
		}

		return { success: true };
	},

	// Update an existing prompt
	update: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio/prompts');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const promptText = formData.get('promptText')?.toString().trim();
		const category = formData.get('category')?.toString() || 'other';
		const tagsStr = formData.get('tags')?.toString().trim();

		if (!id) {
			return fail(400, { error: 'Prompt ID is required' });
		}

		if (!title) {
			return fail(400, { error: 'Title is required', field: 'title' });
		}

		if (!promptText) {
			return fail(400, { error: 'Prompt text is required', field: 'promptText' });
		}

		// Parse tags from comma-separated string
		const tags = tagsStr
			? tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
			: null;

		const { error } = await updateSavedPrompt(locals.supabase, id, {
			title,
			prompt_text: promptText,
			category,
			tags,
			updated_at: new Date().toISOString()
		});

		if (error) {
			console.error('Error updating prompt:', error);
			return fail(500, { error: 'Failed to update prompt' });
		}

		return { success: true };
	},

	// Delete a prompt
	delete: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio/prompts');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Prompt ID is required' });
		}

		const { error } = await deleteSavedPrompt(locals.supabase, id);

		if (error) {
			console.error('Error deleting prompt:', error);
			return fail(500, { error: 'Failed to delete prompt' });
		}

		return { success: true };
	}
};
