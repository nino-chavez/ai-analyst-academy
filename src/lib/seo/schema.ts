/**
 * JSON-LD Schema generators for AEO (Answer Engine Optimization)
 * These schemas help AI assistants and search engines understand the course structure
 */

import type { BreadcrumbItem } from '$lib/content/types';

// Input types for schema generators (subset of full types)
export interface ModuleSchemaInput {
	id: string;
	title: string;
	slug: string;
	bloomLevel?: string;
	estimatedMinutes?: number;
	concepts?: Array<{ term: string }>;
	sections?: Array<{ content: string }>;
}

export interface LabSchemaInput {
	id: string;
	title: string;
	slug: string;
	description?: string;
	estimatedHours?: number;
}

const SITE_URL = 'https://academy.ninochavez.co';
const SITE_NAME = 'AI Analyst Academy';
const SITE_DESCRIPTION =
	'Learn to become an AI Analyst - Design human-AI systems and architect business automation through hands-on training';

// =============================================================================
// Organization Schema
// =============================================================================

export interface OrganizationSchema {
	'@context': 'https://schema.org';
	'@type': 'Organization';
	name: string;
	url: string;
	logo: string;
	description: string;
	sameAs?: string[];
}

export function generateOrganizationSchema(): OrganizationSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		logo: `${SITE_URL}/android-chrome-512x512.png`,
		description: SITE_DESCRIPTION
	};
}

// =============================================================================
// Course Schema (for the main curriculum)
// =============================================================================

export interface CourseSchema {
	'@context': 'https://schema.org';
	'@type': 'Course';
	name: string;
	description: string;
	url: string;
	provider: {
		'@type': 'Organization';
		name: string;
		url: string;
	};
	courseCode?: string;
	numberOfCredits?: number;
	hasCourseInstance?: CourseInstanceSchema[];
	teaches?: string[];
	educationalLevel?: string;
	timeRequired?: string;
	isAccessibleForFree?: boolean;
	inLanguage?: string;
}

export interface CourseInstanceSchema {
	'@type': 'CourseInstance';
	name: string;
	description?: string;
	courseMode: string;
	courseWorkload?: string;
}

export function generateCourseSchema(stats: {
	totalPhases: number;
	totalModules: number;
	totalLabs: number;
	totalEstimatedHours: number;
}): CourseSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'AI Analyst Certification',
		description: `A comprehensive ${stats.totalModules}-module curriculum to master AI analysis skills. Learn to design human-AI systems, architect business automation, and lead AI initiatives through ${stats.totalPhases} phases and ${stats.totalLabs} hands-on labs.`,
		url: `${SITE_URL}/learn`,
		provider: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		courseCode: 'AI-ANALYST-2025',
		teaches: [
			'AI Literacy and Economics',
			'Prompt Engineering',
			'Context Window Management',
			'Workflow Engineering',
			'Process Decomposition',
			'AI Agent Orchestration',
			'Multi-Agent Systems',
			'AI Strategy and ROI Analysis',
			'AI Governance and Risk Management',
			'Change Management for AI',
			'Enterprise AI Architecture'
		],
		educationalLevel: 'Professional',
		timeRequired: `PT${stats.totalEstimatedHours}H`,
		isAccessibleForFree: true,
		inLanguage: 'en'
	};
}

// =============================================================================
// LearningResource Schema (for individual modules)
// =============================================================================

export interface LearningResourceSchema {
	'@context': 'https://schema.org';
	'@type': 'LearningResource';
	name: string;
	description: string;
	url: string;
	learningResourceType: string;
	educationalLevel?: string;
	timeRequired?: string;
	teaches?: string[];
	isPartOf?: {
		'@type': 'Course';
		name: string;
		url: string;
	};
	position?: number;
	inLanguage?: string;
}

