/**
 * Content loader for AI Operator Academy
 * Loads pre-built JSON content at runtime
 */

import type {
	Phase,
	Module,
	Lab,
	Curriculum,
	NavigationItem,
	BreadcrumbItem,
	PhaseMetadata
} from './types';

// =============================================================================
// Content Cache
// =============================================================================

let curriculumCache: Curriculum | null = null;
let navigationCache: NavigationItem[] | null = null;

// =============================================================================
// Main Loaders
// =============================================================================

/**
 * Load the full curriculum (all phases, modules, labs)
 */
export async function loadCurriculum(): Promise<Curriculum> {
	if (curriculumCache) {
		return curriculumCache;
	}

	try {
		// Import the pre-built curriculum JSON
		const curriculumModule = await import('$content/generated/curriculum.json');
		curriculumCache = curriculumModule.default as Curriculum;
		return curriculumCache;
	} catch (error) {
		console.error('Failed to load curriculum:', error);
		throw new Error('Curriculum content not found. Run `npm run build:content` first.');
	}
}

/**
 * Load a specific phase by ID
 */
export async function loadPhase(phaseId: string): Promise<Phase | null> {
	const curriculum = await loadCurriculum();
	return curriculum.phases.find((p) => p.metadata.id === phaseId) || null;
}

/**
 * Load a specific module by slug
 */
export async function loadModule(slug: string): Promise<Module | null> {
	const curriculum = await loadCurriculum();

	for (const phase of curriculum.phases) {
		const module = phase.modules.find((m) => m.slug === slug);
		if (module) {
			return module;
		}
	}

	return null;
}

/**
 * Load a specific lab by slug
 */
export async function loadLab(slug: string): Promise<Lab | null> {
	const curriculum = await loadCurriculum();

	// Check capstone first
	if (curriculum.capstone.slug === slug) {
		return curriculum.capstone;
	}

	// Check phase labs
	for (const phase of curriculum.phases) {
		const lab = phase.labs.find((l) => l.slug === slug);
		if (lab) {
			return lab;
		}
	}

	return null;
}

// =============================================================================
// Navigation
// =============================================================================

/**
 * Build navigation tree for sidebar
 */
export async function getNavigation(): Promise<NavigationItem[]> {
	if (navigationCache) {
		return navigationCache;
	}

	const curriculum = await loadCurriculum();

	const navigation: NavigationItem[] = curriculum.phases.map((phase) => ({
		id: phase.metadata.id,
		title: phase.metadata.title,
		href: `/learn/phase/${phase.metadata.order}`,
		type: 'phase' as const,
		phase: phase.metadata.order,
		children: [
			// Modules
			...phase.modules.map((module) => ({
				id: module.id,
				title: module.title,
				href: `/learn/phase/${phase.metadata.order}/${module.slug}`,
				type: 'module' as const,
				phase: phase.metadata.order
			})),
			// Labs
			...phase.labs.map((lab) => ({
				id: lab.id,
				title: lab.title,
				href: `/learn/lab/${lab.slug}`,
				type: 'lab' as const,
				phase: phase.metadata.order
			}))
		]
	}));

	// Add capstone
	navigation.push({
		id: curriculum.capstone.id,
		title: curriculum.capstone.title,
		href: `/learn/lab/${curriculum.capstone.slug}`,
		type: 'capstone',
		children: []
	});

	navigationCache = navigation;
	return navigation;
}

/**
 * Get breadcrumbs for a given path
 */
