<script lang="ts">
	import {
		changelog,
		formatChangelogDate,
		getCategoryInfo,
		getLatestVersion
	} from '$lib/content/changelog';

	const latest = getLatestVersion();
</script>

<svelte:head>
	<title>Changelog | AI Analyst Academy</title>
	<meta
		name="description"
		content="See what's new in AI Analyst Academy. Release notes, new features, content updates, and improvements."
	/>
</svelte:head>

<div class="changelog-page">
	<header class="page-header">
		<h1 class="page-title">Changelog</h1>
		<p class="page-description">
			Updates, new features, and improvements to AI Analyst Academy.
		</p>
		<div class="version-badge">
			Current version: <code>v{latest.version}</code>
		</div>
	</header>

	<div class="timeline">
		{#each changelog as entry, index (entry.version)}
			{@const categoryInfo = getCategoryInfo(entry.category)}
			<article class="timeline-entry" class:latest={index === 0}>
				<div class="timeline-marker">
					<div class="marker-dot"></div>
					{#if index < changelog.length - 1}
						<div class="marker-line"></div>
					{/if}
				</div>

				<div class="entry-content">
					<div class="entry-header">
						<span class="category-badge {categoryInfo.color}">{categoryInfo.label}</span>
						<span class="version">v{entry.version}</span>
						<time class="date" datetime={entry.date}>{formatChangelogDate(entry.date)}</time>
					</div>

					<h2 class="entry-title">{entry.title}</h2>
					<p class="entry-summary">{entry.summary}</p>

					<div class="highlights-section">
						<h3 class="highlights-heading">Highlights</h3>
						<ul class="highlights">
							{#each entry.highlights as highlight}
								<li>{highlight}</li>
							{/each}
						</ul>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<footer class="page-footer">
		<p>
			Want to suggest a feature or report an issue?
			<a href="https://github.com/anthropics/claude-code/issues" target="_blank" rel="noopener">
				Open an issue on GitHub
			</a>
		</p>
	</footer>
</div>

<style>
	.changelog-page {
		max-width: var(--container-md);
		margin: 0 auto;
		padding: var(--space-8) var(--space-4);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--space-10);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.page-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.version-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.version-badge code {
		background-color: var(--color-bg-tertiary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-primary);
	}

	/* Timeline */
	.timeline {
		display: flex;
		flex-direction: column;
	}

	.timeline-entry {
		display: flex;
		gap: var(--space-6);
		position: relative;
	}

	.timeline-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		width: 20px;
	}

	.marker-dot {
		width: 12px;
		height: 12px;
		background-color: var(--color-bg-primary);
		border: 2px solid var(--color-border-primary);
		border-radius: var(--radius-full);
		z-index: 1;
	}

	.timeline-entry.latest .marker-dot {
		background-color: var(--color-primary-500);
		border-color: var(--color-primary-500);
	}

	.marker-line {
		flex: 1;
		width: 2px;
		background-color: var(--color-border-secondary);
		margin-top: var(--space-2);
	}

	.entry-content {
		flex: 1;
		padding-bottom: var(--space-10);
	}

	.entry-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		flex-wrap: wrap;
	}

	.category-badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.category-badge.primary {
		background-color: var(--primary-subtle-bg);
		color: var(--primary-subtle-text);
	}

	.category-badge.success {
		background-color: var(--success-subtle-bg);
		color: var(--success-subtle-text);
	}

	.category-badge.info {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
	}

	.category-badge.warning {
		background-color: var(--warning-subtle-bg);
		color: var(--warning-subtle-text);
	}

	.version {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		font-family: var(--font-mono);
	}

	.date {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.entry-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.entry-summary {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
		line-height: var(--leading-relaxed);
	}

	.highlights-section {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.highlights-heading {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.highlights {
		margin: 0;
		padding-left: var(--space-5);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.highlights li {
		margin-bottom: var(--space-2);
	}

	.highlights li:last-child {
		margin-bottom: 0;
	}

	.page-footer {
		text-align: center;
		padding-top: var(--space-8);
		border-top: var(--border-width) solid var(--color-border-secondary);
		margin-top: var(--space-8);
	}

	.page-footer p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.page-footer a {
		color: var(--color-primary-600);
		text-decoration: none;
	}

	.page-footer a:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.timeline-marker {
			display: none;
		}

		.timeline-entry {
			gap: 0;
		}

		.entry-content {
			padding-bottom: var(--space-8);
			border-bottom: var(--border-width) solid var(--color-border-secondary);
			margin-bottom: var(--space-8);
		}

		.timeline-entry:last-child .entry-content {
			border-bottom: none;
			margin-bottom: 0;
		}

		.entry-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}
	}
</style>
