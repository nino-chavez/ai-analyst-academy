<script lang="ts">
	import type { ConceptDefinition } from '$lib/content/types';

	interface Props {
		/** Concept definition to display */
		concept: ConceptDefinition;
		/** Whether the concept is marked as understood */
		understood?: boolean;
		/** Callback when understanding is toggled */
		onToggleUnderstanding?: (conceptId: string, understood: boolean) => void;
		/** Compact mode for inline display */
		compact?: boolean;
	}

	let {
		concept,
		understood = false,
		onToggleUnderstanding,
		compact = false
	}: Props = $props();

	function handleToggle() {
		onToggleUnderstanding?.(concept.id, !understood);
	}
</script>

<div class="concept-card" class:compact class:understood>
	<div class="concept-header">
		<span class="concept-icon">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 18h6" />
				<path d="M10 22h4" />
				<path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
			</svg>
		</span>
		<span class="concept-label">Key Concept</span>
		{#if onToggleUnderstanding}
			<button
				class="understand-btn"
				class:checked={understood}
				onclick={handleToggle}
				aria-label={understood ? 'Mark as not understood' : 'Mark as understood'}
				title={understood ? 'Understood!' : 'Click when you understand this concept'}
			>
				{#if understood}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
						/>
					</svg>
				{:else}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
					</svg>
				{/if}
			</button>
		{/if}
	</div>

	<div class="concept-content">
		<h4 class="concept-term">{concept.term}</h4>
		<div class="concept-definition">
			{@html concept.htmlDefinition || concept.definition}
		</div>
	</div>
</div>

<style>
	.concept-card {
		background-color: var(--concept-card-bg);
		border: var(--border-width) solid var(--concept-card-border);
		border-left: var(--border-width-4) solid var(--color-info-500);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin: var(--space-4) 0;
	}

	.concept-card.compact {
		padding: var(--space-3);
		margin: var(--space-2) 0;
	}

	.concept-card.understood {
		border-left-color: var(--color-success-500);
	}

	.concept-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.concept-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-info-500);
	}

	.concept-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--concept-label-text);
		flex: 1;
	}

	.understand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-text-tertiary);
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.understand-btn:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
	}

	.understand-btn.checked {
		color: var(--color-success-500);
	}

	.understand-btn.checked:hover {
		color: var(--color-success-600);
	}

	.concept-content {
		padding-left: calc(var(--text-base) + var(--space-2));
	}

	.compact .concept-content {
		padding-left: 0;
	}

	.concept-term {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.concept-definition {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.concept-definition :global(p) {
		margin: 0;
	}

	.concept-definition :global(code) {
		font-size: 0.9em;
	}
</style>