export async function getBreadcrumbs(
	type: 'module' | 'lab' | 'phase',
	slug: string
): Promise<BreadcrumbItem[]> {
	const curriculum = await loadCurriculum();
	const breadcrumbs: BreadcrumbItem[] = [{ label: 'Learn', href: '/learn' }];

	if (type === 'phase') {
		const phase = curriculum.phases.find((p) => p.metadata.order.toString() === slug);
		if (phase) {
			breadcrumbs.push({
				label: phase.metadata.title,
				href: `/learn/phase/${phase.metadata.order}`
			});
		}
	} else if (type === 'module') {
		for (const phase of curriculum.phases) {
			const module = phase.modules.find((m) => m.slug === slug);
			if (module) {
				breadcrumbs.push({
					label: phase.metadata.title,
					href: `/learn/phase/${phase.metadata.order}`
				});
				breadcrumbs.push({
					label: module.title,
					href: `/learn/phase/${phase.metadata.order}/${module.slug}`
				});
				break;
			}
		}
	} else if (type === 'lab') {
		if (curriculum.capstone.slug === slug) {
			breadcrumbs.push({
				label: 'Capstone',
				href: `/learn/lab/${curriculum.capstone.slug}`
			});
		} else {
			for (const phase of curriculum.phases) {
				const lab = phase.labs.find((l) => l.slug === slug);
				if (lab) {
					breadcrumbs.push({
						label: phase.metadata.title,
						href: `/learn/phase/${phase.metadata.order}`
					});
					breadcrumbs.push({
						label: lab.title,
						href: `/learn/lab/${lab.slug}`
					});
					break;
				}
			}
		}
	}

	return breadcrumbs;
}

/**
 * Get next/previous navigation for a module
 */
export async function getModuleNavigation(
	slug: string
): Promise<{ prev: NavigationItem | null; next: NavigationItem | null }> {
	const curriculum = await loadCurriculum();

	// Flatten all modules in order
	const allModules: { module: Module; phase: PhaseMetadata }[] = [];
	for (const phase of curriculum.phases) {
		for (const module of phase.modules) {
			allModules.push({ module, phase: phase.metadata });
		}
	}

	const currentIndex = allModules.findIndex((m) => m.module.slug === slug);
	if (currentIndex === -1) {
		return { prev: null, next: null };
	}

	const prev =
		currentIndex > 0
			? {
					id: allModules[currentIndex - 1].module.id,
					title: allModules[currentIndex - 1].module.title,
					href: `/learn/phase/${allModules[currentIndex - 1].phase.order}/${allModules[currentIndex - 1].module.slug}`,
					type: 'module' as const,
					phase: allModules[currentIndex - 1].phase.order
				}
			: null;

	const next =
		currentIndex < allModules.length - 1
			? {
					id: allModules[currentIndex + 1].module.id,
					title: allModules[currentIndex + 1].module.title,
					href: `/learn/phase/${allModules[currentIndex + 1].phase.order}/${allModules[currentIndex + 1].module.slug}`,
					type: 'module' as const,
					phase: allModules[currentIndex + 1].phase.order
				}
			: null;

	return { prev, next };
}

// =============================================================================
// Statistics
// =============================================================================

/**
 * Get curriculum statistics
 */
export async function getCurriculumStats(): Promise<{
	totalPhases: number;
	totalModules: number;
	totalLabs: number;
	totalEstimatedHours: number;
}> {
	const curriculum = await loadCurriculum();

	let totalModules = 0;
	let totalLabs = 0;
	let totalEstimatedHours = 0;

	for (const phase of curriculum.phases) {
		totalModules += phase.modules.length;
		totalLabs += phase.labs.length;
		totalEstimatedHours += phase.metadata.estimatedHours;
	}

	// Add capstone hours
	if (curriculum.capstone.estimatedHours) {
		totalEstimatedHours += curriculum.capstone.estimatedHours;
	}

	return {
		totalPhases: curriculum.phases.length,
		totalModules,
		totalLabs: totalLabs + 1, // +1 for capstone
		totalEstimatedHours
	};
}

/**
 * Get all concepts across the curriculum
 */
export async function getAllConcepts(): Promise<
	Array<{
		concept: { id: string; term: string; definition: string };
		module: { id: string; title: string; slug: string };
		phase: { id: string; title: string };
	}>
> {
	const curriculum = await loadCurriculum();
	const concepts: Array<{
		concept: { id: string; term: string; definition: string };
		module: { id: string; title: string; slug: string };
		phase: { id: string; title: string };
	}> = [];

	for (const phase of curriculum.phases) {
		for (const module of phase.modules) {
			for (const concept of module.concepts) {
				concepts.push({
					concept: {
						id: concept.id,
						term: concept.term,
						definition: concept.definition
					},
					module: {
						id: module.id,
						title: module.title,
						slug: module.slug
					},
					phase: {
						id: phase.metadata.id,
						title: phase.metadata.title
					}
				});
			}
		}
	}

	return concepts;
}

