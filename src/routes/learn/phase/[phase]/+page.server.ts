import type { PageServerLoad } from './$types';
import { loadCurriculum } from '$content/loader';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const phaseNumber = parseInt(params.phase, 10);

	if (isNaN(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) {
		error(404, 'Phase not found');
	}

	const curriculum = await loadCurriculum();
	const phase = curriculum.phases.find((p) => p.metadata.order === phaseNumber);

	if (!phase) {
		error(404, 'Phase not found');
	}

	return {
		phase: {
			id: phase.metadata.id,
			title: phase.metadata.title,
			description: phase.metadata.description,
			order: phase.metadata.order,
			color: phase.metadata.color,
			icon: phase.metadata.icon,
			estimatedHours: phase.metadata.estimatedHours,
			deliverable: phase.metadata.deliverable
		},
		modules: phase.modules.map((module, index) => ({
			id: module.id,
			title: module.title,
			slug: module.slug,
			order: index + 1,
			estimatedMinutes: module.estimatedMinutes,
			// Extract first sentence as description if not present
			description: `Module ${phaseNumber}.${index + 1} of the ${phase.metadata.title} phase`
		})),
		labs: phase.labs.map((lab) => ({
			id: lab.id,
			title: lab.title,
			slug: lab.slug,
			estimatedMinutes: lab.estimatedMinutes,
			estimatedHours: lab.estimatedHours,
			difficulty: lab.difficulty || 'intermediate',
			description: lab.description || lab.objectives?.[0] || 'Hands-on lab exercise'
		})),
		phaseNumber
	};
};
