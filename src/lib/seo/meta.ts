/**
 * Meta tag generators for SEO and social sharing
 * Includes Open Graph, Twitter Cards, and canonical tags
 */

const SITE_URL = 'https://academy.ninochavez.co';
const SITE_NAME = 'AI Analyst Academy';
const DEFAULT_IMAGE = `${SITE_URL}/og/home.png`;

// Page-specific OG images
const OG_IMAGES: Record<string, string> = {
	home: '/og/home.png',
	learn: '/og/learn.png',
	syllabus: '/og/syllabus.png',
	faq: '/og/faq.png',
	'phase-1': '/og/phase-1.png',
	'phase-2': '/og/phase-2.png',
	'phase-3': '/og/phase-3.png',
	'phase-4': '/og/phase-4.png',
	'phase-5': '/og/phase-5.png',
	'phase-6': '/og/phase-6.png'
};

/**
 * Get OG image for a specific page
 */
export function getOgImage(page: string): string {
	return OG_IMAGES[page] || DEFAULT_IMAGE;
}

export interface MetaTags {
	title: string;
	description: string;
	canonical: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: 'website' | 'article' | 'course';
	twitterCard?: 'summary' | 'summary_large_image';
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	author?: string;
	keywords?: string[];
	robots?: string;
}

export interface MetaTagsInput {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: 'website' | 'article' | 'course';
	keywords?: string[];
	noindex?: boolean;
}

/**
 * Generate complete meta tags object from input
 */
export function generateMetaTags(input: MetaTagsInput): MetaTags {
	const {
		title,
		description,
		path,
		image = DEFAULT_IMAGE,
		type = 'website',
		keywords = [],
		noindex = false
	} = input;

	const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
	const canonical = `${SITE_URL}${path}`;

	return {
		title: fullTitle,
		description,
		canonical,
		ogTitle: fullTitle,
		ogDescription: description,
		ogImage: image.startsWith('http') ? image : `${SITE_URL}${image}`,
		ogType: type,
		twitterCard: 'summary_large_image',
		twitterTitle: fullTitle,
		twitterDescription: description,
		twitterImage: image.startsWith('http') ? image : `${SITE_URL}${image}`,
		author: SITE_NAME,
		keywords: keywords.length > 0 ? keywords : undefined,
		robots: noindex ? 'noindex, nofollow' : 'index, follow'
	};
}

/**
 * Generate meta tags for the landing page
 */
export function getLandingPageMeta(): MetaTags {
	return generateMetaTags({
		title: 'AI Analyst Academy | Design Human-AI Systems for Business',
		description:
			'Learn to become an AI Analyst - Design human-AI systems and architect business automation through hands-on training with 24 modules, 12 labs, and a capstone project.',
		path: '/',
		image: getOgImage('home'),
		type: 'website',
		keywords: [
			'AI Analyst',
			'AI training',
			'AI course',
			'prompt engineering',
			'AI workflow',
			'business automation',
			'AI certification',
			'AI skills',
			'human-AI systems',
			'AI architecture'
		]
	});
}

/**
 * Generate meta tags for the curriculum overview page
 */
export function getLearnPageMeta(stats: {
	totalModules: number;
	totalLabs: number;
	totalEstimatedHours: number;
}): MetaTags {
	return generateMetaTags({
		title: 'AI Analyst Curriculum',
		description: `Master AI analysis skills through ${stats.totalModules} modules, ${stats.totalLabs} hands-on labs, and ${stats.totalEstimatedHours} hours of comprehensive training. Learn prompt engineering, workflow design, and AI strategy.`,
		path: '/learn',
		image: getOgImage('learn'),
		type: 'course',
		keywords: [
			'AI curriculum',
			'AI learning path',
			'AI modules',
			'AI labs',
			'AI training program',
			'AI certification course'
		]
	});
}

/**
 * Generate meta tags for a phase overview page
 */
