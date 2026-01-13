<script lang="ts">
	interface Props {
		/** Title of the next section */
		nextSectionTitle: string;
		/** Click handler */
		onClick: () => void;
	}

	let { nextSectionTitle, onClick }: Props = $props();
</script>

<div class="continue-wrapper">
	<button class="continue-btn" onclick={onClick}>
		<span class="continue-text">Continue to</span>
		<span class="continue-title">{nextSectionTitle}</span>
		<svg
			class="continue-arrow"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</svg>
	</button>
</div>

<style>
	.continue-wrapper {
		display: flex;
		justify-content: center;
		padding: var(--space-6) 0;
		margin-top: var(--space-4);
	}

	.continue-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-6);
		background-color: var(--color-primary-500);
		color: white;
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		transition: all var(--duration-150) var(--ease-out);
		box-shadow: var(--shadow-md);
	}

	.continue-btn:hover {
		background-color: var(--color-primary-600);
		transform: translateY(-1px);
		box-shadow: var(--shadow-lg);
	}

	.continue-btn:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	.continue-btn:active {
		transform: translateY(0);
	}

	.continue-text {
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	.continue-title {
		font-weight: var(--font-semibold);
	}

	.continue-arrow {
		flex-shrink: 0;
		transition: transform var(--duration-150) var(--ease-out);
	}

	.continue-btn:hover .continue-arrow {
		transform: translateX(4px);
	}
</style>
