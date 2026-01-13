<script lang="ts">
	import type { ContentSection } from '$content/types';
	import { ContinueButton } from '$components';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { untrack } from 'svelte';

	interface SavedLabProgress {
		status: string | null;
		sectionsViewed: string[];
	}

	interface Props {
		data: {
			lab: {
				id: string;
				title: string;
				slug: string;
				phase: number | 'capstone';
				labNumber?: number;
				estimatedMinutes?: number;
				estimatedHours?: number;
				objectives: string[];
				prerequisites: string[];
				content: string;
				htmlContent: string;
				sections: ContentSection[];
			};
			phase: {
				id: string;
				title: string;
				order: number;
				color: string;
			} | null;
			phaseId: string;
			isCapstone: boolean;
			savedProgress: SavedLabProgress | null;
			isAuthenticated: boolean;
		};
	}

	let { data }: Props = $props();

	// Initialize progress from saved data
	const initialProgress = data.savedProgress;

	// Track visible section based on scroll position
	let visibleSectionId = $state<string>('');

	// Initialize visible section when data changes
	$effect(() => {
		if (data.lab.sections.length > 0) {
			visibleSectionId = data.lab.sections[0].id;
		}
	});

	// Track viewed sections - initialize from saved progress
	let viewedSections = $state<Set<string>>(new Set(initialProgress?.sectionsViewed || []));

	// Track completion state - initialize from saved progress
	let isCompleted = $state(initialProgress?.status === 'completed');

	// Debounced auto-save for progress
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSaving = $state(false);

	async function saveProgress() {
		if (!data.isAuthenticated || !browser) return;

		isSaving = true;
		try {
			const formData = new FormData();
			formData.append('labId', data.lab.id);
			formData.append('phaseId', data.phaseId);
			formData.append('sectionsViewed', JSON.stringify([...viewedSections]));
			formData.append('isCompleted', String(isCompleted));

			await fetch('?/saveProgress', {
				method: 'POST',
				body: formData
			});
		} catch (e) {
			console.error('Failed to save lab progress:', e);
		} finally {
			isSaving = false;
		}
	}

	function debouncedSave() {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			saveProgress();
		}, 1000); // Save after 1 second of inactivity
	}

	// Track progress changes and trigger auto-save
	$effect(() => {
		// Read progress state to create dependencies
		const _v = viewedSections.size;
		const _c = isCompleted;

		// Use untrack to avoid triggering effect when calling debouncedSave
		untrack(() => {
			if (browser && data.isAuthenticated) {
				debouncedSave();
			}
		});
	});

	// Section element refs for scroll tracking
	let sectionRefs: Record<string, HTMLElement | null> = {};

	// Scroll to section
	function scrollToSection(sectionId: string) {
		const element = sectionRefs[sectionId];
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Set up intersection observer for tracking visible section
	onMount(() => {
		if (!browser) return;

		let observer: IntersectionObserver | null = null;

		// Track which sections are currently intersecting
		const intersectingSections = new Map<string, number>();

		// Small delay to ensure refs are populated after render
		const timeoutId = setTimeout(() => {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const sectionId = entry.target.getAttribute('data-section-id');
						if (!sectionId) return;

						if (entry.isIntersecting) {
							intersectingSections.set(sectionId, entry.boundingClientRect.top);

							// Mark as viewed
							if (!viewedSections.has(sectionId)) {
								viewedSections.add(sectionId);
								viewedSections = viewedSections;
							}
						} else {
							intersectingSections.delete(sectionId);
						}
					});

					// Find the section closest to the top of the viewport
					if (intersectingSections.size > 0) {
						let closestSection = '';
						let closestDistance = Infinity;

						const targetPosition = 150;

						intersectingSections.forEach((top, sectionId) => {
							const distance = Math.abs(top - targetPosition);
							if (distance < closestDistance) {
								closestDistance = distance;
								closestSection = sectionId;
							}
						});

						if (closestSection && closestSection !== visibleSectionId) {
							visibleSectionId = closestSection;
						}
					}
				},
				{
					threshold: [0, 0.25, 0.5, 0.75, 1],
					rootMargin: '-64px 0px 0px 0px'
				}
			);

			// Observe all section elements
			Object.values(sectionRefs).forEach((element) => {
				if (element) observer?.observe(element);
			});
		}, 100);

		// Mark first section as viewed on mount
		if (data.lab.sections.length > 0) {
			viewedSections.add(data.lab.sections[0].id);
			viewedSections = viewedSections;
		}

		return () => {
			clearTimeout(timeoutId);
			observer?.disconnect();
		};
	});

	// Calculate progress percentage
	const progressPercent = $derived(() => {
		if (data.lab.sections.length === 0) return 0;
		return Math.round((viewedSections.size / data.lab.sections.length) * 100);
	});

	// Get time estimate display
	function getTimeEstimate(): string {
		if (data.lab.estimatedHours) {
			return `${data.lab.estimatedHours} hour${data.lab.estimatedHours > 1 ? 's' : ''}`;
		}
		if (data.lab.estimatedMinutes) {
			return `${data.lab.estimatedMinutes} min`;
		}
		return 'Varies';
	}

	// Handle mark as complete
	function handleMarkComplete() {
		isCompleted = !isCompleted;
		// Progress will be auto-saved via the effect
	}

	// Get section title for display
	function getSectionTitle(section: ContentSection, index: number): string {
		return section.title || `Part ${index + 1}`;
	}
