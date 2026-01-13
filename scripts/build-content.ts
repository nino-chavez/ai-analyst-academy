/**
 * Content Build Pipeline for AI Operator Academy
 *
 * This script processes markdown curriculum content and generates
 * JSON files for runtime consumption by the SvelteKit app.
 *
 * Usage: npx tsx scripts/build-content.ts
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';

// =============================================================================
// Types
// =============================================================================

interface PhaseMetadata {
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

interface ConceptDefinition {
	id: string;
	term: string;
	definition: string;
	htmlDefinition: string;
}

interface Exercise {
	id: string;
	title: string;
	type?: string;
	scenario?: string;
	instructions: string;
	htmlInstructions: string;
}

interface Checklist {
	id: string;
	items: Array<{
		id: string;
		text: string;
		completed: boolean;
	}>;
}

interface ContentSection {
	id: string;
	title: string;
	type: 'why' | 'what' | 'how' | 'generic';
	content: string;
	htmlContent: string;
}

interface Module {
	id: string;
	slug: string;
	title: string;
	phase: number;
	module: number;
	phaseId: string;
	estimatedMinutes: number;
	bloomLevel: string;
	content: string;
	htmlContent: string;
	sections: ContentSection[];
	concepts: ConceptDefinition[];
	exercises: Exercise[];
	checklists: Checklist[];
}

interface Lab {
	id: string;
	slug: string;
	title: string;
	phase: number | 'capstone';
	labNumber?: number;
	estimatedMinutes?: number;
	estimatedHours?: number;
	objectives: string[];
	prerequisites: string[];
	content: string;
	htmlContent: string;
	sections: ContentSection[];
}

interface Phase {
	metadata: PhaseMetadata;
	modules: Module[];
	labs: Lab[];
}

interface Curriculum {
	phases: Phase[];
	capstone: Lab;
}

// =============================================================================
// Configuration
// =============================================================================

const CONTENT_DIR = join(process.cwd(), 'content/curriculum');
const OUTPUT_DIR = join(process.cwd(), 'src/lib/content/generated');

// =============================================================================
// Markdown Parsing with Custom Blocks
// =============================================================================

/**
 * Parse custom blocks from markdown content
 * Supports: :::concept[id], :::exercise[id], :::checklist[id]
 */
function parseCustomBlocks(content: string): {
	cleanContent: string;
	concepts: ConceptDefinition[];
	exercises: Exercise[];
	checklists: Checklist[];
} {
	const concepts: ConceptDefinition[] = [];
	const exercises: Exercise[] = [];
	const checklists: Checklist[] = [];

	// Parse concepts: :::concept[id]\n...\n:::
	const conceptRegex = /:::concept\[([^\]]+)\]\n([\s\S]*?):::/g;
	let match;

	while ((match = conceptRegex.exec(content)) !== null) {
		const id = match[1];
		const definition = match[2].trim();
		concepts.push({
			id,
			term: id.replace(/-/g, ' '),
			definition,
			htmlDefinition: marked.parse(definition) as string
		});
	}

	// Parse exercises: :::exercise[id]\n...\n:::
	const exerciseRegex = /:::exercise\[([^\]]+)\]\n([\s\S]*?):::/g;

	while ((match = exerciseRegex.exec(content)) !== null) {
		const id = match[1];
		const body = match[2].trim();

		// Try to extract title from first line if it starts with **
		let title = id.replace(/-/g, ' ');
		let instructions = body;

		const titleMatch = body.match(/^\*\*([^*]+)\*\*:?\s*/);
		if (titleMatch) {
			title = titleMatch[1];
			instructions = body.slice(titleMatch[0].length).trim();
		}

		exercises.push({
			id,
			title,
			instructions,
			htmlInstructions: marked.parse(instructions) as string
		});
	}

	// Parse checklists: :::checklist[id]\n- [ ] item\n:::
	const checklistRegex = /:::checklist\[([^\]]+)\]\n([\s\S]*?):::/g;

	while ((match = checklistRegex.exec(content)) !== null) {
		const id = match[1];
		const body = match[2].trim();
		const items = body.split('\n').map((line, index) => {
			const checked = line.includes('[x]') || line.includes('[X]');
			const text = line.replace(/^-\s*\[[ xX]?\]\s*/, '').trim();
			return {
				id: `${id}-${index}`,
				text,
				completed: checked
			};
		});

		checklists.push({ id, items });
	}

	// Remove custom blocks from content for clean markdown
	let cleanContent = content
		.replace(conceptRegex, '')
		.replace(exerciseRegex, '')
		.replace(checklistRegex, '');

	// Clean up extra newlines
	cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();

	return { cleanContent, concepts, exercises, checklists };
}

