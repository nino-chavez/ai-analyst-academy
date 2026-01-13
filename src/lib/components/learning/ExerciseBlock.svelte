<script lang="ts">
	import type { Exercise } from '$lib/content/types';

	interface Props {
		/** Exercise to display */
		exercise: Exercise;
		/** Whether the exercise is completed */
		completed?: boolean;
		/** Callback when completion is toggled */
		onToggleComplete?: (exerciseId: string, completed: boolean) => void;
		/** Whether to show expanded content by default */
		expanded?: boolean;
	}

	let {
		exercise,
		completed = false,
		onToggleComplete,
		expanded = true
	}: Props = $props();

	// Use a local state that syncs with prop changes
	let isExpanded = $state(true);

	// Sync with prop when it changes
	$effect(() => {
		isExpanded = expanded;
	});

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function handleComplete() {
		onToggleComplete?.(exercise.id, !completed);
	}


	function getTypeLabel(type: string | undefined): string {
		if (!type) return 'Exercise';
		return type.charAt(0).toUpperCase() + type.slice(1) + ' Exercise';
	}
</script>

<div class="exercise-block" class:completed>
	<button class="exercise-header" onclick={toggleExpanded} aria-expanded={isExpanded}>
		<span class="exercise-icon">
			{#if exercise.type === 'calculation'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="4" y="2" width="16" height="20" rx="2" />
					<line x1="8" y1="6" x2="16" y2="6" />
					<line x1="8" y1="10" x2="16" y2="10" />
					<line x1="8" y1="14" x2="12" y2="14" />
					<line x1="8" y1="18" x2="12" y2="18" />
				</svg>
			{:else if exercise.type === 'analysis'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			{:else if exercise.type === 'design'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
				</svg>
			{:else if exercise.type === 'practice'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 8h1a4 4 0 0 1 0 8h-1" />
					<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
					<line x1="6" y1="1" x2="6" y2="4" />
					<line x1="10" y1="1" x2="10" y2="4" />
					<line x1="14" y1="1" x2="14" y2="4" />
				</svg>
			{:else if exercise.type === 'reflection'}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
		<div class="exercise-title-group">
			<span class="exercise-type">{getTypeLabel(exercise.type)}</span>
			<h4 class="exercise-title">{exercise.title}</h4>
		</div>
		<svg
			class="chevron"
			class:rotated={isExpanded}
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>

	{#if isExpanded}
		<div class="exercise-content">
			{#if exercise.scenario}
				<div class="exercise-scenario">
					<span class="scenario-label">Scenario</span>
					<p>{exercise.scenario}</p>
				</div>
			{/if}

			<div class="exercise-instructions">
				{@html exercise.htmlInstructions || exercise.instructions}
			</div>

			{#if onToggleComplete}
				<div class="exercise-footer">
					<button class="complete-btn" class:checked={completed} onclick={handleComplete}>
						{#if completed}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
								/>
							</svg>
							<span>Completed</span>
						{:else}
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<circle cx="12" cy="12" r="10" />
							</svg>
							<span>Mark Complete</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.exercise-block {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		margin: var(--space-6) 0;
		overflow: hidden;
	}

	.exercise-block.completed {
		border-color: var(--color-success-300);
	}

	.exercise-header {
		display: flex;
		align-items: flex-start;
		width: 100%;
		padding: var(--space-4);
		border: none;
		background: transparent;
		cursor: pointer;
		gap: var(--space-3);
		text-align: left;
		color: var(--color-text-primary);
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.exercise-header:hover {
		background-color: var(--color-bg-tertiary);
	}

	.exercise-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-text-tertiary);
		margin-top: 2px;
	}

	.exercise-title-group {
		flex: 1;
		min-width: 0;
	}

	.exercise-type {
		display: block;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-1);
	}

	.exercise-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0;
		line-height: var(--leading-snug);
	}

	.chevron {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
		transition: transform var(--duration-200) var(--ease-out);
		margin-top: 2px;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.exercise-content {
		padding: 0 var(--space-4) var(--space-4);
		padding-left: calc(var(--text-xl) + var(--space-3) + var(--space-4));
	}

	.exercise-scenario {
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
		padding: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.scenario-label {
		display: block;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-2);
	}

	.exercise-scenario p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.exercise-instructions {
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		line-height: var(--leading-relaxed);
	}

	.exercise-instructions :global(p) {
		margin: var(--space-3) 0;
	}

	.exercise-instructions :global(p:first-child) {
		margin-top: 0;
	}

	.exercise-instructions :global(ul),
	.exercise-instructions :global(ol) {
		padding-left: var(--space-5);
		margin: var(--space-3) 0;
	}

	.exercise-instructions :global(li) {
		margin: var(--space-2) 0;
	}

	.exercise-footer {
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.complete-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: var(--border-width) solid var(--color-border-primary);
		background: var(--color-bg-primary);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.complete-btn:hover {
		border-color: var(--color-success-500);
		color: var(--color-success-600);
	}

	.complete-btn.checked {
		background-color: var(--success-subtle-bg);
		border-color: var(--color-success-500);
		color: var(--success-subtle-text);
	}
</style>