export function getPhaseMeta(phase: {
	order: number;
	title: string;
	description: string;
	moduleCount: number;
	labCount: number;
}): MetaTags {
	return generateMetaTags({
		title: `Phase ${phase.order}: ${phase.title}`,
		description: `${phase.description} This phase includes ${phase.moduleCount} modules and ${phase.labCount} hands-on labs.`,
		path: `/learn/phase/${phase.order}`,
		image: getOgImage(`phase-${phase.order}`),
		type: 'course',
		keywords: [
			phase.title,
			`AI Phase ${phase.order}`,
			'AI training',
			'AI curriculum',
			...phase.title.toLowerCase().split(' ')
		]
	});
}

/**
 * Generate meta tags for a module page
 */
export function getModuleMeta(
	module: {
		id: string;
		title: string;
		slug: string;
		concepts?: Array<{ term: string }>;
		sections?: Array<{ content: string }>;
	},
	phaseOrder: number,
	phaseTitle: string
): MetaTags {
	// Extract a description from first section or use concepts
	let description = `Learn ${module.title} in the ${phaseTitle} phase of AI Analyst Academy.`;
	if (module.sections && module.sections.length > 0) {
		const firstContent = module.sections[0].content.replace(/\n/g, ' ').trim();
		if (firstContent.length > 50) {
			description = firstContent.slice(0, 155) + '...';
		}
	}

	// Build keywords from concepts
	const keywords: string[] = [module.title, phaseTitle, 'AI training', 'AI module'];
	if (module.concepts) {
		keywords.push(...module.concepts.slice(0, 5).map((c) => c.term));
	}

	return generateMetaTags({
		title: `${module.title} | Phase ${phaseOrder}`,
		description,
		path: `/learn/phase/${phaseOrder}/${module.slug}`,
		type: 'article',
		keywords
	});
}

/**
 * Generate meta tags for a lab page
 */
export function getLabMeta(lab: {
	title: string;
	slug: string;
	description?: string;
	estimatedHours?: number;
}): MetaTags {
	const description =
		lab.description ||
		`Hands-on lab: ${lab.title}. Practice your AI Analyst skills with this practical exercise.`;

	return generateMetaTags({
		title: `Lab: ${lab.title}`,
		description: lab.estimatedHours
			? `${description} Estimated time: ${lab.estimatedHours} hours.`
			: description,
		path: `/learn/lab/${lab.slug}`,
		type: 'article',
		keywords: ['AI lab', 'hands-on exercise', lab.title, 'AI practice', 'AI Analyst training']
	});
}

/**
 * Generate meta tags for the syllabus page
 */
export function getSyllabusMeta(): MetaTags {
	return generateMetaTags({
		title: 'Syllabus',
		description:
			'Complete syllabus for the AI Analyst Academy curriculum. View all phases, modules, labs, and learning outcomes.',
		path: '/syllabus',
		image: getOgImage('syllabus'),
		type: 'article',
		keywords: ['AI syllabus', 'AI curriculum outline', 'AI course structure', 'AI learning outcomes']
	});
}

/**
 * Generate meta tags for the FAQ page
 */
export function getFaqMeta(): MetaTags {
	return generateMetaTags({
		title: 'Frequently Asked Questions',
		description:
			'Find answers to common questions about the AI Analyst Academy curriculum, learning format, prerequisites, and career outcomes.',
		path: '/faq',
		image: getOgImage('faq'),
		type: 'website',
		keywords: [
			'AI Analyst FAQ',
			'AI training questions',
			'AI course FAQ',
			'AI certification questions',
			'learn AI FAQ'
		]
	});
}

// =============================================================================
// Utility functions for Svelte components
// =============================================================================

/**
 * Format keywords array as meta content string
 */
export function formatKeywords(keywords: string[]): string {
	return keywords.join(', ');
}

/**
 * Get the site URL for canonical/og purposes
 */
export function getSiteUrl(): string {
	return SITE_URL;
}

/**
 * Get the default OG image URL
 */
export function getDefaultOgImage(): string {
	return DEFAULT_IMAGE;
}
