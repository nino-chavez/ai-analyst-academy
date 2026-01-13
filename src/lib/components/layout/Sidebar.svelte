<script lang="ts">
	import { untrack } from 'svelte';
	import type { NavigationItem } from '$lib/content/types';
	import ProgressRing from '../progress/ProgressRing.svelte';

	interface Props {
		/** Navigation items to display */
		navigation: NavigationItem[];
		/** Current active path */
		currentPath?: string;
		/** Whether sidebar is open (mobile) */
		isOpen?: boolean;
		/** Progress by phase ID */
		phaseProgress?: Record<string, number>;
		/** Module completion status by module ID */
		moduleCompletion?: Record<string, boolean>;
		/** Callback to close sidebar */
		onClose?: () => void;
	}

	let {
		navigation,
		currentPath = '',
		isOpen = true,
		phaseProgress = {},
		moduleCompletion = {},
		onClose
	}: Props = $props();

	// Track expanded phases
	let expandedPhases = $state<Set<string>>(new Set());

	function togglePhase(phaseId: string) {
		const newExpanded = new Set(expandedPhases);
		if (newExpanded.has(phaseId)) {
			newExpanded.delete(phaseId);
		} else {
			newExpanded.add(phaseId);
		}
		expandedPhases = newExpanded;
	}

	function isActive(href: string): boolean {
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	function getPhaseClass(phase: number | undefined): string {
		if (!phase) return '';
		return `phase-${phase}`;
	}

	function getPhaseColor(phase: number | undefined): string {
		if (!phase) return 'var(--color-capstone)';
		return `var(--color-phase-${phase})`;
	}

	// Auto-expand active phase when path changes
	// Use untrack to prevent reading expandedPhases from creating a dependency
	$effect(() => {
		// Only track navigation and currentPath, not expandedPhases
		const activePhaseId = navigation.find((item) =>
			item.children?.some((child) => isActive(child.href))
		)?.id;

		if (activePhaseId) {
			untrack(() => {
				if (!expandedPhases.has(activePhaseId)) {
					expandedPhases = new Set([...expandedPhases, activePhaseId]);
				}
			});
		}
	});
</script>

<aside class="sidebar" class:open={isOpen}>
	<!-- Mobile overlay -->
	{#if isOpen}
		<button class="sidebar-overlay" onclick={onClose} aria-label="Close sidebar"></button>
	{/if}

	<div class="sidebar-content">
		<nav class="sidebar-nav" aria-label="Curriculum navigation">
			<ul class="nav-list">
				{#each navigation as item}
					<li class="nav-item {getPhaseClass(item.phase)}">
						{#if item.children && item.children.length > 0}
							<!-- Phase with children -->
							<button
								class="nav-phase-toggle"
								class:expanded={expandedPhases.has(item.id)}
								onclick={() => togglePhase(item.id)}
								aria-expanded={expandedPhases.has(item.id)}
							>
								<span class="phase-indicator" style="background-color: {getPhaseColor(item.phase)}"
								></span>
								<span class="nav-title">{item.title}</span>

								{#if phaseProgress[item.id] !== undefined}
									<ProgressRing
										value={phaseProgress[item.id]}
										size={24}
										strokeWidth={2}
										color={getPhaseColor(item.phase)}
										showValue={false}
									/>
								{/if}

								<svg
									class="chevron"
									class:rotated={expandedPhases.has(item.id)}
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</button>

							{#if expandedPhases.has(item.id)}
								<ul class="nav-children">
									{#each item.children as child}
										<li class="nav-child-item">
											<a
												href={child.href}
												class="nav-link"
												class:active={isActive(child.href)}
												onclick={onClose}
											>
												<span class="item-type-icon">
													{#if child.type === 'module'}
														<svg
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
														>
															<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
															<polyline points="14 2 14 8 20 8" />
															<line x1="16" y1="13" x2="8" y2="13" />
															<line x1="16" y1="17" x2="8" y2="17" />
															<polyline points="10 9 9 9 8 9" />
														</svg>
													{:else}
														<svg
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
														>
															<path
																d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
															/>
														</svg>
													{/if}
												</span>
												<span class="nav-link-text">{child.title}</span>

												{#if moduleCompletion[child.id]}
													<span class="completion-check" title="Completed">
														<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
															<polyline points="20 6 9 17 4 12" />
														</svg>
													</span>
												{/if}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						{:else}
							<!-- Capstone (no children) -->
							<a
								href={item.href}
								class="nav-link capstone-link"
								class:active={isActive(item.href)}
								onclick={onClose}
							>
								<span
									class="phase-indicator capstone"
									style="background-color: var(--color-capstone)"
								></span>
								<span class="nav-title">{item.title}</span>

								{#if moduleCompletion[item.id]}
									<span class="completion-check" title="Completed">
														<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
															<polyline points="20 6 9 17 4 12" />
														</svg>
													</span>
								{/if}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		<div class="sidebar-footer">
			<a href="/syllabus" class="footer-link">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
				Syllabus
			</a>
			<a href="/portfolio" class="footer-link">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
					/>
				</svg>
				Portfolio
			</a>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: var(--header-height);
		left: 0;
		bottom: 0;
		width: var(--sidebar-width);
		z-index: var(--z-fixed);
		transform: translateX(-100%);
		transition: transform var(--duration-300) var(--ease-out);
	}

	.sidebar.open {
		transform: translateX(0);
	}

	@media (min-width: 1024px) {
		.sidebar {
			transform: translateX(0);
		}
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: -1;
		border: none;
		cursor: pointer;
	}

	@media (min-width: 1024px) {
		.sidebar-overlay {
			display: none;
		}
	}

	.sidebar-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
		border-right: var(--border-width) solid var(--color-border-secondary);
		overflow: hidden;
	}

	.sidebar-nav {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4) 0;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		margin-bottom: var(--space-1);
	}

	.nav-phase-toggle {
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: none;
		background: transparent;
		cursor: pointer;
		gap: var(--space-3);
		text-align: left;
		color: var(--color-text-primary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.nav-phase-toggle:hover {
		background-color: var(--color-bg-secondary);
	}

	.nav-phase-toggle:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: -2px;
	}

	.nav-phase-toggle:active {
		background-color: var(--color-bg-tertiary);
	}

	.phase-indicator {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.nav-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chevron {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
		transition: transform var(--duration-200) var(--ease-out);
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.nav-children {
		list-style: none;
		margin: 0;
		padding: 0;
		padding-left: var(--space-4);
	}

	.nav-child-item {
		margin: var(--space-1) 0;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		padding-left: calc(var(--space-4) + 8px + var(--space-3));
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
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

	.nav-link.active {
		color: var(--active-subtle-text);
		background-color: var(--active-subtle-bg);
		font-weight: var(--font-medium);
	}

	.capstone-link {
		padding-left: var(--space-4);
	}

	.item-type-icon {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
	}

	.nav-link-text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.completion-check {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-success-500);
	}

	.sidebar-footer {
		padding: var(--space-4);
		border-top: var(--border-width) solid var(--color-border-secondary);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.footer-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
		border-radius: var(--radius-md);
		transition: all var(--duration-150) var(--ease-out);
	}

	.footer-link:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		text-decoration: none;
	}

	.footer-link:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	.sidebar-overlay:focus-visible {
		outline: none;
	}
</style>
