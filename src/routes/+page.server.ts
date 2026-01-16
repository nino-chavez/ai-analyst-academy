import type { PageServerLoad } from './$types';
import { getCurriculumStats } from '$lib/content/loader';

export const load: PageServerLoad = async () => {
	const stats = await getCurriculumStats();
	return { stats };
};
