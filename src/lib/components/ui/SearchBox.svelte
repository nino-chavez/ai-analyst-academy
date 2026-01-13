<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchContent, type SearchResult } from '$lib/content/loader';
	import { browser } from '$app/environment';

	interface Props {
		/** Placeholder text */
		placeholder?: string;
		/** Maximum results to show */
		maxResults?: number;
		/** Callback when search box is closed */
		onClose?: () => void;
	}

	let {
		placeholder = 'Search modules, labs, concepts...',
		maxResults = 8,
		onClose
	}: Props = $props();

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let inputRef: HTMLInputElement | null = $state(null);

	// Debounce search
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	async function handleSearch() {
		if (!query || query.trim().length < 2) {
			results = [];
			isOpen = false;
			return;
		}

		isLoading = true;
		try {
			results = await searchContent(query, maxResults);
			isOpen = results.length > 0;
			selectedIndex = -1;
		} catch (error) {
			console.error('Search error:', error);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function handleInput() {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(handleSearch, 200);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && results[selectedIndex]) {
					navigateToResult(results[selectedIndex]);
				}
				break;
			case 'Escape':
				event.preventDefault();
				closeSearch();
				break;
		}
	}

	function navigateToResult(result: SearchResult) {
		closeSearch();
		goto(result.href);
	}

	function closeSearch() {
		isOpen = false;
		query = '';
		results = [];
		selectedIndex = -1;
		onClose?.();
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.search-box')) {
			isOpen = false;
		}
	}

	function getTypeIcon(type: SearchResult['type']) {
		switch (type) {
			case 'module':
				return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
			case 'lab':
				return 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.066l.792.316a2.25 2.25 0 001.55.132l.932-.266a2.25 2.25 0 001.169-.736l1.125-1.403a.75.75 0 00.155-.556l-.125-1.129';
			case 'concept':
				return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
			default:
				return 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z';
		}
	}

	function getTypeBadge(type: SearchResult['type']) {
		switch (type) {
			case 'module':
				return 'Module';
			case 'lab':
				return 'Lab';
			case 'concept':
				return 'Concept';
			default:
				return type;
		}
	}

	// Handle click outside
	$effect(() => {
		if (browser && isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	// Expose focus method for external callers (keyboard shortcuts)
	export function focus() {
		inputRef?.focus();
	}
</script>

<div class="search-box" class:is-open={isOpen}>
	<div class="search-input-wrapper">
		<svg
			class="search-icon"
			width="16"
			height="16"
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

		<input
			bind:this={inputRef}
			type="text"
			class="search-input"
			{placeholder}
			bind:value={query}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => {
				if (results.length > 0) isOpen = true;
			}}
			aria-label="Search content"
			role="combobox"
			aria-expanded={isOpen}
			aria-controls="search-results"
			aria-autocomplete="list"
		/>

		{#if isLoading}
			<div class="search-spinner"></div>
		{:else if query}
			<button
				class="search-clear"
				onclick={() => {
					query = '';
					results = [];
					isOpen = false;
					inputRef?.focus();
				}}
				aria-label="Clear search"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		{/if}

		<kbd class="search-shortcut" aria-hidden="true">/</kbd>
	</div>

	{#if isOpen && results.length > 0}
		<div class="search-results" id="search-results" role="listbox">
			{#each results as result, index (result.href)}
				<button
					class="search-result"
					class:selected={index === selectedIndex}
					onclick={() => navigateToResult(result)}
					role="option"
					aria-selected={index === selectedIndex}
				>
					<div class="result-icon">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d={getTypeIcon(result.type)} />
						</svg>
					</div>

					<div class="result-content">
						<div class="result-header">
							<span class="result-title">{result.title}</span>
							<span class="result-badge type-{result.type}">{getTypeBadge(result.type)}</span>
							{#if result.phase}
								<span class="result-phase">Phase {result.phase}</span>
							{/if}
						</div>
						{#if result.matchContext}
							<p class="result-context">{result.matchContext}</p>
						{:else if result.description}
							<p class="result-description">{result.description}</p>
						{/if}
					</div>

					<svg
						class="result-arrow"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-box {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: var(--space-3);
		color: var(--color-text-tertiary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		height: 36px;
		padding: 0 var(--space-10) 0 var(--space-9);
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-lg);
		outline: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.search-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.search-input:hover {
		border-color: var(--color-border-primary);
	}

	.search-input:focus {
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.search-spinner {
		position: absolute;
		right: var(--space-9);
		width: 14px;
		height: 14px;
		border: 2px solid var(--color-border-secondary);
		border-top-color: var(--color-primary-500);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.search-clear {
		position: absolute;
		right: var(--space-9);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		color: var(--color-text-tertiary);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: color var(--duration-150) var(--ease-out);
	}

	.search-clear:hover {
		color: var(--color-text-primary);
	}

	.search-shortcut {
		position: absolute;
		right: var(--space-3);
		padding: 2px 6px;
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		color: var(--color-text-tertiary);
		background-color: var(--color-bg-tertiary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-sm);
	}

	.search-input:focus + .search-clear + .search-shortcut,
	.search-input:focus ~ .search-shortcut {
		display: none;
	}

	.search-results {
		position: absolute;
		top: calc(100% + var(--space-2));
		left: 0;
		right: 0;
		max-height: 400px;
		overflow-y: auto;
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		z-index: var(--z-dropdown);
	}

	.search-result {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		text-align: left;
		background: transparent;
		border: none;
		border-bottom: var(--border-width) solid var(--color-border-secondary);
		cursor: pointer;
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.search-result:last-child {
		border-bottom: none;
	}

	.search-result:hover,
	.search-result.selected {
		background-color: var(--color-bg-secondary);
	}

	.search-result:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: -2px;
	}

	.result-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
	}

	.result-content {
		flex: 1;
		min-width: 0;
	}

	.result-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.result-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.result-badge {
		padding: 1px 6px;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-full);
	}

	.result-badge.type-module {
		color: var(--color-primary-700);
		background-color: var(--color-primary-100);
	}

	.result-badge.type-lab {
		color: var(--color-warning-700);
		background-color: var(--color-warning-100);
	}

	.result-badge.type-concept {
		color: var(--color-success-700);
		background-color: var(--color-success-100);
	}

	.result-phase {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.result-description,
	.result-context {
		margin: var(--space-1) 0 0 0;
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		overflow: hidden;
		text-overflow: ellipsis;
		line-clamp: 2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.result-context {
		font-style: italic;
	}

	.result-arrow {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
		opacity: 0;
		transition: opacity var(--duration-150) var(--ease-out);
	}

	.search-result:hover .result-arrow,
	.search-result.selected .result-arrow {
		opacity: 1;
	}

	/* Hide on mobile - will be shown in a modal instead */
	@media (max-width: 639px) {
		.search-box {
			display: none;
		}
	}
</style>
