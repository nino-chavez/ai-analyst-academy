<script lang="ts">
	import type { ContentSection } from '$lib/content/types';

	interface Props {
		/** Section type */
		type: ContentSection['type'];
		/** Section number (1-based) */
		number: number;
		/** Total sections */
		total: number;
		/** Section title */
		title?: string;
	}

	let { type, number, total, title }: Props = $props();

	function getSectionLabel(sectionType: ContentSection['type']): string {
		switch (sectionType) {
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
</script>

<div class="section-divider" data-type={type}>
	<div class="divider-line"></div>
	<div class="divider-content">
		<span class="section-badge">
			<span class="section-icon">
				{#if type === 'why'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10" />
						<circle cx="12" cy="12" r="4" />
						<line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
						<line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
						<line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
						<line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
					</svg>
				{:else if type === 'what'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
					</svg>
				{:else if type === 'how'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line x1="16" y1="13" x2="8" y2="13" />
						<line x1="16" y1="17" x2="8" y2="17" />
						<polyline points="10 9 9 9 8 9" />
					</svg>
				{/if}
			</span>
			<span class="section-step">Step {number} of {total}</span>
		</span>
		<h2 class="section-heading">
			<span class="section-type">{type.toUpperCase()}</span>
			<span class="section-title">{title || getSectionLabel(type)}</span>
		</h2>
	</div>
</div>

<style>
	.section-divider {
		margin: var(--space-12) 0 var(--space-8) 0;
		scroll-margin-top: calc(var(--space-4) + 80px); /* Account for sticky progress */
	}

	.section-divider:first-of-type {
		margin-top: 0;
	}

	.divider-line {
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-border-secondary) 20%,
			var(--color-border-secondary) 80%,
			transparent
		);
		margin-bottom: var(--space-6);
	}

	.divider-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.section-icon {
		font-size: var(--text-lg);
	}

	.section-step {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section-heading {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin: 0;
	}

	.section-type {
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		letter-spacing: 0.15em;
		color: var(--section-accent, var(--color-primary-500));
	}

	.section-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
	}

	/* Section type colors */
	.section-divider[data-type='why'] {
		--section-accent: var(--color-info-500);
	}

	.section-divider[data-type='what'] {
		--section-accent: var(--color-primary-500);
	}

	.section-divider[data-type='how'] {
		--section-accent: var(--color-success-500);
	}
</style>