</script>

<svelte:head>
	<title>{data.lab.title} | {data.isCapstone ? 'Capstone' : `Lab ${data.lab.labNumber}`} | AI Analyst Academy</title>
	<meta name="description" content={data.lab.objectives[0] || `Complete the ${data.lab.title} lab`} />
</svelte:head>

<div class="lab-page">
	<!-- Lab Header -->
	<header class="lab-header" class:capstone={data.isCapstone}>
		<div class="breadcrumb">
			<a href="/learn" class="breadcrumb-link">Learn</a>
			<span class="breadcrumb-separator">/</span>
			{#if data.phase}
				<a href="/learn/phase/{data.phase.order}" class="breadcrumb-link">{data.phase.title}</a>
				<span class="breadcrumb-separator">/</span>
			{/if}
			<span class="breadcrumb-current">{data.lab.title}</span>
		</div>

		<div class="lab-badge">
			{#if data.isCapstone}
				<span class="badge-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
						<path d="M4 22h16" />
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
					</svg>
				</span>
				<span class="badge-text">Capstone Project</span>
			{:else}
				<span class="badge-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
					</svg>
				</span>
				<span class="badge-text">Lab {data.lab.labNumber}</span>
			{/if}
		</div>

		<h1 class="lab-title">{data.lab.title}</h1>

		<div class="lab-meta">
			<span class="meta-item">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>
				{getTimeEstimate()}
			</span>
			{#if data.lab.sections.length > 0}
				<span class="meta-item">
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
					</svg>
					{data.lab.sections.length} section{data.lab.sections.length > 1 ? 's' : ''}
				</span>
			{/if}
			{#if data.lab.prerequisites.length > 0}
				<span class="meta-item">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M9 12l2 2 4-4" />
						<circle cx="12" cy="12" r="10" />
					</svg>
					{data.lab.prerequisites.length} prerequisite{data.lab.prerequisites.length > 1 ? 's' : ''}
				</span>
			{/if}
		</div>
	</header>

	<!-- Sticky Progress Bar (for multi-section labs) -->
	{#if data.lab.sections.length > 1}
		<div class="lab-progress" role="navigation" aria-label="Lab progress">
			<div class="progress-container">
				<div class="progress-track">
					<div class="progress-fill" style="width: {progressPercent()}%"></div>
				</div>
				<ol class="progress-steps">
					{#each data.lab.sections as section, index (section.id)}
						{@const isViewed = viewedSections.has(section.id)}
						{@const isCurrent = visibleSectionId === section.id}
						<li class="progress-step" class:viewed={isViewed} class:current={isCurrent}>
							<button
								class="step-node"
								class:viewed={isViewed}
								class:current={isCurrent}
								onclick={() => scrollToSection(section.id)}
								aria-current={isCurrent ? 'step' : undefined}
								title={getSectionTitle(section, index)}
							>
								{#if isViewed && !isCurrent}
									<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
										<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
									</svg>
								{:else}
									{index + 1}
								{/if}
							</button>
						</li>
					{/each}
				</ol>
			</div>
			<div class="progress-text">
				<span class="progress-percent">{progressPercent()}%</span>
			</div>
		</div>
	{/if}

	<!-- Objectives -->
	{#if data.lab.objectives.length > 0}
		<section class="objectives-section">
			<h2 class="section-title">What You'll Learn</h2>
			<ul class="objectives-list">
				{#each data.lab.objectives as objective}
					<li class="objective-item">
						<svg
							class="check-icon"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9 12l2 2 4-4" />
							<circle cx="12" cy="12" r="10" />
						</svg>
						{objective}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Prerequisites -->
	{#if data.lab.prerequisites.length > 0}
		<section class="prerequisites-section">
			<h2 class="section-title">Prerequisites</h2>
			<ul class="prerequisites-list">
				{#each data.lab.prerequisites as prereq}
					<li class="prereq-item">{prereq}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Linear Content Flow -->
	<main class="lab-content-flow">
		{#if data.lab.sections.length > 0}
			{#each data.lab.sections as section, index (section.id)}
				<section
					id="section-{section.id}"
					class="lab-section"
					data-section-id={section.id}
					bind:this={sectionRefs[section.id]}
				>
					<!-- Section Header -->
					<div class="section-header">
						<div class="section-badge">
							<span class="section-number">Part {index + 1} of {data.lab.sections.length}</span>
						</div>
						<h2 class="section-heading">{getSectionTitle(section, index)}</h2>
					</div>

					<!-- Section Content -->
					<article class="section-article">
						{@html section.htmlContent}
					</article>

					<!-- Continue Button (not on last section) -->
					{#if index < data.lab.sections.length - 1}
						<ContinueButton
							nextSectionTitle={getSectionTitle(data.lab.sections[index + 1], index + 1)}
							onClick={() => scrollToSection(data.lab.sections[index + 1].id)}
						/>
					{/if}
				</section>
			{/each}
		{:else if data.lab.htmlContent}
			<!-- Single content block for labs without sections -->
			<section class="lab-section">
				<article class="section-article">
					{@html data.lab.htmlContent}
				</article>
			</section>
		{/if}

		<!-- Completion Section -->
		<section class="completion-section" class:completed={isCompleted}>
			<div class="completion-icon">
				{#if isCompleted}
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				{:else}
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="8" r="7" />
						<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
					</svg>
				{/if}
			</div>
			<h2 class="completion-title">
				{isCompleted ? 'Lab Completed!' : 'Ready to Complete?'}
			</h2>
			<p class="completion-text">
				{#if isCompleted}
					Great work! You've completed this lab. Feel free to revisit anytime.
				{:else}
					You've viewed {viewedSections.size} of {data.lab.sections.length || 1} section{data.lab.sections.length !== 1 ? 's' : ''}.
					Mark this lab as complete when you're done.
				{/if}
			</p>
			<button
				class="complete-btn"
				class:completed={isCompleted}
				onclick={handleMarkComplete}
			>
				{#if isCompleted}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
						<path d="m9 12 2 2 4-4" />
					</svg>
					Completed
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="20 6 9 17 4 12" />
					</svg>
					Mark as Complete
				{/if}
			</button>
		</section>
	</main>

	<!-- Lab Navigation -->
	<nav class="lab-nav">
		{#if data.phase}
			<a href="/learn/phase/{data.phase.order}" class="nav-link back">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Back to {data.phase.title}
			</a>
		{:else}
			<a href="/learn" class="nav-link back">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Back to Curriculum
			</a>
		{/if}

		{#if isCompleted}
			<span class="completion-badge">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
					<polyline points="20 6 9 17 4 12" />
				</svg>
				Completed
			</span>
		{/if}
	</nav>
</div>

<style>
	.lab-page {
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	/* Lab Header */
	.lab-header {
		margin-bottom: var(--space-6);
		padding: var(--space-6);
		background: var(--lab-header-gradient);
		border: var(--border-width-2) solid var(--lab-header-border);
		border-radius: var(--radius-xl);
	}

	.lab-header.capstone {
		background: var(--lab-capstone-gradient);
		border-color: var(--color-capstone);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.breadcrumb-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--duration-150) var(--ease-out);
	}

	.breadcrumb-link:hover {
		color: var(--color-primary-600);
		text-decoration: none;
	}

	.breadcrumb-separator {
		color: var(--color-text-tertiary);
	}

	.breadcrumb-current {
		color: var(--color-text-primary);
		font-weight: var(--font-medium);
	}

	.lab-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background-color: var(--lab-badge-bg);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-4);
	}

	.lab-header.capstone .lab-badge {
		background-color: var(--color-capstone);
		color: white;
	}

	.badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.badge-text {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.lab-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.lab-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Lab Progress Bar */
	.lab-progress {
		position: sticky;
		top: calc(var(--header-height) + var(--space-4));
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		margin-bottom: var(--space-6);
	}

	.progress-container {
		flex: 1;
		position: relative;
		min-width: 0;
	}

	.progress-track {
		position: absolute;
		top: 12px;
		left: 12px;
		right: 12px;
		height: 3px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		transform: translateY(-50%);
		z-index: 0;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-warning-500);
		border-radius: var(--radius-full);
		transition: width var(--duration-300) var(--ease-out);
	}

	.progress-steps {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.progress-step {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.step-node {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: var(--radius-full);
		border: 2px solid var(--color-border-primary);
		background-color: var(--color-bg-primary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		color: var(--color-text-tertiary);
	}

	.step-node:hover {
		border-color: var(--color-warning-400);
		transform: scale(1.1);
	}

	.step-node:focus-visible {
		outline: 2px solid var(--color-warning-500);
		outline-offset: 2px;
	}

	.step-node.viewed {
		background-color: var(--color-warning-500);
		border-color: var(--color-warning-500);
		color: white;
	}

	.step-node.current {
		border-color: var(--color-warning-500);
		background-color: var(--color-warning-50);
		color: var(--color-warning-600);
		box-shadow: 0 0 0 4px var(--color-warning-100);
	}

	.progress-text {
		flex-shrink: 0;
	}

	.progress-percent {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-warning-600);
	}

	/* Objectives */
	.objectives-section {
		margin-bottom: var(--space-6);
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.objectives-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-3);
	}

	.objective-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		font-size: var(--text-base);
		color: var(--color-text-secondary);
	}

	.check-icon {
		color: var(--color-success-500);
		flex-shrink: 0;
		margin-top: 2px;
	}

	/* Prerequisites */
	.prerequisites-section {
		margin-bottom: var(--space-6);
	}

	.prerequisites-list {
		list-style: disc;
		padding-left: var(--space-6);
		margin: 0;
	}

	.prereq-item {
		color: var(--color-text-secondary);
		margin-bottom: var(--space-2);
	}

	/* Linear Content Flow */
	.lab-content-flow {
		display: flex;
		flex-direction: column;
	}

	.lab-section {
		scroll-margin-top: calc(var(--header-height) + 80px);
		margin-bottom: var(--space-8);
	}

	.section-header {
		margin-bottom: var(--space-4);
	}

	.section-badge {
		margin-bottom: var(--space-2);
	}

	.section-number {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section-heading {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.section-article {
		padding: var(--space-6);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
	}

	.section-article :global(h1),
	.section-article :global(h2),
	.section-article :global(h3),
	.section-article :global(h4) {
		color: var(--color-text-primary);
		margin-top: var(--space-6);
		margin-bottom: var(--space-3);
	}

	.section-article :global(h1:first-child),
	.section-article :global(h2:first-child),
	.section-article :global(h3:first-child) {
		margin-top: 0;
	}

	.section-article :global(p) {
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-4);
	}

	.section-article :global(ul),
	.section-article :global(ol) {
		color: var(--color-text-secondary);
		padding-left: var(--space-6);
		margin-bottom: var(--space-4);
	}

	.section-article :global(li) {
		margin-bottom: var(--space-2);
		line-height: var(--leading-relaxed);
	}

	.section-article :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background-color: var(--color-bg-secondary);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.section-article :global(pre) {
		background-color: var(--color-bg-secondary);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		overflow-x: auto;
		margin-bottom: var(--space-4);
	}

	.section-article :global(pre code) {
		background: none;
		padding: 0;
	}

	.section-article :global(blockquote) {
		border-left: 3px solid var(--color-warning-500);
		padding-left: var(--space-4);
		margin: var(--space-4) 0;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.section-article :global(hr) {
		border: none;
		border-top: var(--border-width) solid var(--color-border-secondary);
		margin: var(--space-6) 0;
	}

	.section-article :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: var(--space-4);
	}

	.section-article :global(th),
	.section-article :global(td) {
		padding: var(--space-3);
		text-align: left;
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.section-article :global(th) {
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
	}

	/* Completion Section */
	.completion-section {
		margin-top: var(--space-8);
		padding: var(--space-8);
		background-color: var(--color-bg-secondary);
		border: var(--border-width-2) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-align: center;
	}

	.completion-section.completed {
		background-color: var(--success-subtle-bg);
		border-color: var(--success-subtle-border);
	}

	.completion-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-warning-500);
		margin-bottom: var(--space-4);
	}

	.completion-section.completed .completion-icon {
		color: var(--color-success-500);
	}

	.completion-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.completion-text {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		max-width: 400px;
		margin: 0 auto var(--space-6) auto;
	}

	.complete-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		border: none;
		border-radius: var(--radius-md);
		background-color: var(--color-success-500);
		color: white;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.complete-btn:hover {
		background-color: var(--color-success-600);
	}

	.complete-btn:focus-visible {
		outline: 2px solid var(--color-success-500);
		outline-offset: 2px;
	}

	.complete-btn.completed {
		background-color: var(--color-bg-primary);
		color: var(--color-success-600);
		border: var(--border-width-2) solid var(--color-success-500);
	}

	.complete-btn.completed:hover {
		background-color: var(--color-success-50);
	}

	/* Lab Navigation */
	.lab-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		background-color: var(--color-bg-primary);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.nav-link:hover {
		border-color: var(--color-primary-300);
		color: var(--color-primary-600);
		text-decoration: none;
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	.completion-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background-color: var(--success-subtle-bg);
		color: var(--color-success-600);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
	}
</style>
