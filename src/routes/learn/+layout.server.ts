import type { LayoutServerLoad } from './$types';
import { getNavigation } from '$content/loader';

export const load: LayoutServerLoad = async () => {
	const navigation = await getNavigation();

	return {
		navigation
	};
};
