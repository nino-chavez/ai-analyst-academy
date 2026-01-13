<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	interface Props {
		/** Number of cards to display */
		count?: number;
		/** Layout style */
		layout?: 'grid' | 'list';
	}

	let { count = 4, layout = 'grid' }: Props = $props();
</script>

<div class="cards-skeleton" class:grid={layout === 'grid'} class:list={layout === 'list'}>
	{#each Array(count) as _, i}
		<div class="card-skeleton">
			<div class="card-header">
				<Skeleton variant="avatar" width="2.5rem" height="2.5rem" />
				<div class="card-title-area">
					<Skeleton variant="text" width="4rem" />
					<Skeleton variant="heading" width="70%" height="1.25rem" />
				</div>
			</div>
			<div class="card-body">
				<Skeleton variant="text" lines={2} />
			</div>
			<div class="card-footer">
				<Skeleton variant="text" width="5rem" />
				<Skeleton variant="button" width="4rem" height="1.5rem" />
			</div>
		</div>
	{/each}
</div>

<style>
	.cards-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.cards-skeleton.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.cards-skeleton.list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.card-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		border: var(--border-width) solid var(--color-border-secondary);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.card-title-area {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		flex: 1;
	}

	.card-body {
		flex: 1;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
