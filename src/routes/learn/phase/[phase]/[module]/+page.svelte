<script lang="ts">
	import {
		SectionProgress,
		SectionDivider,
		ContinueButton,
		ConceptCard,
		ExerciseBlock,
		ChecklistBlock
	} from '$components';
	import type { ContentSection, ConceptDefinition, Exercise, Checklist, NavigationItem } from '$content/types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { untrack } from 'svelte';

	interface SavedProgress {
		sectionsViewed: string[];
		conceptsUnderstood: string[];
		exercisesCompleted: string[];
		checklistItems: Record<string, Record<string, boolean>>;
	}

	interface Props {
		data: {
			phase: {
				id: string;
				title: string;
				order: number;
				color: string;
			};
			module: {
				id: string;
				title: string;
				slug: string;
				phaseId: string;
				estimatedMinutes: number;
				bloomLevel: string;
				content: string;
				htmlContent: string;
				sections: ContentSection[];
				concepts: ConceptDefinition[];
				exercises: Exercise[];
				checklists: Checklist[];
			};
			navigation: {
				prev: NavigationItem | null;
				next: NavigationItem | null;
			};
			phaseNumber: number;
			savedProgress: SavedProgress | null;
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
		if (data.module.sections.length > 0) {
			visibleSectionId = data.module.sections[0].id;
		}
	});

	// Track viewed sections - initialize from saved progress
	let viewedSections = $state<Set<string>>(new Set(initialProgress?.sectionsViewed || []));

	// Progress tracking state - initialize from saved progress
	let conceptsUnderstood = $state<Set<string>>(new Set(initialProgress?.conceptsUnderstood || []));
	let exercisesCompleted = $state<Set<string>>(new Set(initialProgress?.exercisesCompleted || []));
	let checklistItems = $state<Record<string, Record<string, boolean>>>(initialProgress?.checklistItems || {});

	// Debounced auto-save for progress
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSaving = $state(false);

	async function saveProgress() {
		if (!data.isAuthenticated || !browser) return;

		isSaving = true;
		try {
			const formData = new FormData();
			formData.append('moduleId', data.module.id);
			formData.append('phaseId', data.phase.id);
			formData.append('sectionsViewed', JSON.stringify([...viewedSections]));
			formData.append('conceptsUnderstood', JSON.stringify([...conceptsUnderstood]));
			formData.append('exercisesCompleted', JSON.stringify([...exercisesCompleted]));
			formData.append('checklistItems', JSON.stringify(checklistItems));

			await fetch('?/saveProgress', {
				method: 'POST',
				body: formData
			});
		} catch (e) {
			console.error('Failed to save progress:', e);
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
		// Read all progress state to create dependencies
		const _v = viewedSections.size;
		const _c = conceptsUnderstood.size;
		const _e = exercisesCompleted.size;
		const _ch = Object.keys(checklistItems).length;

		// Use untrack to avoid triggering effect when calling debouncedSave
		untrack(() => {
			if (browser && data.isAuthenticated) {
				debouncedSave();
			}
		});
	});

	// Section element refs for scroll tracking (using plain object for Svelte 5 compatibility)
	let sectionRefs: Record<string, HTMLElement | null> = {};

	function handleConceptToggle(conceptId: string, understood: boolean) {
		if (understood) {
			conceptsUnderstood.add(conceptId);
		} else {
			conceptsUnderstood.delete(conceptId);
		}
		conceptsUnderstood = conceptsUnderstood;
	}

	function handleExerciseComplete(exerciseId: string, completed: boolean) {
		if (completed) {
			exercisesCompleted.add(exerciseId);
		} else {
			exercisesCompleted.delete(exerciseId);
		}
		exercisesCompleted = exercisesCompleted;
	}

	function handleChecklistChange(checklistId: string, itemId: string, checked: boolean) {
		if (!checklistItems[checklistId]) {
			checklistItems[checklistId] = {};
		}
		checklistItems[checklistId][itemId] = checked;
		checklistItems = checklistItems;
	}

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
					// Update intersection state for each entry
					entries.forEach((entry) => {
						const sectionId = entry.target.getAttribute('data-section-id');
						if (!sectionId) return;

						if (entry.isIntersecting) {
							// Store the top position of intersecting sections
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

					// Find the section closest to the top of the viewport (but below header)
					if (intersectingSections.size > 0) {
						let closestSection = '';
						let closestDistance = Infinity;

						// Target position is just below header + progress bar (~150px)
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
					rootMargin: '-64px 0px 0px 0px' // Just account for header height
				}
			);

			// Observe all section elements
			Object.values(sectionRefs).forEach((element) => {
				if (element) observer?.observe(element);
			});
		}, 100);

		// Mark first section as viewed on mount
		if (data.module.sections.length > 0) {
			viewedSections.add(data.module.sections[0].id);
			viewedSections = viewedSections;
		}

		return () => {
			clearTimeout(timeoutId);
			observer?.disconnect();
		};
	});

	// Calculate progress
	const progress = $derived(() => {
		const totalSections = data.module.sections.length;
		const totalConcepts = data.module.concepts.length;
		const totalExercises = data.module.exercises.length;
		const totalChecklistItems = data.module.checklists.reduce(
			(acc, cl) => acc + cl.items.length,
			0
		);

		const viewedCount = viewedSections.size;
		const conceptCount = conceptsUnderstood.size;
		const exerciseCount = exercisesCompleted.size;
		const checklistCount = Object.values(checklistItems).reduce(
			(acc, items) => acc + Object.values(items).filter(Boolean).length,
			0
		);

		const total = totalSections + totalConcepts + totalExercises + totalChecklistItems;
		const completed = viewedCount + conceptCount + exerciseCount + checklistCount;

		return total > 0 ? Math.round((completed / total) * 100) : 0;
	});

	// Get section label
	function getSectionLabel(type: ContentSection['type']): string {
		switch (type) {
			case 'why':
				return 'Why It Matters';
			case 'what':
				return 'Core Concepts';
			case 'how':
				return 'How To Apply';
			default:
				return 'Content';
		}
	}

	// Get concepts for a specific section (by section type)
	function getConceptsForSection(sectionType: ContentSection['type']) {
		// Show concepts after WHAT section
		if (sectionType === 'what') {
			return data.module.concepts;
		}
		return [];
	}

	// Get exercises for a specific section
	function getExercisesForSection(sectionType: ContentSection['type']) {
		// Show exercises after HOW section
		if (sectionType === 'how') {
			return data.module.exercises;
		}
		return [];
	}
