import type { PageServerLoad } from './$types';
import { loadCurriculum, getCurriculumStats } from '$content/loader';

export const load: PageServerLoad = async () => {
	const curriculum = await loadCurriculum();
	const stats = await getCurriculumStats();

	return {
		phases: curriculum.phases.map((phase) => ({
			id: phase.metadata.id,
			title: phase.metadata.title,
			description: phase.metadata.description,
			order: phase.metadata.order,
			color: phase.metadata.color,
			icon: phase.metadata.icon,
			estimatedHours: phase.metadata.estimatedHours,
			moduleCount: phase.modules.length,
			labCount: phase.labs.length,
			deliverable: phase.metadata.deliverable
		})),
		capstone: {
			id: curriculum.capstone.id,
			title: curriculum.capstone.title,
			slug: curriculum.capstone.slug,
			estimatedHours: curriculum.capstone.estimatedHours
		},
		stats
	};
};
