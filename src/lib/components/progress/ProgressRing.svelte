<script lang="ts">
	interface Props {
		/** Progress value from 0 to 100 */
		value: number;
		/** Size of the ring in pixels */
		size?: number;
		/** Stroke width of the ring */
		strokeWidth?: number;
		/** Color of the progress arc (CSS variable or color) */
		color?: string;
		/** Background track color */
		trackColor?: string;
		/** Show percentage text in center */
		showValue?: boolean;
		/** Custom label instead of percentage */
		label?: string;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		value,
		size = 64,
		strokeWidth = 6,
		color = 'var(--color-primary-500)',
		trackColor = 'var(--progress-bg)',
		showValue = true,
		label,
		class: className = ''
	}: Props = $props();

	// Calculate SVG properties
	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const normalizedValue = $derived(Math.min(100, Math.max(0, value)));
	const strokeDashoffset = $derived(circumference - (normalizedValue / 100) * circumference);
	const center = $derived(size / 2);

	// Determine text size based on ring size
	const textSize = $derived(
		size <= 48 ? 'var(--text-xs)' : size <= 64 ? 'var(--text-sm)' : 'var(--text-base)'
	);
</script>

<div
	class="progress-ring {className}"
	style="width: {size}px; height: {size}px;"
	role="progressbar"
	aria-valuenow={normalizedValue}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-label={label || `${normalizedValue}% complete`}
>
	<svg width={size} height={size} class="progress-ring-svg">
		<!-- Background track -->
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke={trackColor}
			stroke-width={strokeWidth}
			class="progress-ring-track"
		/>
		<!-- Progress arc -->
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={strokeDashoffset}
			class="progress-ring-progress"
			transform="rotate(-90 {center} {center})"
		/>
	</svg>

	{#if showValue || label}
		<div class="progress-ring-content" style="font-size: {textSize};">
			{#if label}
				<span class="progress-ring-label">{label}</span>
			{:else}
				<span class="progress-ring-value">{Math.round(normalizedValue)}%</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.progress-ring {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.progress-ring-svg {
		transform: rotate(0deg);
	}

	.progress-ring-track {
		opacity: 1;
	}

	.progress-ring-progress {
		transition:
			stroke-dashoffset var(--duration-500) var(--ease-out),
			stroke var(--duration-200) var(--ease-out);
	}

	.progress-ring-content {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
	}

	.progress-ring-label {
		text-align: center;
		line-height: var(--leading-tight);
	}

	.progress-ring-value {
		font-variant-numeric: tabular-nums;
	}
</style>