</script>

<svelte:head>
	<title>{data.module.title} | Phase {data.phaseNumber} | AI Operator Academy</title>
	<meta
		name="description"
		content="Learn {data.module.title} in the {data.phase.title} phase of AI Operator Academy"
	/>
</svelte:head>

<div class="module-page">
	<!-- Module Header -->
	<header class="module-header">
		<div class="breadcrumb">
			<a href="/learn" class="breadcrumb-link">Learn</a>
			<span class="breadcrumb-separator">/</span>
			<a href="/learn/phase/{data.phaseNumber}" class="breadcrumb-link">{data.phase.title}</a>
			<span class="breadcrumb-separator">/</span>
			<span class="breadcrumb-current">{data.module.title}</span>
		</div>

		<h1 class="module-title">{data.module.title}</h1>

		<div class="module-meta">
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
				{data.module.estimatedMinutes} min
			</span>
			<span class="meta-item">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
					<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
				</svg>
				{data.module.bloomLevel}
			</span>
			<span class="meta-item">
				{data.module.sections.length} sections
			</span>
		</div>
	</header>

	<!-- Sticky Progress Indicator -->
	{#if data.module.sections.length > 0}
		<SectionProgress
			sections={data.module.sections}
			currentSection={visibleSectionId}
			viewedSections={[...viewedSections]}
			onSectionClick={scrollToSection}
		/>
	{/if}

	<!-- Linear Content Flow -->
	<main class="content-flow">
		{#each data.module.sections as section, index (section.id)}
			<!-- Section with divider -->
			<section
				id="section-{section.id}"
				class="content-section"
				data-section-id={section.id}
				bind:this={sectionRefs[section.id]}
			>
				<SectionDivider
					type={section.type}
					number={index + 1}
					total={data.module.sections.length}
					title={section.title}
				/>

				<!-- Section content -->
				<article class="section-body">
					{@html section.htmlContent}
				</article>

				<!-- Inline concepts after WHAT section -->
				{#if getConceptsForSection(section.type).length > 0}
					<div class="inline-concepts">
						<h3 class="inline-heading">Key Concepts</h3>
						<div class="concepts-grid">
							{#each getConceptsForSection(section.type) as concept (concept.id)}
								<ConceptCard
									{concept}
									understood={conceptsUnderstood.has(concept.id)}
									onToggleUnderstanding={handleConceptToggle}
								/>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Inline exercises after HOW section -->
				{#if getExercisesForSection(section.type).length > 0}
					<div class="inline-exercises">
						<h3 class="inline-heading">Practice Exercises</h3>
						<div class="exercises-list">
							{#each getExercisesForSection(section.type) as exercise (exercise.id)}
								<ExerciseBlock
									{exercise}
									completed={exercisesCompleted.has(exercise.id)}
									onToggleComplete={handleExerciseComplete}
								/>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Continue button (not on last section) -->
				{#if index < data.module.sections.length - 1}
					<ContinueButton
						nextSectionTitle={getSectionLabel(data.module.sections[index + 1].type)}
						onClick={() => scrollToSection(data.module.sections[index + 1].id)}
					/>
				{/if}
			</section>
		{/each}

		<!-- Module Completion Section -->
		<section class="completion-section">
			<div class="completion-header">
				<div class="completion-icon">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="8" r="7" />
						<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
					</svg>
				</div>
				<h2 class="completion-title">Module Complete!</h2>
				<p class="completion-text">
					You've reached the end of this module. Review the checklist below to ensure you've
					understood the key concepts.
				</p>
			</div>

			<!-- Checklist -->
			{#if data.module.checklists.length > 0}
				<div class="module-checklist">
					{#each data.module.checklists as checklist (checklist.id)}
						<ChecklistBlock
							{checklist}
							completedItems={checklistItems[checklist.id] || {}}
							onToggleItem={handleChecklistChange}
						/>
					{/each}
				</div>
			{/if}

			<!-- Progress summary -->
			<div class="progress-summary">
				<div class="progress-stat">
					<span class="stat-value">{progress()}%</span>
					<span class="stat-label">Complete</span>
				</div>
				<div class="progress-stat">
					<span class="stat-value">{viewedSections.size}/{data.module.sections.length}</span>
					<span class="stat-label">Sections</span>
				</div>
				<div class="progress-stat">
					<span class="stat-value">{conceptsUnderstood.size}/{data.module.concepts.length}</span>
					<span class="stat-label">Concepts</span>
				</div>
				<div class="progress-stat">
					<span class="stat-value">{exercisesCompleted.size}/{data.module.exercises.length}</span>
					<span class="stat-label">Exercises</span>
				</div>
			</div>
		</section>
	</main>

	<!-- Module Navigation -->
	<nav class="module-nav">
		{#if data.navigation.prev}
			<a href={data.navigation.prev.href} class="nav-link prev">
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
				<span class="nav-text">
					<span class="nav-label">Previous</span>
					<span class="nav-title">{data.navigation.prev.title}</span>
				</span>
			</a>
		{:else}
			<span></span>
		{/if}

		{#if data.navigation.next}
			<a href={data.navigation.next.href} class="nav-link next">
				<span class="nav-text">
					<span class="nav-label">Next Module</span>
					<span class="nav-title">{data.navigation.next.title}</span>
				</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</a>
		{:else}
			<a href="/learn/phase/{data.phaseNumber}" class="nav-link next complete">
				<span class="nav-text">
					<span class="nav-label">Phase Complete!</span>
					<span class="nav-title">Back to Phase {data.phaseNumber}</span>
				</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</a>
		{/if}
	</nav>
</div>

<style>
	.module-page {
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	/* Module Header */
	.module-header {
		margin-bottom: var(--space-6);
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

	.module-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.module-meta {
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

	/* Content Flow */
	.content-flow {
		display: flex;
		flex-direction: column;
	}

	/* Content Sections */
	.content-section {
		scroll-margin-top: calc(var(--header-height) + 80px); /* Account for header + sticky progress */
	}

	.section-body {
		padding: var(--space-6);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
	}

	.section-body :global(h1),
	.section-body :global(h2),
	.section-body :global(h3),
	.section-body :global(h4) {
		color: var(--color-text-primary);
		margin-top: var(--space-6);
		margin-bottom: var(--space-3);
	}

	.section-body :global(h1:first-child),
	.section-body :global(h2:first-child),
	.section-body :global(h3:first-child) {
		margin-top: 0;
	}

	.section-body :global(p) {
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-4);
	}

	.section-body :global(ul),
	.section-body :global(ol) {
		color: var(--color-text-secondary);
		padding-left: var(--space-6);
		margin-bottom: var(--space-4);
	}

	.section-body :global(li) {
		margin-bottom: var(--space-2);
		line-height: var(--leading-relaxed);
	}

	.section-body :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background-color: var(--color-bg-secondary);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.section-body :global(pre) {
		background-color: var(--color-bg-secondary);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		overflow-x: auto;
		margin-bottom: var(--space-4);
	}

	.section-body :global(pre code) {
		background: none;
		padding: 0;
	}

	.section-body :global(blockquote) {
		border-left: 3px solid var(--color-primary-500);
		padding-left: var(--space-4);
		margin: var(--space-4) 0;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.section-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: var(--space-4);
	}

	.section-body :global(th),
	.section-body :global(td) {
		padding: var(--space-3);
		text-align: left;
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.section-body :global(th) {
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
	}

	/* Inline content */
	.inline-concepts,
	.inline-exercises {
		margin-bottom: var(--space-6);
	}

	.inline-heading {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.concepts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 768px) {
		.concepts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.exercises-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Completion Section */
	.completion-section {
		margin-top: var(--space-8);
		padding: var(--space-8);
		background-color: var(--color-bg-secondary);
		border: var(--border-width-2) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.completion-header {
		text-align: center;
		margin-bottom: var(--space-6);
	}

	.completion-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-success-500);
		margin-bottom: var(--space-2);
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
		max-width: 500px;
		margin: 0 auto;
	}

	.module-checklist {
		margin-bottom: var(--space-6);
	}

	.progress-summary {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-bg-tertiary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-lg);
	}

	@media (min-width: 640px) {
		.progress-summary {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.progress-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-3);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary-600);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	/* Module Navigation */
	.module-nav {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		padding-top: var(--space-6);
		margin-top: var(--space-8);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: inherit;
		transition: all var(--duration-150) var(--ease-out);
		max-width: 45%;
	}

	.nav-link:hover {
		border-color: var(--color-primary-500);
		box-shadow: var(--shadow-md);
		text-decoration: none;
	}

	.nav-link.prev {
		justify-content: flex-start;
	}

	.nav-link.next {
		justify-content: flex-end;
		margin-left: auto;
	}

	.nav-link.complete {
		background-color: var(--color-success-50);
		border-color: var(--color-success-200);
	}

	.nav-link.complete:hover {
		border-color: var(--color-success-500);
	}

	.nav-text {
		display: flex;
		flex-direction: column;
	}

	.nav-label {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.nav-link.next .nav-text {
		text-align: right;
	}
</style>
