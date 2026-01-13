<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { page } from '$app/stores';
	import { Sidebar } from '$components';
	import type { NavigationItem } from '$content/types';

	interface Props {
		data: {
			navigation: NavigationItem[];
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();

	// Get sidebar state from root layout context
	const sidebar = getContext<{
		isOpen: boolean;
		toggle: () => void;
		close: () => void;
	}>('sidebar');

	// Get current path for highlighting active nav item
	const currentPath = $derived($page.url.pathname);

	// TODO: Load actual user progress from Supabase
	const phaseProgress: Record<string, number> = {};
	const moduleCompletion: Record<string, boolean> = {};
</script>

<div class="learn-layout">
	<Sidebar
		navigation={data.navigation}
		{currentPath}
		isOpen={sidebar?.isOpen ?? false}
		{phaseProgress}
		{moduleCompletion}
		onClose={sidebar?.close}
	/>

	<main id="main-content" class="learn-content" aria-label="Learning content">
		<div class="content-wrapper">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.learn-layout {
		display: flex;
		min-height: calc(100vh - var(--header-height));
	}

	.learn-content {
		flex: 1;
		min-width: 0;
	}

	@media (min-width: 1024px) {
		.learn-content {
			margin-left: var(--sidebar-width);
		}
	}

	.content-wrapper {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	@media (min-width: 768px) {
		.content-wrapper {
			padding: var(--space-8) var(--space-6);
		}
	}

	@media (min-width: 1024px) {
		.content-wrapper {
			padding: var(--space-8);
		}
	}
</style>
