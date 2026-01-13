<script lang="ts">
	import type { ContentSection } from '$lib/content/types';

	interface Props {
		/** Available sections */
		sections: ContentSection[];
		/** Currently active section ID */
		activeSection?: string;
		/** Sections that have been viewed */
		viewedSections?: string[];
		/** Callback when section is clicked */
		onSectionClick?: (sectionId: string) => void;
	}

	let {
		sections,
		activeSection,
		viewedSections = [],
		onSectionClick
	}: Props = $props();


	function getSectionLabel(type: ContentSection['type']): string {
		switch (type) {
			case 'why':
				return 'Why It Matters';
			case 'what':
				return 'Core Concepts';
			case 'how':
				return 'How To Apply';
			default:
				return 'Content';
		}
	}

	function isViewed(sectionId: string): boolean {
		return viewedSections.includes(sectionId);
	}
</script>

<nav class="section-nav" aria-label="Module sections">
	<div class="section-nav-label">Sections</div>
	<ul class="section-list">
		{#each sections as section (section.id)}
			<li class="section-item">
				<button
					class="section-btn"
					class:active={activeSection === section.id}
					class:viewed={isViewed(section.id)}
					onclick={() => onSectionClick?.(section.id)}
					aria-current={activeSection === section.id ? 'true' : undefined}
				>
					<span class="section-icon">
						{#if section.type === 'why'}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10" />
								<circle cx="12" cy="12" r="4" />
								<line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
								<line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
								<line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
								<line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
							</svg>
						{:else if section.type === 'what'}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
								<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
							</svg>
						{:else if section.type === 'how'}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
							</svg>
						{:else}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
						{/if}
					</span>
					<span class="section-info">
						<span class="section-type">{section.type.toUpperCase()}</span>
						<span class="section-title">{section.title || getSectionLabel(section.type)}</span>
					</span>
					{#if isViewed(section.id)}
						<span class="viewed-indicator" title="Viewed">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						</span>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.section-nav {
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.section-nav-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-3);
	}

	.section-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	@media (min-width: 640px) {
		.section-list {
			flex-direction: row;
		}
	}

	.section-item {
		flex: 1;
	}

	.section-btn {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3);
		border: var(--border-width-2) solid transparent;
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		text-align: left;
		transition: all var(--duration-150) var(--ease-out);
	}

	.section-btn:hover {
		border-color: var(--color-border-primary);
	}

	.section-btn.active {
		border-color: var(--color-primary-500);
		background-color: var(--active-subtle-bg);
	}

	.section-btn.viewed:not(.active) {
		background-color: var(--viewed-subtle-bg);
	}

	.section-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-text-tertiary);
	}

	.section-btn.active .section-icon {
		color: var(--color-primary-500);
	}

	.section-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.section-type {
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		letter-spacing: 0.1em;
		color: var(--color-text-tertiary);
	}

	.section-btn.active .section-type {
		color: var(--color-primary-600);
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.viewed-indicator {
		flex-shrink: 0;
		color: var(--color-success-500);
	}
</style>
