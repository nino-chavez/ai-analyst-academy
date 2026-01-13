/**
 * Content types for AI Operator Academy curriculum
 */

// =============================================================================
// Core Content Types
// =============================================================================

export interface PhaseMetadata {
	id: string;
	title: string;
	description: string;
	order: number;
	color: string;
	icon: string;
	estimatedHours: number;
	modules: string[];
	labs: string[];
	deliverable: {
		title: string;
		description: string;
	};
}

export interface ModuleFrontmatter {
	id: string;
	title: string;
	phase: number;
	module: number;
	estimatedMinutes: number;
	conceptSlugs: string[]; // Slugs from frontmatter
	bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface Module extends Omit<ModuleFrontmatter, 'conceptSlugs'> {
	slug: string;
	phaseId: string;
	content: string;
	htmlContent: string;
	sections: ContentSection[];
	concepts: ConceptDefinition[]; // Parsed concept definitions
	exercises: Exercise[];
	checklists: Checklist[];
}

export interface LabFrontmatter {
	id: string;
	title: string;
	phase: number | 'capstone';
	labNumber?: number;
	estimatedMinutes?: number;
	estimatedHours?: number;
	difficulty?: 'beginner' | 'intermediate' | 'advanced';
	description?: string;
	objectives: string[];
	prerequisites: string[];
}

export interface Lab extends LabFrontmatter {
	slug: string;
	content: string;
	htmlContent: string;
	sections: ContentSection[];
}

// =============================================================================
// Content Blocks (Custom Markdown Extensions)
// =============================================================================

export interface ContentSection {
	id: string;
	title: string;
	type: 'why' | 'what' | 'how' | 'generic';
	content: string;
	htmlContent: string;
}

export interface ConceptDefinition {
	id: string;
	term: string;
	definition: string;
	htmlDefinition: string;
}

export interface Exercise {
	id: string;
	title: string;
	type?: 'calculation' | 'analysis' | 'design' | 'practice' | 'reflection';
	scenario?: string;
	instructions: string;
	htmlInstructions: string;
}

export interface Checklist {
	id: string;
	items: ChecklistItem[];
}

export interface ChecklistItem {
	id: string;
	text: string;
	completed: boolean;
}

// =============================================================================
// Navigation & Structure
// =============================================================================

export interface Phase {
	metadata: PhaseMetadata;
	modules: Module[];
	labs: Lab[];
}

export interface Curriculum {
	phases: Phase[];
	capstone: Lab;
}

export interface NavigationItem {
	id: string;
	title: string;
	href: string;
	type: 'phase' | 'module' | 'lab' | 'capstone';
	phase?: number;
	children?: NavigationItem[];
}

export interface BreadcrumbItem {
	label: string;
	href: string;
}

// =============================================================================
// Progress Tracking
// =============================================================================

export interface ModuleProgress {
	moduleId: string;
	userId: string;
	startedAt: string | null;
	completedAt: string | null;
	sectionsViewed: string[];
	conceptsUnderstood: string[];
	exercisesCompleted: string[];
	checklistItems: Record<string, boolean>;
	quizScore: number | null;
	selfAssessmentScore: number | null;
	// Spaced repetition
	nextReviewAt: string | null;
	reviewCount: number;
	easeFactor: number;
}

export interface LabProgress {
	labId: string;
	userId: string;
	status: 'not_started' | 'in_progress' | 'completed';
	startedAt: string | null;
	completedAt: string | null;
	workData: Record<string, unknown>;
	deliverableUrl: string | null;
	score: number | null;
	feedback: string | null;
	rubricScores: Record<string, number>;
}

export interface PhaseProgress {
	phaseId: string;
	userId: string;
	modulesCompleted: number;
	modulesTotal: number;
	labsCompleted: number;
	labsTotal: number;
	deliverableSubmitted: boolean;
	completedAt: string | null;
}

export interface UserProgress {
	userId: string;
	phases: Record<string, PhaseProgress>;
	modules: Record<string, ModuleProgress>;
	labs: Record<string, LabProgress>;
	overallProgress: number; // 0-100
	currentStreak: number;
	longestStreak: number;
	lastActiveAt: string;
}

// =============================================================================
// Content Generation (Build Pipeline)
// =============================================================================

export interface ContentManifest {
	version: string;
	generatedAt: string;
	phases: {
		id: string;
		path: string;
		modulePaths: string[];
	}[];
	labs: {
		id: string;
		path: string;
	}[];
	capstone: {
		path: string;
	};
}

export interface ParsedMarkdown {
	frontmatter: Record<string, unknown>;
	content: string;
	htmlContent: string;
	blocks: {
		concepts: ConceptDefinition[];
		exercises: Exercise[];
		checklists: Checklist[];
	};
}

// =============================================================================
// Search
// =============================================================================

export interface SearchResult {
	id: string;
	type: 'module' | 'lab' | 'concept';
	title: string;
	excerpt: string;
	href: string;
	phase?: number;
	relevance: number;
}

export interface SearchIndex {
	modules: SearchIndexEntry[];
	labs: SearchIndexEntry[];
	concepts: SearchIndexEntry[];
}

export interface SearchIndexEntry {
	id: string;
	title: string;
	content: string;
	href: string;
	phase?: number;
	keywords: string[];
}

// =============================================================================
// Export Types
// =============================================================================

export interface ExportOptions {
	format: 'html' | 'pdf' | 'json';
	includeProgress?: boolean;
	phases?: number[];
	styling?: 'full' | 'minimal' | 'print';
}

export interface ExportedContent {
	title: string;
	generatedAt: string;
	content: string | Record<string, unknown>;
	metadata: {
		phaseCount: number;
		moduleCount: number;
		labCount: number;
		estimatedHours: number;
	};
}
