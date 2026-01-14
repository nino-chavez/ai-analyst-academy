<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		caption?: string;
		width?: string;
		aspectRatio?: string;
	}

	let { src, alt, caption, width = '100%', aspectRatio = '16/9' }: Props = $props();

	let loaded = $state(false);
	let error = $state(false);
	let imgElement: HTMLImageElement | undefined = $state();

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
	}
</script>

<figure class="diagram" style:--diagram-width={width} style:--aspect-ratio={aspectRatio}>
	<div class="diagram-container" class:loaded class:error>
		{#if !loaded && !error}
			<div class="diagram-skeleton">
				<div class="skeleton-shimmer"></div>
			</div>
		{/if}

		{#if error}
			<div class="diagram-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
					<circle cx="9" cy="9" r="2" />
					<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
				</svg>
				<span>Diagram unavailable</span>
			</div>
		{:else}
			<img
				bind:this={imgElement}
				{src}
				{alt}
				onload={handleLoad}
				onerror={handleError}
				class:visible={loaded}
				loading="lazy"
				decoding="async"
			/>
		{/if}
	</div>

	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.diagram {
		width: var(--diagram-width);
		max-width: 100%;
		margin: var(--space-6) auto;
	}

	.diagram-container {
		position: relative;
		aspect-ratio: var(--aspect-ratio);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-border-secondary);
	}

	.diagram-container.loaded {
		aspect-ratio: unset;
	}

	.diagram-skeleton {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-bg-tertiary);
	}

	.skeleton-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color-bg-secondary) 50%,
			transparent 100%
		);
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.diagram-error {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		color: var(--color-text-tertiary);
	}

	.diagram-error svg {
		opacity: 0.5;
	}

	.diagram-error span {
		font-size: var(--text-sm);
	}

	img {
		width: 100%;
		height: auto;
		display: block;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	img.visible {
		opacity: 1;
	}

	/* Dark mode: invert diagram colors for hand-drawn style */
	:global([data-theme='dark']) img {
		filter: invert(1) hue-rotate(180deg);
	}

	figcaption {
		margin-top: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-style: italic;
	}
</style>
