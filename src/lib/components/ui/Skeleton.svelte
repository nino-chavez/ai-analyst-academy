<script lang="ts">
	interface Props {
		/** Skeleton variant */
		variant?: 'text' | 'heading' | 'card' | 'avatar' | 'button';
		/** Width (CSS value) */
		width?: string;
		/** Height (CSS value) */
		height?: string;
		/** Number of lines for text variant */
		lines?: number;
		/** Animation style */
		animate?: boolean;
	}

	let {
		variant = 'text',
		width,
		height,
		lines = 1,
		animate = true
	}: Props = $props();

	// Default dimensions based on variant
	const variantStyles: Record<string, { width: string; height: string }> = {
		text: { width: '100%', height: '1rem' },
		heading: { width: '60%', height: '1.75rem' },
		card: { width: '100%', height: '12rem' },
		avatar: { width: '2.5rem', height: '2.5rem' },
		button: { width: '6rem', height: '2.25rem' }
	};

	const defaults = $derived(variantStyles[variant] || variantStyles.text);
</script>

{#if variant === 'text' && lines > 1}
	<div class="skeleton-lines">
		{#each Array(lines) as _, i}
			<div
				class="skeleton"
				class:animate
				style:width={i === lines - 1 ? '75%' : (width || defaults.width)}
				style:height={height || defaults.height}
			></div>
		{/each}
	</div>
{:else}
	<div
		class="skeleton"
		class:animate
		class:avatar={variant === 'avatar'}
		style:width={width || defaults.width}
		style:height={height || defaults.height}
	></div>
{/if}

<style>
	.skeleton {
		background: linear-gradient(
			90deg,
			var(--color-bg-tertiary) 0%,
			var(--color-bg-secondary) 50%,
			var(--color-bg-tertiary) 100%
		);
		background-size: 200% 100%;
		border-radius: var(--radius-md);
	}

	.skeleton.animate {
		animation: shimmer 1.5s ease-in-out infinite;
	}

	.skeleton.avatar {
		border-radius: var(--radius-full);
	}

	.skeleton-lines {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