/**
 * Parse sections from markdown content
 * Looks for WHY, WHAT, HOW section headers
 */
function parseSections(content: string): ContentSection[] {
	const sections: ContentSection[] = [];

	// Split by H2 headers
	const parts = content.split(/(?=^## )/m);

	for (const part of parts) {
		if (!part.trim()) continue;

		const headerMatch = part.match(/^## (.+)\n/);
		if (!headerMatch) continue;

		const title = headerMatch[1].trim();
		const sectionContent = part.slice(headerMatch[0].length).trim();

		// Determine section type
		let type: ContentSection['type'] = 'generic';
		const titleLower = title.toLowerCase();
		if (titleLower.includes('why')) type = 'why';
		else if (titleLower.includes('what')) type = 'what';
		else if (titleLower.includes('how')) type = 'how';

		sections.push({
			id: title.toLowerCase().replace(/\s+/g, '-'),
			title,
			type,
			content: sectionContent,
			htmlContent: marked.parse(sectionContent) as string
		});
	}

	return sections;
}

// =============================================================================
// Content Loaders
// =============================================================================

function loadPhaseMetadata(phasePath: string): PhaseMetadata | null {
	const metadataPath = join(phasePath, '_phase.yaml');
	if (!existsSync(metadataPath)) {
		console.warn(`No _phase.yaml found in ${phasePath}`);
		return null;
	}

	const content = readFileSync(metadataPath, 'utf-8');
	return parseYaml(content) as PhaseMetadata;
}

function loadModule(filePath: string, phaseId: string): Module {
	const content = readFileSync(filePath, 'utf-8');
	const { data: frontmatter, content: markdown } = matter(content);

	const { cleanContent, concepts, exercises, checklists } = parseCustomBlocks(markdown);
	const sections = parseSections(cleanContent);
	const htmlContent = marked.parse(cleanContent) as string;

	const slug = basename(filePath, '.md');

	return {
		id: frontmatter.id || slug,
		slug,
		title: frontmatter.title,
		phase: frontmatter.phase,
		module: frontmatter.module,
		phaseId,
		estimatedMinutes: frontmatter.estimatedMinutes || 10,
		bloomLevel: frontmatter.bloomLevel || 'understand',
		content: cleanContent,
		htmlContent,
		sections,
		concepts,
		exercises,
		checklists
	};
}

function loadLab(filePath: string): Lab {
	const content = readFileSync(filePath, 'utf-8');
	const { data: frontmatter, content: markdown } = matter(content);

	const { cleanContent } = parseCustomBlocks(markdown);
	const sections = parseSections(cleanContent);
	const htmlContent = marked.parse(cleanContent) as string;

	const slug = basename(filePath, '.md');

	return {
		id: frontmatter.id || slug,
		slug,
		title: frontmatter.title,
		phase: frontmatter.phase,
		labNumber: frontmatter.labNumber,
		estimatedMinutes: frontmatter.estimatedMinutes,
		estimatedHours: frontmatter.estimatedHours,
		objectives: frontmatter.objectives || [],
		prerequisites: frontmatter.prerequisites || [],
		content: cleanContent,
		htmlContent,
		sections
	};
}

// =============================================================================
// Main Build Function
// =============================================================================

function buildCurriculum(): Curriculum {
	const phasesDir = join(CONTENT_DIR, 'phases');
	const labsDir = join(CONTENT_DIR, 'labs');

	// Get all phase directories
	const phaseDirs = readdirSync(phasesDir)
		.filter((dir) => !dir.startsWith('.'))
		.sort();

	const phases: Phase[] = [];
	let capstone: Lab | null = null;

	// Process each phase
	for (const phaseDir of phaseDirs) {
		const phasePath = join(phasesDir, phaseDir);
		const metadata = loadPhaseMetadata(phasePath);

		if (!metadata) continue;

		// Load modules
		const moduleFiles = readdirSync(phasePath)
			.filter((f) => f.endsWith('.md'))
			.sort();

		const modules = moduleFiles.map((file) => loadModule(join(phasePath, file), metadata.id));

		// Find labs for this phase
		const phaseLabs: Lab[] = [];

		phases.push({
			metadata,
			modules,
			labs: phaseLabs
		});
	}

	// Load all labs
	if (existsSync(labsDir)) {
		const labFiles = readdirSync(labsDir).filter((f) => f.endsWith('.md'));

		for (const labFile of labFiles) {
			const lab = loadLab(join(labsDir, labFile));

			if (lab.phase === 'capstone' || labFile.includes('capstone')) {
				capstone = lab;
			} else {
				// Find the matching phase
				const phaseIndex = phases.findIndex((p) => p.metadata.order === lab.phase);
				if (phaseIndex !== -1) {
					phases[phaseIndex].labs.push(lab);
				}
			}
		}
	}

	// Sort labs by labNumber
	for (const phase of phases) {
		phase.labs.sort((a, b) => (a.labNumber || 0) - (b.labNumber || 0));
	}

	if (!capstone) {
		throw new Error('Capstone project not found');
	}

	return {
		phases,
		capstone
	};
}

// =============================================================================
// Output Generation
// =============================================================================

function generateOutput(curriculum: Curriculum): void {
	// Ensure output directory exists
	if (!existsSync(OUTPUT_DIR)) {
		mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	// Write full curriculum JSON
	writeFileSync(join(OUTPUT_DIR, 'curriculum.json'), JSON.stringify(curriculum, null, 2));

	// Write individual phase files for code splitting
	for (const phase of curriculum.phases) {
		writeFileSync(join(OUTPUT_DIR, `phase-${phase.metadata.order}.json`), JSON.stringify(phase, null, 2));
	}

	// Write manifest
	const manifest = {
		version: '1.0.0',
		generatedAt: new Date().toISOString(),
		phases: curriculum.phases.map((p) => ({
			id: p.metadata.id,
			order: p.metadata.order,
			title: p.metadata.title,
			moduleCount: p.modules.length,
			labCount: p.labs.length
		})),
		totalModules: curriculum.phases.reduce((sum, p) => sum + p.modules.length, 0),
		totalLabs: curriculum.phases.reduce((sum, p) => sum + p.labs.length, 0) + 1,
		totalEstimatedHours: curriculum.phases.reduce((sum, p) => sum + p.metadata.estimatedHours, 0)
	};

	writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

	console.log('✓ Generated curriculum.json');
	console.log(`  - ${curriculum.phases.length} phases`);
	console.log(`  - ${manifest.totalModules} modules`);
	console.log(`  - ${manifest.totalLabs} labs (including capstone)`);
	console.log(`  - ${manifest.totalEstimatedHours} estimated hours`);
}

// =============================================================================
// Main Execution
// =============================================================================

console.log('Building AI Operator Academy content...\n');

try {
	const curriculum = buildCurriculum();
	generateOutput(curriculum);
	console.log('\n✓ Content build complete!');
} catch (error) {
	console.error('Build failed:', error);
	process.exit(1);
}
