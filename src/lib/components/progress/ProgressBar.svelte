<script lang="ts">
	interface Props {
		/** Progress value from 0 to 100 */
		value: number;
		/** Size variant */
		size?: 'sm' | 'md' | 'lg';
		/** Color of the progress bar (CSS variable or color) */
		color?: string;
		/** Show percentage label */
		showLabel?: boolean;
		/** Label position */
		labelPosition?: 'inline' | 'above' | 'none';
		/** Animate on mount */
		animated?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		value,
		size = 'md',
		color = 'var(--color-primary-500)',
		showLabel = false,
		labelPosition = 'inline',
		animated = true,
		class: className = ''
	}: Props = $props();

	const normalizedValue = $derived(Math.min(100, Math.max(0, value)));

	const sizeClasses = {
		sm: 'progress-bar-sm',
		md: 'progress-bar-md',
		lg: 'progress-bar-lg'
	};
</script>

<div class="progress-bar-container {className}">
	{#if showLabel && labelPosition === 'above'}
		<div class="progress-bar-label-above">
			<span class="progress-bar-label-text">{Math.round(normalizedValue)}%</span>
		</div>
	{/if}

	<div
		class="progress-bar {sizeClasses[size]}"
		role="progressbar"
		aria-valuenow={normalizedValue}
		aria-valuemin={0}
		aria-valuemax={100}
	>
		<div
			class="progress-bar-fill"
			class:animated
			style="width: {normalizedValue}%; background-color: {color};"
		>
			{#if showLabel && labelPosition === 'inline' && normalizedValue > 10}
				<span class="progress-bar-label-inline">{Math.round(normalizedValue)}%</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.progress-bar-container {
		width: 100%;
	}

	.progress-bar-label-above {
		display: flex;
		justify-content: flex-end;
		margin-bottom: var(--space-1);
	}

	.progress-bar-label-text {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.progress-bar {
		width: 100%;
		background-color: var(--progress-bg);
		border-radius: var(--progress-radius);
		overflow: hidden;
	}

	.progress-bar-sm {
		height: 4px;
	}

	.progress-bar-md {
		height: var(--progress-height);
	}

	.progress-bar-lg {
		height: 12px;
	}

	.progress-bar-fill {
		height: 100%;
		border-radius: var(--progress-radius);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: var(--space-2);
		min-width: 0;
	}

	.progress-bar-fill.animated {
		transition: width var(--duration-500) var(--ease-out);
	}

	.progress-bar-label-inline {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		font-variant-numeric: tabular-nums;
	}
</style>