// =============================================================================
// Related Content
// =============================================================================

export interface RelatedItem {
	id: string;
	title: string;
	type: 'module' | 'lab';
	href: string;
	phase: number;
	relationship: 'prerequisite' | 'next' | 'related';
}

/**
 * Get related content for a module
 * Returns prerequisites, next steps, and related modules/labs
 */
export async function getRelatedContent(moduleSlug: string): Promise<RelatedItem[]> {
	const curriculum = await loadCurriculum();
	const related: RelatedItem[] = [];

	// Find the current module and its position
	let currentModule: Module | null = null;
	let currentPhaseOrder = 0;

	for (const phase of curriculum.phases) {
		const moduleIndex = phase.modules.findIndex((m) => m.slug === moduleSlug);
		if (moduleIndex !== -1) {
			currentModule = phase.modules[moduleIndex];
			currentPhaseOrder = phase.metadata.order;
			break;
		}
	}

	if (!currentModule) {
		return [];
	}

	// Get all modules with their phase info
	const allModules: Array<{ module: Module; phase: PhaseMetadata }> = [];
	for (const phase of curriculum.phases) {
		for (const module of phase.modules) {
			allModules.push({ module, phase: phase.metadata });
		}
	}

	const currentGlobalIndex = allModules.findIndex((m) => m.module.slug === moduleSlug);

	// Add prerequisite (previous module)
	if (currentGlobalIndex > 0) {
		const prev = allModules[currentGlobalIndex - 1];
		related.push({
			id: prev.module.id,
			title: prev.module.title,
			type: 'module',
			href: `/learn/phase/${prev.phase.order}/${prev.module.slug}`,
			phase: prev.phase.order,
			relationship: 'prerequisite'
		});
	}

	// Add next step (next module)
	if (currentGlobalIndex < allModules.length - 1) {
		const next = allModules[currentGlobalIndex + 1];
		related.push({
			id: next.module.id,
			title: next.module.title,
			type: 'module',
			href: `/learn/phase/${next.phase.order}/${next.module.slug}`,
			phase: next.phase.order,
			relationship: 'next'
		});
	}

	// Add related lab from same phase
	const currentPhase = curriculum.phases.find((p) => p.metadata.order === currentPhaseOrder);
	if (currentPhase && currentPhase.labs.length > 0) {
		const phaseLab = currentPhase.labs[0]; // First lab in the phase
		related.push({
			id: phaseLab.id,
			title: phaseLab.title,
			type: 'lab',
			href: `/learn/lab/${phaseLab.slug}`,
			phase: currentPhaseOrder,
			relationship: 'related'
		});
	}

	// Add related modules from the same phase (excluding current)
	if (currentPhase) {
		const otherModules = currentPhase.modules.filter((m) => m.slug !== moduleSlug);
		for (const module of otherModules.slice(0, 2)) {
			// Limit to 2 related modules
			related.push({
				id: module.id,
				title: module.title,
				type: 'module',
				href: `/learn/phase/${currentPhaseOrder}/${module.slug}`,
				phase: currentPhaseOrder,
				relationship: 'related'
			});
		}
	}

	return related;
}

// =============================================================================
// Search
// =============================================================================

export interface SearchResult {
	type: 'module' | 'lab' | 'concept';
	title: string;
	description: string;
	href: string;
	phase?: number;
	matchContext?: string;
}

/**
 * Search curriculum content
 * Searches modules, labs, and concepts by title, description, and content
 */
