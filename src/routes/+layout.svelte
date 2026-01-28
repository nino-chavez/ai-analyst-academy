<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { Session, User } from '@supabase/supabase-js';
	import { page } from '$app/stores';
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { Header } from '$components';

	interface Props {
		data: {
			session: Session | null;
			user: User | null;
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();

	// Reference to Header component for search focusing
	let headerRef: Header | null = $state(null);

	// Determine layout mode based on current path
	const isAuthPage = $derived($page.url.pathname.startsWith('/auth'));
	const isLearnPage = $derived($page.url.pathname.startsWith('/learn'));

	// Show header on all pages except auth pages
	const showHeader = $derived(!isAuthPage);

	// Learn pages need sidebar toggle, other pages don't
	const showSidebarToggle = $derived(isLearnPage);

	// Get user display name from email
	const userName = $derived(data.user?.email?.split('@')[0] || undefined);

	// Theme state and management
	let theme = $state<'light' | 'dark' | 'system'>('system');

	function setTheme(newTheme: 'light' | 'dark' | 'system') {
		theme = newTheme;
		if (typeof document !== 'undefined') {
			if (newTheme === 'system') {
				document.documentElement.removeAttribute('data-theme');
			} else {
				document.documentElement.setAttribute('data-theme', newTheme);
			}
			localStorage.setItem('theme', newTheme);
		}
	}

	function cycleTheme() {
		const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
		const currentIndex = themes.indexOf(theme);
		const nextTheme = themes[(currentIndex + 1) % themes.length];
		setTheme(nextTheme);
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
			if (saved) {
				setTheme(saved);
			}
		}
	});

	// Sidebar state for learn pages (shared via context)
	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	// Close sidebar on route change
	$effect(() => {
		if ($page.url.pathname) {
			sidebarOpen = false;
		}
	});

	// Export shared state for child components via context
	setContext('theme', {
		get current() {
			return theme;
		},
		set: setTheme,
		cycle: cycleTheme
	});

	setContext('sidebar', {
		get isOpen() {
			return sidebarOpen;
		},
		toggle: toggleSidebar,
		close: closeSidebar
	});

	// Global keyboard shortcuts for search
	function handleGlobalKeydown(event: KeyboardEvent) {
		// Don't trigger if user is typing in an input/textarea
		const target = event.target as HTMLElement;
		const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

		// "/" key to focus search (only if not already typing)
		if (event.key === '/' && !isTyping) {
			event.preventDefault();
			headerRef?.focusSearch();
			return;
		}

		// Cmd/Ctrl+K to focus search (works even when typing)
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			headerRef?.focusSearch();
		}
	}

	// Register global keyboard listener
	$effect(() => {
		if (browser) {
			document.addEventListener('keydown', handleGlobalKeydown);
			return () => document.removeEventListener('keydown', handleGlobalKeydown);
		}
	});
</script>

<svelte:head>
	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="theme-color" content="#6366f1" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>

	<!-- Default meta -->
	<title>AI Analyst Academy</title>
	<meta
		name="description"
		content="Learn to become an AI Analyst - Design human-AI systems and architect business automation"
	/>
</svelte:head>

<!-- Skip link for keyboard users -->
<a href="#main-content" class="skip-link">Skip to main content</a>

{#if showHeader}
	<Header bind:this={headerRef} {showSidebarToggle} {userName} onToggleSidebar={toggleSidebar} />
{/if}

<div class="app-container" class:with-header={showHeader} class:is-learn={isLearnPage}>
	{@render children()}
</div>

<style>
	/* Skip link - visible only on focus for keyboard users */
	.skip-link {
		position: absolute;
		top: -100%;
		left: var(--space-4);
		z-index: var(--z-tooltip);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-primary-500);
		color: white;
		font-weight: var(--font-medium);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: top var(--duration-200) var(--ease-out);
	}

	.skip-link:focus {
		top: var(--space-4);
		outline: 2px solid var(--color-primary-700);
		outline-offset: 2px;
	}

	.app-container {
		min-height: 100vh;
	}

	.app-container.with-header {
		min-height: calc(100vh - var(--header-height));
	}
</style>
