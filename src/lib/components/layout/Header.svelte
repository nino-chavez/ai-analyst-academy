<script lang="ts">
	import { getContext } from 'svelte';
	import ProgressRing from '../progress/ProgressRing.svelte';
	import SearchBox from '../ui/SearchBox.svelte';

	interface Props {
		/** Show sidebar toggle button */
		showSidebarToggle?: boolean;
		/** Current user progress percentage */
		progress?: number;
		/** User display name */
		userName?: string;
		/** Callback when sidebar toggle is clicked */
		onToggleSidebar?: () => void;
	}

	let {
		showSidebarToggle = true,
		progress = 0,
		userName,
		onToggleSidebar
	}: Props = $props();

	// Reference to SearchBox component for focusing
	let searchBoxRef: SearchBox | null = $state(null);
	let mobileSearchBoxRef: SearchBox | null = $state(null);

	// Mobile search modal state
	let mobileSearchOpen = $state(false);

	function openMobileSearch() {
		mobileSearchOpen = true;
		// Focus after modal opens
		setTimeout(() => mobileSearchBoxRef?.focus(), 50);
	}

	function closeMobileSearch() {
		mobileSearchOpen = false;
	}

	// Handle escape key to close mobile search
	function handleMobileSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMobileSearch();
		}
	}

	// Expose focus method for global keyboard shortcuts
	export function focusSearch() {
		// On mobile (< 768px), open the modal instead
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			openMobileSearch();
		} else {
			searchBoxRef?.focus();
		}
	}

	// Get theme context from root layout
	const theme = getContext<{
		current: 'light' | 'dark' | 'system';
		set: (theme: 'light' | 'dark' | 'system') => void;
		cycle: () => void;
	}>('theme');

</script>

<header class="header">
	<div class="header-left">
		{#if showSidebarToggle}
			<button
				class="header-btn sidebar-toggle"
				onclick={onToggleSidebar}
				aria-label="Toggle sidebar"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			</button>
		{/if}

		<a href="/" class="header-logo">
			<svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
				<path d="M6 12v5c3 3 9 3 12 0v-5" />
			</svg>
			<span class="logo-text">AI Analyst Academy</span>
		</a>
	</div>

	<!-- Mobile search button (visible on small screens) -->
	<button
		class="header-btn mobile-search-btn"
		onclick={openMobileSearch}
		aria-label="Search"
	>
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	</button>

	<div class="header-center">
		<nav class="header-nav">
			<a href="/learn" class="nav-link">Learn</a>
			<a href="/sandbox" class="nav-link">Sandbox</a>
			<a href="/progress" class="nav-link">Progress</a>
		</nav>
		<div class="header-search">
			<SearchBox bind:this={searchBoxRef} placeholder="Search..." maxResults={6} />
		</div>
	</div>

	<div class="header-right">
		{#if progress > 0}
			<div class="header-progress" title="Overall progress">
				<ProgressRing value={progress} size={32} strokeWidth={3} showValue={false} />
				<span class="progress-label">{Math.round(progress)}%</span>
			</div>
		{/if}

		{#if theme}
			<button
				class="header-btn theme-toggle"
				onclick={() => theme.cycle()}
				aria-label="Toggle theme"
				title="Current: {theme.current}"
			>
				{#if theme.current === 'light'}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				{:else if theme.current === 'dark'}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
						<line x1="8" y1="21" x2="16" y2="21" />
						<line x1="12" y1="17" x2="12" y2="21" />
					</svg>
				{/if}
			</button>
		{/if}

		<a href="/settings" class="header-btn settings-btn" aria-label="Settings" title="Settings">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		</a>

		{#if userName}
			<div class="user-menu">
				<span class="user-avatar">{userName.charAt(0).toUpperCase()}</span>
				<a href="/auth/signout" class="header-btn signout-btn" aria-label="Sign out" title="Sign out">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</a>
			</div>
		{:else}
			<a href="/auth/login" class="header-btn login-btn">Sign In</a>
		{/if}
	</div>
</header>

<!-- Mobile search modal -->
{#if mobileSearchOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="mobile-search-overlay" role="dialog" aria-modal="true" aria-label="Search" tabindex="-1" onkeydown={handleMobileSearchKeydown}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="mobile-search-backdrop" role="presentation" onclick={closeMobileSearch}></div>
		<div class="mobile-search-modal">
			<div class="mobile-search-header">
				<SearchBox
					bind:this={mobileSearchBoxRef}
					placeholder="Search modules, labs, concepts..."
					maxResults={8}
					onClose={closeMobileSearch}
				/>
				<button class="mobile-search-close" onclick={closeMobileSearch} aria-label="Close search">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<p class="mobile-search-hint">Type to search or press Escape to close</p>
		</div>
	</div>
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--header-height);
		padding: 0 var(--space-4);
		background-color: var(--color-bg-primary);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
		gap: var(--space-4);
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.header-left {
		flex: 0 0 auto;
	}

	.header-center {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.header-right {
		flex: 0 0 auto;
	}

	.header-logo {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		color: var(--color-text-primary);
		font-weight: var(--font-semibold);
	}

	.header-logo:hover {
		text-decoration: none;
	}

	.logo-icon {
		flex-shrink: 0;
		color: var(--color-primary-500);
	}

	.logo-text {
		font-size: var(--text-lg);
		display: none;
	}

	@media (min-width: 768px) {
		.logo-text {
			display: inline;
		}
	}

	.header-nav {
		display: none;
		align-items: center;
		gap: var(--space-1);
	}

	@media (min-width: 768px) {
		.header-nav {
			display: flex;
		}
	}

	.header-search {
		display: none;
	}

	@media (min-width: 768px) {
		.header-search {
			display: block;
			margin-left: var(--space-4);
		}
	}

	.nav-link {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all var(--duration-150) var(--ease-out);
	}

	.nav-link:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		text-decoration: none;
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	.header-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.header-btn:hover {
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
	}

	.header-btn:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	.header-btn:active {
		transform: scale(0.95);
	}

	.sidebar-toggle {
		display: flex;
	}

	@media (min-width: 1024px) {
		.sidebar-toggle {
			display: none;
		}
	}

	.header-progress {
		display: none;
		align-items: center;
		gap: var(--space-2);
	}

	@media (min-width: 640px) {
		.header-progress {
			display: flex;
		}
	}

	.progress-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	/* Hide settings button on very small screens to save space */
	.settings-btn {
		display: none;
	}

	@media (min-width: 480px) {
		.settings-btn {
			display: inline-flex;
		}
	}

	.theme-toggle {
		font-size: var(--text-base);
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.user-avatar {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-primary-500);
		color: white;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
	}

	.signout-btn:hover {
		color: var(--color-error-500, #ef4444);
	}

	.login-btn {
		width: auto;
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
	}

	/* Mobile search button - visible on mobile only */
	.mobile-search-btn {
		display: inline-flex;
	}

	@media (min-width: 768px) {
		.mobile-search-btn {
			display: none;
		}
	}

	/* Mobile search modal */
	.mobile-search-overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal, 50);
		display: flex;
		flex-direction: column;
	}

	.mobile-search-backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.mobile-search-modal {
		position: relative;
		background-color: var(--color-bg-primary);
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-border-primary);
		box-shadow: var(--shadow-lg);
	}

	.mobile-search-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.mobile-search-header :global(.search-box) {
		display: block !important;
		flex: 1;
		max-width: none;
	}

	.mobile-search-close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		color: var(--color-text-secondary);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.mobile-search-close:hover {
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
	}

	.mobile-search-hint {
		margin: var(--space-3) 0 0;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-align: center;
	}
</style>