export async function searchContent(query: string, limit: number = 10): Promise<SearchResult[]> {
	if (!query || query.trim().length < 2) {
		return [];
	}

	const curriculum = await loadCurriculum();
	const searchTerm = query.toLowerCase().trim();
	const results: Array<SearchResult & { score: number }> = [];

	// Helper to calculate relevance score
	function getScore(text: string, term: string): number {
		const lowerText = text.toLowerCase();
		if (lowerText === term) return 100; // Exact match
		if (lowerText.startsWith(term)) return 80; // Starts with
		if (lowerText.includes(term)) return 60; // Contains
		return 0;
	}

	// Helper to extract context around match
	function getMatchContext(text: string, term: string, maxLength: number = 100): string {
		const lowerText = text.toLowerCase();
		const index = lowerText.indexOf(term);
		if (index === -1) return text.slice(0, maxLength) + '...';

		const start = Math.max(0, index - 30);
		const end = Math.min(text.length, index + term.length + 50);
		let context = text.slice(start, end);

		if (start > 0) context = '...' + context;
		if (end < text.length) context = context + '...';

		return context;
	}

	// Search modules
	for (const phase of curriculum.phases) {
		for (const module of phase.modules) {
			const titleScore = getScore(module.title, searchTerm);
			const contentScore = module.content?.toLowerCase().includes(searchTerm) ? 40 : 0;

			const score = Math.max(titleScore, contentScore);
			if (score > 0) {
				// Extract a short description from the first section or content
				const firstSection = module.sections[0];
				const shortDesc = firstSection
					? firstSection.content.slice(0, 150).replace(/\n/g, ' ').trim() + '...'
					: module.content.slice(0, 150).replace(/\n/g, ' ').trim() + '...';

				results.push({
					type: 'module',
					title: module.title,
					description: shortDesc,
					href: `/learn/phase/${phase.metadata.order}/${module.slug}`,
					phase: phase.metadata.order,
					matchContext: contentScore > 0 ? getMatchContext(module.content || '', searchTerm) : undefined,
					score
				});
			}
		}
	}

	// Search labs
	for (const phase of curriculum.phases) {
		for (const lab of phase.labs) {
			const titleScore = getScore(lab.title, searchTerm);
			const descScore = getScore(lab.description || '', searchTerm);
			const contentScore = lab.content?.toLowerCase().includes(searchTerm) ? 40 : 0;

			const score = Math.max(titleScore, descScore, contentScore);
			if (score > 0) {
				results.push({
					type: 'lab',
					title: lab.title,
					description: lab.description || '',
					href: `/learn/lab/${lab.slug}`,
					phase: phase.metadata.order,
					matchContext: contentScore > 0 ? getMatchContext(lab.content || '', searchTerm) : undefined,
					score
				});
			}
		}
	}

	// Search capstone
	const capstone = curriculum.capstone;
	const capstoneScore = Math.max(
		getScore(capstone.title, searchTerm),
		getScore(capstone.description || '', searchTerm),
		capstone.content?.toLowerCase().includes(searchTerm) ? 40 : 0
	);
	if (capstoneScore > 0) {
		results.push({
			type: 'lab',
			title: capstone.title,
			description: capstone.description || '',
			href: `/learn/lab/${capstone.slug}`,
			matchContext: capstone.content?.toLowerCase().includes(searchTerm)
				? getMatchContext(capstone.content || '', searchTerm)
				: undefined,
			score: capstoneScore
		});
	}

	// Search concepts
	for (const phase of curriculum.phases) {
		for (const module of phase.modules) {
			for (const concept of module.concepts) {
				const termScore = getScore(concept.term, searchTerm);
				const defScore = getScore(concept.definition, searchTerm);

				const score = Math.max(termScore, defScore);
				if (score > 0) {
					results.push({
						type: 'concept',
						title: concept.term,
						description: concept.definition,
						href: `/learn/phase/${phase.metadata.order}/${module.slug}#concept-${concept.id}`,
						phase: phase.metadata.order,
						matchContext: defScore > termScore ? getMatchContext(concept.definition, searchTerm) : undefined,
						score
					});
				}
			}
		}
	}

	// Sort by score and limit
	return results
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ score, ...rest }) => rest);
}

// =============================================================================
// Clear Cache (for dev/testing)
// =============================================================================

export function clearContentCache(): void {
	curriculumCache = null;
	navigationCache = null;
}
