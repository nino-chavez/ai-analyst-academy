/**
 * Changelog entries for AI Analyst Academy
 *
 * This file contains release notes and updates shown to users.
 * Entries are displayed on the homepage "What's New" section and /changelog page.
 */

export interface ChangelogEntry {
	version: string;
	date: string; // ISO date string
	title: string;
	summary: string;
	highlights: string[];
	category: 'feature' | 'content' | 'improvement' | 'fix';
}

export const changelog: ChangelogEntry[] = [
	{
		version: '1.3.0',
		date: '2026-01-16',
		title: 'Experiential Learning & Certification',
		summary: 'Major curriculum expansion addressing the gap between theory and practice with interactive simulations and a formal certification framework.',
		highlights: [
			'New Module 1.6: AI Mental Models — understand how LLMs work, not just how to use them',
			'Lab 8: Stakeholder Simulation — practice difficult conversations with AI personas',
			'Lab 7c: Crisis Response — compressed crisis scenarios for judgment building',
			'5 new Sandbox personas for stakeholder practice',
			'Portfolio Certification Framework with 4 certification levels'
		],
		category: 'content'
	},
	{
		version: '1.2.0',
		date: '2026-01-15',
		title: 'Answer Engine Optimization',
		summary: 'Comprehensive AEO implementation to ensure content is optimized for AI answer engines.',
		highlights: [
			'Structured data for all pages (JSON-LD)',
			'FAQ schema for common questions',
			'Course and module schema for learning content',
			'Improved meta descriptions and canonical URLs'
		],
		category: 'improvement'
	},
	{
		version: '1.1.0',
		date: '2026-01-14',
		title: 'Analytics & Tracking',
		summary: 'Privacy-focused analytics to understand how learners use the platform.',
		highlights: [
			'Vercel Analytics integration',
			'Custom event tracking for learning progress',
			'CTA click tracking for optimization',
			'No personal data collection'
		],
		category: 'feature'
	},
	{
		version: '1.0.0',
		date: '2026-01-12',
		title: 'Initial Launch',
		summary: 'AI Analyst Academy launches with complete curriculum covering 6 phases of AI implementation skills.',
		highlights: [
			'6 phases covering AI literacy to enterprise architecture',
			'24+ modules with WHY-WHAT-HOW structure',
			'12+ hands-on labs with real-world scenarios',
			'Progress tracking with spaced repetition',
			'AI Sandbox for prompt practice',
			'Portfolio system for deliverables'
		],
		category: 'feature'
	}
];

/**
 * Get the most recent changelog entries
 */
export function getRecentChanges(count: number = 3): ChangelogEntry[] {
	return changelog.slice(0, count);
}

/**
 * Get the latest version info
 */
export function getLatestVersion(): { version: string; date: string } {
	const latest = changelog[0];
	return {
		version: latest.version,
		date: latest.date
	};
}

/**
 * Format a date string for display
 */
export function formatChangelogDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Get category display info
 */
export function getCategoryInfo(category: ChangelogEntry['category']): {
	label: string;
	color: string;
} {
	const categories = {
		feature: { label: 'New Feature', color: 'primary' },
		content: { label: 'New Content', color: 'success' },
		improvement: { label: 'Improvement', color: 'info' },
		fix: { label: 'Bug Fix', color: 'warning' }
	};
	return categories[category];
}
