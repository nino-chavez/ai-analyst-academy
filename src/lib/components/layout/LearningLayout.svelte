<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NavigationItem } from '$lib/content/types';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';

	interface Props {
		/** Navigation items for sidebar */
		navigation: NavigationItem[];
		/** Current page path */
		currentPath?: string;
		/** User's overall progress percentage */
		overallProgress?: number;
		/** Progress by phase ID */
		phaseProgress?: Record<string, number>;
		/** Module completion status by module ID */
		moduleCompletion?: Record<string, boolean>;
		/** User display name */
		userName?: string;
		/** Main content slot */
		children: Snippet;
	}

	let {
		navigation,
		currentPath = '',
		overallProgress = 0,
		phaseProgress = {},
		moduleCompletion = {},
		userName,
		children
	}: Props = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	// Close sidebar on route change (mobile)
	$effect(() => {
		if (currentPath) {
			sidebarOpen = false;
		}
	});
</script>

<div class="learning-layout">
	<Header
		showSidebarToggle={true}
		progress={overallProgress}
		{userName}
		onToggleSidebar={toggleSidebar}
	/>

	<div class="layout-body">
		<Sidebar
			{navigation}
			{currentPath}
			isOpen={sidebarOpen}
			{phaseProgress}
			{moduleCompletion}
			onClose={closeSidebar}
		/>

		<main class="main-content">
			<div class="content-wrapper">
				{@render children()}
			</div>
		</main>
	</div>
</div>

<style>
	.learning-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.layout-body {
		flex: 1;
		display: flex;
		position: relative;
	}

	.main-content {
		flex: 1;
		min-width: 0;
		padding-top: 0;
	}

	@media (min-width: 1024px) {
		.main-content {
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
