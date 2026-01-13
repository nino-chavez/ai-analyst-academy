import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type {
	PhaseDeliverable,
	LabProgress,
	CapstoneProject
} from '$lib/types/database';
import { TABLES } from '$lib/supabase';

// Lab metadata for display
const LAB_METADATA: Record<string, { title: string; phase: number }> = {
	'persona-stress-test': { title: 'Persona Stress Test', phase: 1 },
	'chain-of-thought-audit': { title: 'Chain of Thought Audit', phase: 1 },
	'hallucination-detection': { title: 'Hallucination Detection', phase: 2 },
	'prompt-injection-defense': { title: 'Prompt Injection Defense', phase: 2 },
	'workflow-automation': { title: 'Workflow Automation', phase: 3 },
	'multi-model-orchestration': { title: 'Multi-Model Orchestration', phase: 3 },
	'cost-optimization': { title: 'Cost Optimization', phase: 4 },
	'production-deployment': { title: 'Production Deployment', phase: 4 }
};

export interface PortfolioItem {
	id: string;
	type: 'deliverable' | 'lab' | 'capstone';
	phase?: number;
	title: string;
	description: string;
	createdAt: string;
	status: 'draft' | 'complete';
	deliverableUrl?: string | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?next=/portfolio');
	}

	// Fetch all portfolio data in parallel
	const [deliverablesResult, labsResult, capstoneResult] = await Promise.all([
		locals.supabase
			.from(TABLES.PHASE_DELIVERABLES)
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from(TABLES.LAB_PROGRESS)
			.select('*')
			.eq('user_id', user.id)
			.in('status', ['completed', 'in_progress'])
			.order('created_at', { ascending: false }),
		locals.supabase
			.from(TABLES.CAPSTONE_PROJECTS)
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
	]);

	const deliverables = (deliverablesResult.data || []) as PhaseDeliverable[];
	const labs = (labsResult.data || []) as LabProgress[];
	const capstones = (capstoneResult.data || []) as CapstoneProject[];

	// Transform phase deliverables to portfolio items
	const deliverableItems: PortfolioItem[] = deliverables.map((d) => ({
		id: d.id,
		type: 'deliverable' as const,
		phase: parseInt(d.phase_id.replace('phase-', ''), 10),
		title: d.title,
		description: d.description || 'Phase deliverable',
		createdAt: d.created_at || new Date().toISOString(),
		status: d.submitted_at ? ('complete' as const) : ('draft' as const),
		deliverableUrl: d.deliverable_url
	}));

	// Transform lab progress to portfolio items
	const labItems: PortfolioItem[] = labs.map((l) => {
		const labMeta = LAB_METADATA[l.lab_id] || { title: l.lab_id, phase: 1 };
		return {
			id: l.id,
			type: 'lab' as const,
			phase: labMeta.phase,
			title: labMeta.title,
			description: l.feedback || 'Lab work submission',
			createdAt: l.created_at || new Date().toISOString(),
			status: l.status === 'completed' ? ('complete' as const) : ('draft' as const),
			deliverableUrl: l.deliverable_url
		};
	});

	// Transform capstone projects to portfolio items
	const capstoneItems: PortfolioItem[] = capstones.map((c) => ({
		id: c.id,
		type: 'capstone' as const,
		title: c.title,
		description: c.description || 'Capstone project',
		createdAt: c.created_at || new Date().toISOString(),
		status: c.status === 'completed' ? ('complete' as const) : ('draft' as const),
		deliverableUrl: c.deliverable_url
	}));

	// Combine all items and sort by date
	const portfolioItems = [...deliverableItems, ...labItems, ...capstoneItems].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	// Calculate stats
	const stats = {
		totalItems: portfolioItems.length,
		completed: portfolioItems.filter((i) => i.status === 'complete').length,
		phasesWithDeliverables: new Set(
			deliverableItems.filter((i) => i.status === 'complete').map((i) => i.phase)
		).size,
		hasCapstone: capstoneItems.some((c) => c.status === 'complete')
	};

	return {
		portfolioItems,
		stats
	};
};

export const actions: Actions = {
	// Create a new phase deliverable
	create: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio');
		}

		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const phaseId = formData.get('phaseId')?.toString();
		const deliverableUrl = formData.get('deliverableUrl')?.toString().trim();

		if (!title) {
			return fail(400, { error: 'Title is required', field: 'title' });
		}

		if (!phaseId || !['phase-1', 'phase-2', 'phase-3', 'phase-4'].includes(phaseId)) {
			return fail(400, { error: 'Valid phase is required', field: 'phaseId' });
		}

		// Type assertion needed due to Supabase SSR typing quirk
		const { error } = await (locals.supabase.from('phase_deliverables') as any).insert({
			user_id: user.id,
			title,
			description: description || null,
			phase_id: phaseId,
			deliverable_url: deliverableUrl || null
		});

		if (error) {
			console.error('Error creating deliverable:', error);
			return fail(500, { error: 'Failed to create deliverable' });
		}

		return { success: true };
	},

	// Update an existing phase deliverable
	update: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const deliverableUrl = formData.get('deliverableUrl')?.toString().trim();
		const markComplete = formData.get('markComplete') === 'true';

		if (!id) {
			return fail(400, { error: 'Deliverable ID is required' });
		}

		if (!title) {
			return fail(400, { error: 'Title is required', field: 'title' });
		}

		const updateData: Record<string, unknown> = {
			title,
			description: description || null,
			deliverable_url: deliverableUrl || null,
			updated_at: new Date().toISOString()
		};

		if (markComplete) {
			updateData.submitted_at = new Date().toISOString();
		}

		// Type assertion needed due to Supabase SSR typing quirk
		const { error } = await (locals.supabase.from('phase_deliverables') as any)
			.update(updateData)
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			console.error('Error updating deliverable:', error);
			return fail(500, { error: 'Failed to update deliverable' });
		}

		return { success: true };
	},

	// Delete a phase deliverable
	delete: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			throw redirect(303, '/auth/login?next=/portfolio');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Deliverable ID is required' });
		}

		// Type assertion needed due to Supabase SSR typing quirk
		const { error } = await (locals.supabase.from('phase_deliverables') as any)
			.delete()
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			console.error('Error deleting deliverable:', error);
			return fail(500, { error: 'Failed to delete deliverable' });
		}

		return { success: true };
	}
};
