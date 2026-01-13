<script lang="ts">
	interface RelatedItem {
		id: string;
		title: string;
		type: 'module' | 'lab';
		href: string;
		phase: number;
		relationship: 'prerequisite' | 'next' | 'related';
	}

	interface Props {
		/** Items related to the current module */
		items: RelatedItem[];
		/** Current phase number for highlighting */
		currentPhase?: number;
	}

	let { items, currentPhase }: Props = $props();

	// Group items by relationship type
	const prerequisites = $derived(items.filter((i) => i.relationship === 'prerequisite'));
	const nextSteps = $derived(items.filter((i) => i.relationship === 'next'));
	const related = $derived(items.filter((i) => i.relationship === 'related'));

	function getTypeIcon(type: 'module' | 'lab') {
		if (type === 'lab') {
			return 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.066l.792.316a2.25 2.25 0 001.55.132l.932-.266a2.25 2.25 0 001.169-.736l1.125-1.403';
		}
		return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
	}

	const hasContent = $derived(prerequisites.length > 0 || nextSteps.length > 0 || related.length > 0);
</script>

{#if hasContent}
	<aside class="related-modules" aria-labelledby="related-heading">
		<h2 id="related-heading" class="related-title">Related Content</h2>

		{#if prerequisites.length > 0}
			<div class="related-group">
				<h3 class="group-heading">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M15 18l-6-6 6-6" />
					</svg>
					Prerequisites
				</h3>
				<ul class="related-list">
					{#each prerequisites as item (item.id)}
						<li>
							<a href={item.href} class="related-link">
								<span class="link-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<path d={getTypeIcon(item.type)} />
									</svg>
								</span>
								<span class="link-content">
									<span class="link-title">{item.title}</span>
									<span class="link-meta">Phase {item.phase} · {item.type}</span>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if nextSteps.length > 0}
			<div class="related-group">
				<h3 class="group-heading">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 18l6-6-6-6" />
					</svg>
					Next Steps
				</h3>
				<ul class="related-list">
					{#each nextSteps as item (item.id)}
						<li>
							<a href={item.href} class="related-link next">
								<span class="link-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<path d={getTypeIcon(item.type)} />
									</svg>
								</span>
								<span class="link-content">
									<span class="link-title">{item.title}</span>
									<span class="link-meta">Phase {item.phase} · {item.type}</span>
								</span>
								<svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if related.length > 0}
			<div class="related-group">
				<h3 class="group-heading">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
						<path d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
					</svg>
					Related Topics
				</h3>
				<ul class="related-list horizontal">
					{#each related as item (item.id)}
						<li>
							<a href={item.href} class="related-chip" class:same-phase={item.phase === currentPhase}>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</aside>
{/if}

<style>
	.related-modules {
		margin-top: var(--space-8);
		padding: var(--space-6);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-xl);
	}

	.related-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-5) 0;
	}

	.related-group {
		margin-bottom: var(--space-5);
	}

	.related-group:last-child {
		margin-bottom: 0;
	}

	.group-heading {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.related-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.related-list.horizontal {
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.related-link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.related-link:hover {
		border-color: var(--color-primary-300);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
	}

	.related-link:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	.related-link.next {
		border-color: var(--color-primary-200);
		background-color: var(--color-primary-50);
	}

	.related-link.next:hover {
		border-color: var(--color-primary-400);
		background-color: var(--color-primary-100);
	}

	.link-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
	}

	.link-content {
		flex: 1;
		min-width: 0;
	}

	.link-title {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.link-meta {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: capitalize;
	}

	.link-arrow {
		flex-shrink: 0;
		color: var(--color-primary-500);
	}

	.related-chip {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-full);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.related-chip:hover {
		color: var(--color-primary-600);
		border-color: var(--color-primary-300);
		text-decoration: none;
	}

	.related-chip.same-phase {
		background-color: var(--color-primary-50);
		border-color: var(--color-primary-200);
		color: var(--color-primary-700);
	}
</style>
