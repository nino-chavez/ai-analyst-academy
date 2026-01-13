<script lang="ts">
	import type { ContentSection } from '$lib/content/types';

	interface Props {
		/** All sections in the module */
		sections: ContentSection[];
		/** Currently visible section ID (based on scroll position) */
		currentSection: string;
		/** Sections that have been viewed */
		viewedSections?: string[];
		/** Callback when stepper node is clicked */
		onSectionClick?: (sectionId: string) => void;
	}

	let {
		sections,
		currentSection,
		viewedSections = [],
		onSectionClick
	}: Props = $props();

	function getSectionLabel(type: ContentSection['type']): string {
		switch (type) {
			case 'why':
				return 'WHY';
			case 'what':
				return 'WHAT';
			case 'how':
				return 'HOW';
			default:
				return 'MORE';
		}
	}

	function isViewed(sectionId: string): boolean {
		return viewedSections.includes(sectionId);
	}

	function isCurrent(sectionId: string): boolean {
		return currentSection === sectionId;
	}

	function getStepState(sectionId: string): 'viewed' | 'current' | 'upcoming' {
		if (isCurrent(sectionId)) return 'current';
		if (isViewed(sectionId)) return 'viewed';
		return 'upcoming';
	}

	// Calculate progress percentage
	const progressPercent = $derived(() => {
		if (sections.length === 0) return 0;
		const viewedCount = viewedSections.length;
		return Math.round((viewedCount / sections.length) * 100);
	});
</script>

<div class="section-progress" role="navigation" aria-label="Module progress">
	<div class="progress-container">
		<!-- Progress bar background -->
		<div class="progress-track">
			<div
				class="progress-fill"
				style="width: {progressPercent()}%"
			></div>
		</div>

		<!-- Stepper nodes -->
		<ol class="stepper">
			{#each sections as section, index (section.id)}
				{@const state = getStepState(section.id)}
				<li class="step" data-state={state}>
					<button
						class="step-node"
						class:viewed={state === 'viewed'}
						class:current={state === 'current'}
						class:upcoming={state === 'upcoming'}
						onclick={() => onSectionClick?.(section.id)}
						aria-current={state === 'current' ? 'step' : undefined}
						title={section.title || getSectionLabel(section.type)}
					>
						{#if state === 'viewed'}
							<svg class="step-check" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						{:else}
							<span class="step-number">{index + 1}</span>
						{/if}
					</button>
					<span class="step-label">{getSectionLabel(section.type)}</span>
				</li>
			{/each}
		</ol>
	</div>

	<div class="progress-text">
		<span class="progress-percent">{progressPercent()}%</span>
		<span class="progress-label">complete</span>
	</div>
</div>

<style>
	.section-progress {
		position: sticky;
		top: calc(var(--header-height) + var(--space-4));
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		margin-bottom: var(--space-6);
	}

	.progress-container {
		flex: 1;
		position: relative;
		min-width: 0;
	}

	/* Progress track (the line) - positioned through center of step nodes */
	.progress-track {
		position: absolute;
		top: 14px; /* Half of step-node height (28px / 2) */
		left: 14px; /* Start from center of first node */
		right: 14px; /* End at center of last node */
		height: 3px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		transform: translateY(-50%);
		z-index: 0;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-primary-500);
		border-radius: var(--radius-full);
		transition: width var(--duration-300) var(--ease-out);
	}

	/* Stepper */
	.stepper {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.step-node {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-full);
		border: 2px solid var(--color-border-primary);
		background-color: var(--color-bg-primary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		color: var(--color-text-tertiary);
	}

	.step-node:hover {
		border-color: var(--color-primary-400);
		transform: scale(1.1);
	}

	.step-node:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	/* Step states */
	.step-node.viewed {
		background-color: var(--color-primary-500);
		border-color: var(--color-primary-500);
		color: white;
	}

	.step-node.current {
		border-color: var(--color-primary-500);
		background-color: var(--color-primary-50);
		color: var(--color-primary-600);
		box-shadow: 0 0 0 4px var(--color-primary-100);
	}

	.step-node.upcoming {
		background-color: var(--color-bg-secondary);
		border-color: var(--color-border-primary);
	}

	.step-check {
		flex-shrink: 0;
	}

	.step-number {
		font-size: var(--text-xs);
	}

	.step-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.step[data-state='current'] .step-label {
		color: var(--color-primary-600);
	}

	.step[data-state='viewed'] .step-label {
		color: var(--color-text-secondary);
	}

	/* Progress text */
	.progress-text {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		flex-shrink: 0;
	}

	.progress-percent {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-primary-600);
		line-height: 1;
	}

	.progress-label {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	/* Responsive */
	@media (max-width: 480px) {
		.step-label {
			display: none;
		}

		.step-node {
			width: 24px;
			height: 24px;
		}

		.progress-track {
			top: 12px; /* Half of smaller step-node height (24px / 2) */
			left: 12px;
			right: 12px;
		}
	}
</style>
