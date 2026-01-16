/**
 * SEO utilities for AI Analyst Academy
 * Exports schema generators and meta tag utilities
 */

// Schema generators
export {
	generateOrganizationSchema,
	generateCourseSchema,
	generateModuleSchema,
	generateLabSchema,
	generateBreadcrumbSchema,
	generateWebPageSchema,
	generateFAQSchema,
	generateLandingPageSchemas,
	serializeSchema,
	type OrganizationSchema,
	type CourseSchema,
	type LearningResourceSchema,
	type LabSchema,
	type BreadcrumbListSchema,
	type WebPageSchema,
	type FAQSchema,
	type ModuleSchemaInput,
	type LabSchemaInput
} from './schema';

// Meta tag generators
export {
	generateMetaTags,
	getLandingPageMeta,
	getLearnPageMeta,
	getPhaseMeta,
	getModuleMeta,
	getLabMeta,
	getSyllabusMeta,
	getFaqMeta,
	formatKeywords,
	getSiteUrl,
	getDefaultOgImage,
	getOgImage,
	type MetaTags,
	type MetaTagsInput
} from './meta';
