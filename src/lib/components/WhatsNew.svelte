<script lang="ts">
	import {
		getRecentChanges,
		formatChangelogDate,
		getCategoryInfo,
		type ChangelogEntry
	} from '$lib/content/changelog';

	interface Props {
		maxEntries?: number;
	}

	let { maxEntries = 2 }: Props = $props();

	// Use $derived to track prop changes
	const entries = $derived(getRecentChanges(maxEntries));
</script>

<section class="whats-new">
	<div class="section-header">
		<h2 class="section-title">What's New</h2>
		<a href="/changelog" class="view-all">
			View all updates
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</a>
	</div>

	<div class="entries">
		{#each entries as entry (entry.version)}
			{@const categoryInfo = getCategoryInfo(entry.category)}
			<article class="entry">
				<div class="entry-header">
					<span class="category-badge {categoryInfo.color}">{categoryInfo.label}</span>
					<span class="version">v{entry.version}</span>
					<span class="date">{formatChangelogDate(entry.date)}</span>
				</div>
				<h3 class="entry-title">{entry.title}</h3>
				<p class="entry-summary">{entry.summary}</p>
				<ul class="highlights">
					{#each entry.highlights.slice(0, 3) as highlight}
						<li>{highlight}</li>
					{/each}
					{#if entry.highlights.length > 3}
						<li class="more">+{entry.highlights.length - 3} more</li>
					{/if}
				</ul>
			</article>
		{/each}
	</div>
</section>

<style>
	.whats-new {
		max-width: var(--container-md);
		margin: var(--space-12) auto;
		padding: 0 var(--space-4);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-6);
	}

	.section-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.view-all {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-primary-600);
		text-decoration: none;
		transition: color var(--duration-150) var(--ease-out);
	}

	.view-all:hover {
		color: var(--color-primary-700);
	}

	.entries {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.entry {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		transition:
			border-color var(--duration-150) var(--ease-out),
			box-shadow var(--duration-150) var(--ease-out);
	}

	.entry:hover {
		border-color: var(--color-border-secondary);
		box-shadow: var(--shadow-sm);
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
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		font-family: var(--font-mono);
	}

	.date {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.entry-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.entry-summary {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-3) 0;
		line-height: var(--leading-relaxed);
	}

	.highlights {
		margin: 0;
		padding-left: var(--space-5);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.highlights li {
		margin-bottom: var(--space-1);
	}

	.highlights li:last-child {
		margin-bottom: 0;
	}

	.highlights .more {
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	@media (max-width: 640px) {
		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.entry-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}
	}
</style>