export function generateModuleSchema(
	module: ModuleSchemaInput,
	phaseOrder: number,
	moduleIndex: number
): LearningResourceSchema {
	// Extract teaching points from concepts
	const teaches = module.concepts?.map((c) => c.term) || [];

	// Get first section content for description if no explicit description
	const description =
		module.sections?.[0]?.content.slice(0, 200).replace(/\n/g, ' ').trim() + '...' ||
		`Module ${module.id} of the AI Analyst curriculum`;

	return {
		'@context': 'https://schema.org',
		'@type': 'LearningResource',
		name: module.title,
		description,
		url: `${SITE_URL}/learn/phase/${phaseOrder}/${module.slug}`,
		learningResourceType: 'Module',
		educationalLevel: module.bloomLevel || 'Intermediate',
		timeRequired: module.estimatedMinutes ? `PT${module.estimatedMinutes}M` : undefined,
		teaches: teaches.length > 0 ? teaches : undefined,
		isPartOf: {
			'@type': 'Course',
			name: 'AI Analyst Certification',
			url: `${SITE_URL}/learn`
		},
		position: moduleIndex + 1,
		inLanguage: 'en'
	};
}

// =============================================================================
// EducationalEvent Schema (for labs)
// =============================================================================

export interface LabSchema {
	'@context': 'https://schema.org';
	'@type': 'LearningResource';
	name: string;
	description: string;
	url: string;
	learningResourceType: string;
	educationalLevel?: string;
	timeRequired?: string;
	isPartOf?: {
		'@type': 'Course';
		name: string;
		url: string;
	};
	inLanguage?: string;
}

export function generateLabSchema(lab: LabSchemaInput): LabSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'LearningResource',
		name: lab.title,
		description: lab.description || `Hands-on lab: ${lab.title}`,
		url: `${SITE_URL}/learn/lab/${lab.slug}`,
		learningResourceType: 'Hands-on Lab',
		educationalLevel: 'Professional',
		timeRequired: lab.estimatedHours ? `PT${lab.estimatedHours}H` : undefined,
		isPartOf: {
			'@type': 'Course',
			name: 'AI Analyst Certification',
			url: `${SITE_URL}/learn`
		},
		inLanguage: 'en'
	};
}

// =============================================================================
// Breadcrumb Schema
// =============================================================================

export interface BreadcrumbListSchema {
	'@context': 'https://schema.org';
	'@type': 'BreadcrumbList';
	itemListElement: BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
	'@type': 'ListItem';
	position: number;
	name: string;
	item: string;
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): BreadcrumbListSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.label,
			item: crumb.href.startsWith('/') ? `${SITE_URL}${crumb.href}` : crumb.href
		}))
	};
}

// =============================================================================
// WebPage Schema
// =============================================================================

export interface WebPageSchema {
	'@context': 'https://schema.org';
	'@type': 'WebPage' | 'CollectionPage' | 'AboutPage';
	name: string;
	description: string;
	url: string;
	isPartOf: {
		'@type': 'WebSite';
		name: string;
		url: string;
	};
	breadcrumb?: BreadcrumbListSchema;
	mainEntity?: object;
	inLanguage?: string;
}

export function generateWebPageSchema(
	name: string,
	description: string,
	path: string,
	type: 'WebPage' | 'CollectionPage' | 'AboutPage' = 'WebPage',
	breadcrumbs?: BreadcrumbItem[]
): WebPageSchema {
	const schema: WebPageSchema = {
		'@context': 'https://schema.org',
		'@type': type,
		name,
		description,
		url: `${SITE_URL}${path}`,
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: SITE_URL
		},
		inLanguage: 'en'
	};

	if (breadcrumbs && breadcrumbs.length > 0) {
		schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
	}

	return schema;
}

// =============================================================================
// FAQ Schema (for potential FAQ sections)
// =============================================================================

export interface FAQSchema {
	'@context': 'https://schema.org';
	'@type': 'FAQPage';
	mainEntity: FAQItemSchema[];
}

export interface FAQItemSchema {
	'@type': 'Question';
	name: string;
	acceptedAnswer: {
		'@type': 'Answer';
		text: string;
	};
}

export function generateFAQSchema(
	faqs: Array<{ question: string; answer: string }>
): FAQSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

// =============================================================================
// Helper to serialize schemas for HTML injection
// =============================================================================

export function serializeSchema(schema: object): string {
	return JSON.stringify(schema, null, 0);
}

// =============================================================================
// Combined schema for landing page
// =============================================================================

export function generateLandingPageSchemas(stats: {
	totalPhases: number;
	totalModules: number;
	totalLabs: number;
	totalEstimatedHours: number;
}): object[] {
	return [
		generateOrganizationSchema(),
		generateCourseSchema(stats),
		generateWebPageSchema(
			'AI Analyst Academy - Design Human-AI Systems for Business',
			SITE_DESCRIPTION,
			'/'
		)
	];
}
