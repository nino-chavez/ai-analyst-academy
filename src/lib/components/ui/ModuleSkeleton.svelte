<script lang="ts">
	import Skeleton from './Skeleton.svelte';
</script>

<div class="module-skeleton">
	<!-- Header skeleton -->
	<header class="header-skeleton">
		<div class="breadcrumb-skeleton">
			<Skeleton variant="text" width="4rem" />
			<span class="separator">/</span>
			<Skeleton variant="text" width="5rem" />
			<span class="separator">/</span>
			<Skeleton variant="text" width="8rem" />
		</div>
		<Skeleton variant="heading" width="70%" height="2.5rem" />
		<Skeleton variant="text" width="50%" />
		<div class="meta-skeleton">
			<Skeleton variant="text" width="6rem" />
			<Skeleton variant="text" width="6rem" />
		</div>
	</header>

	<!-- Progress bar skeleton -->
	<div class="progress-skeleton">
		<Skeleton variant="text" width="100%" height="0.5rem" />
	</div>

	<!-- Content sections skeleton -->
	<div class="content-skeleton">
		{#each [1, 2, 3] as section}
			<div class="section-skeleton">
				<div class="section-header-skeleton">
					<Skeleton variant="text" width="3rem" />
					<Skeleton variant="heading" width="40%" />
				</div>
				<div class="section-content-skeleton">
					<Skeleton variant="text" lines={4} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.module-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		padding: var(--space-6);
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	.header-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.breadcrumb-skeleton {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.separator {
		color: var(--color-text-tertiary);
	}

	.meta-skeleton {
		display: flex;
		gap: var(--space-4);
	}

	.progress-skeleton {
		padding: var(--space-4) 0;
	}

	.content-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.section-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-6);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		border: var(--border-width) solid var(--color-border-secondary);
	}

	.section-header-skeleton {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.section-content-skeleton {
		padding-top: var(--space-2);
	}
</style>
