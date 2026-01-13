<script lang="ts">
	import Skeleton from './Skeleton.svelte';
</script>

<div class="lab-skeleton">
	<!-- Header skeleton -->
	<header class="header-skeleton">
		<div class="lab-badge-skeleton">
			<Skeleton variant="text" width="3rem" />
		</div>
		<Skeleton variant="heading" width="60%" height="2.25rem" />
		<Skeleton variant="text" width="80%" />
		<div class="meta-skeleton">
			<Skeleton variant="text" width="5rem" />
			<Skeleton variant="text" width="4rem" />
			<Skeleton variant="text" width="6rem" />
		</div>
	</header>

	<!-- Progress steps skeleton -->
	<div class="progress-skeleton">
		<div class="progress-steps">
			{#each [1, 2, 3, 4] as step}
				<div class="step-skeleton">
					<Skeleton variant="avatar" width="1.5rem" height="1.5rem" />
				</div>
				{#if step < 4}
					<div class="step-line-skeleton">
						<Skeleton variant="text" width="100%" height="2px" />
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Content sections skeleton -->
	<div class="content-skeleton">
		{#each [1, 2] as section}
			<div class="section-skeleton">
				<div class="section-header-skeleton">
					<Skeleton variant="text" width="5rem" />
					<Skeleton variant="heading" width="35%" />
				</div>
				<div class="section-content-skeleton">
					<Skeleton variant="text" lines={5} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.lab-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		padding: var(--space-6);
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	.header-skeleton {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		text-align: center;
		align-items: center;
	}

	.lab-badge-skeleton {
		padding: var(--space-1) var(--space-3);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-full);
	}

	.meta-skeleton {
		display: flex;
		gap: var(--space-4);
		justify-content: center;
	}

	.progress-skeleton {
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.progress-steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
	}

	.step-skeleton {
		flex-shrink: 0;
	}

	.step-line-skeleton {
		width: 3rem;
		padding: 0 var(--space-1);
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
		flex-direction: column;
		gap: var(--space-2);
	}

	.section-content-skeleton {
		padding-top: var(--space-2);
	}
</style>
