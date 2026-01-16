import type { RequestHandler } from './$types';
import { loadCurriculum } from '$lib/content/loader';

const SITE_URL = 'https://academy.ninochavez.co';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: number;
}

/**
 * Generate sitemap.xml dynamically from curriculum content
 * This helps search engines and AI assistants discover all pages
 */
export const GET: RequestHandler = async () => {
	const entries: SitemapEntry[] = [];
	const today = new Date().toISOString().split('T')[0];

	// Static pages
	entries.push(
		{ loc: '/', changefreq: 'weekly', priority: 1.0, lastmod: today },
		{ loc: '/learn', changefreq: 'weekly', priority: 0.9, lastmod: today },
		{ loc: '/syllabus', changefreq: 'monthly', priority: 0.7, lastmod: today },
		{ loc: '/faq', changefreq: 'monthly', priority: 0.7, lastmod: today },
		{ loc: '/auth/login', changefreq: 'monthly', priority: 0.3 },
		{ loc: '/auth/signup', changefreq: 'monthly', priority: 0.4 }
	);

	// Load curriculum for dynamic pages
	try {
		const curriculum = await loadCurriculum();

		// Phase pages
		for (const phase of curriculum.phases) {
			entries.push({
				loc: `/learn/phase/${phase.metadata.order}`,
				changefreq: 'weekly',
				priority: 0.8,
				lastmod: today
			});

			// Module pages
			for (const module of phase.modules) {
				entries.push({
					loc: `/learn/phase/${phase.metadata.order}/${module.slug}`,
					changefreq: 'monthly',
					priority: 0.7,
					lastmod: today
				});
			}

			// Lab pages
			for (const lab of phase.labs) {
				entries.push({
					loc: `/learn/lab/${lab.slug}`,
					changefreq: 'monthly',
					priority: 0.6,
					lastmod: today
				});
			}
		}

		// Capstone
		if (curriculum.capstone) {
			entries.push({
				loc: `/learn/lab/${curriculum.capstone.slug}`,
				changefreq: 'monthly',
				priority: 0.7,
				lastmod: today
			});
		}
	} catch (error) {
		console.error('Failed to load curriculum for sitemap:', error);
		// Continue with static pages only
	}

	// Generate XML
	const xml = generateSitemapXml(entries);

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
		}
	});
};

function generateSitemapXml(entries: SitemapEntry[]): string {
	const urlEntries = entries
		.map((entry) => {
			let url = `  <url>\n    <loc>${SITE_URL}${entry.loc}</loc>`;
			if (entry.lastmod) {
				url += `\n    <lastmod>${entry.lastmod}</lastmod>`;
			}
			if (entry.changefreq) {
				url += `\n    <changefreq>${entry.changefreq}</changefreq>`;
			}
			if (entry.priority !== undefined) {
				url += `\n    <priority>${entry.priority.toFixed(1)}</priority>`;
			}
			url += '\n  </url>';
			return url;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}
