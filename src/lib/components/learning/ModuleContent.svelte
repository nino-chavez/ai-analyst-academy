<script lang="ts">
	import type { Module, NavigationItem, BreadcrumbItem } from '$lib/content/types';
	import SectionNav from './SectionNav.svelte';
	import ConceptCard from './ConceptCard.svelte';
	import ExerciseBlock from './ExerciseBlock.svelte';
	import ChecklistBlock from './ChecklistBlock.svelte';
	import ProgressBar from '../progress/ProgressBar.svelte';

	interface Props {
		/** Module data to display */
		module: Module;
		/** Phase number for styling */
		phaseNumber: number;
		/** User progress data */
		progress?: {
			sectionsViewed: string[];
			conceptsUnderstood: string[];
			exercisesCompleted: string[];
			checklistItems: Record<string, boolean>;
		};
		/** Navigation links */
		navigation?: {
			prev: NavigationItem | null;
			next: NavigationItem | null;
		};
		/** Breadcrumb items */
		breadcrumbs?: BreadcrumbItem[];
		/** Callbacks for tracking */
		onSectionView?: (sectionId: string) => void;
		onConceptUnderstand?: (conceptId: string, understood: boolean) => void;
		onExerciseComplete?: (exerciseId: string, completed: boolean) => void;
		onChecklistToggle?: (checklistId: string, itemId: string, completed: boolean) => void;
	}

	let {
		module,
		phaseNumber,
		progress = {
			sectionsViewed: [],
			conceptsUnderstood: [],
			exercisesCompleted: [],
			checklistItems: {}
		},
		navigation,
		breadcrumbs = [],
		onSectionView,
		onConceptUnderstand,
		onExerciseComplete,
		onChecklistToggle
	}: Props = $props();

	// Track active section - derive initial value from module prop
	let activeSection = $state<string>('');

	// Initialize active section when module changes
	$effect(() => {
		if (module.sections[0]?.id) {
			activeSection = module.sections[0].id;
		}
	});

	// Calculate overall module progress
	const totalItems = $derived(
		module.sections.length +
			module.concepts.length +
			module.exercises.length +
			module.checklists.reduce((acc, c) => acc + c.items.length, 0)
	);

	const completedItems = $derived(
		progress.sectionsViewed.length +
			progress.conceptsUnderstood.length +
			progress.exercisesCompleted.length +
			Object.values(progress.checklistItems).filter(Boolean).length
	);

	const progressPercent = $derived(totalItems > 0 ? (completedItems / totalItems) * 100 : 0);

	function handleSectionClick(sectionId: string) {
		activeSection = sectionId;
		onSectionView?.(sectionId);

		// Scroll to section
		const element = document.getElementById(`section-${sectionId}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function getPhaseColor(): string {
		return `var(--color-phase-${phaseNumber})`;
	}

	// Intersection observer for auto-tracking sections
	$effect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const sectionId = entry.target.id.replace('section-', '');
						activeSection = sectionId;
						if (!progress.sectionsViewed.includes(sectionId)) {
							onSectionView?.(sectionId);
						}
					}
				}
			},
			{ threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
		);

		// Observe all sections
		for (const section of module.sections) {
			const element = document.getElementById(`section-${section.id}`);
			if (element) {
				observer.observe(element);
			}
		}

		return () => observer.disconnect();
	});
</script>

<article class="module-content phase-{phaseNumber}">
	<!-- Breadcrumbs -->
	{#if breadcrumbs.length > 0}
		<nav class="breadcrumbs" aria-label="Breadcrumb">
			<ol class="breadcrumb-list">
				{#each breadcrumbs as crumb, i}
					<li class="breadcrumb-item">
						{#if i < breadcrumbs.length - 1}
							<a href={crumb.href}>{crumb.label}</a>
							<span class="breadcrumb-separator">/</span>
						{:else}
							<span class="breadcrumb-current">{crumb.label}</span>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>
	{/if}

	<!-- Module Header -->
	<header class="module-header">
		<div class="module-meta">
			<span class="phase-badge" style="background-color: {getPhaseColor()}">
				Phase {phaseNumber}
			</span>
			<span class="module-time">
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
				{module.estimatedMinutes} min
			</span>
			<span class="bloom-level" title="Bloom's Taxonomy Level">
				{module.bloomLevel}
			</span>
		</div>

		<h1 class="module-title">{module.title}</h1>

		<!-- Progress Bar -->
		<div class="module-progress">
			<ProgressBar value={progressPercent} size="sm" color={getPhaseColor()} showLabel labelPosition="above" />
		</div>
	</header>

	<!-- Section Navigation -->
	{#if module.sections.length > 0}
		<SectionNav
			sections={module.sections}
			{activeSection}
			viewedSections={progress.sectionsViewed}
			onSectionClick={handleSectionClick}
		/>
	{/if}

	<!-- Main Content -->
	<div class="module-body">
		<!-- Sections (WHY-WHAT-HOW) -->
		{#each module.sections as section (section.id)}
			<section id="section-{section.id}" class="content-section section-{section.type}">
				{#if section.title}
					<h2 class="section-heading">
						{#if section.type === 'why'}
							<span class="section-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10" />
									<circle cx="12" cy="12" r="4" />
									<line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
									<line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
									<line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
									<line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
								</svg>
							</span>
						{:else if section.type === 'what'}
							<span class="section-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
									<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
								</svg>
							</span>
						{:else if section.type === 'how'}
							<span class="section-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
								</svg>
							</span>
						{/if}
						{section.title}
					</h2>
				{/if}
				<div class="prose section-content">
					{@html section.htmlContent}
				</div>
			</section>
		{/each}

		<!-- Concepts -->
		{#if module.concepts.length > 0}
			<section class="concepts-section">
				<h2 class="section-heading">
					<span class="section-icon">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M9 18h6" />
							<path d="M10 22h4" />
							<path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
						</svg>
					</span>
					Key Concepts
				</h2>
				{#each module.concepts as concept (concept.id)}
					<ConceptCard
						{concept}
						understood={progress.conceptsUnderstood.includes(concept.id)}
						onToggleUnderstanding={onConceptUnderstand}
					/>
				{/each}
			</section>
		{/if}

		<!-- Exercises -->
		{#if module.exercises.length > 0}
			<section class="exercises-section">
				<h2 class="section-heading">
					<span class="section-icon">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
							<polyline points="10 9 9 9 8 9" />
						</svg>
					</span>
					Exercises
				</h2>
				{#each module.exercises as exercise (exercise.id)}
					<ExerciseBlock
						{exercise}
						completed={progress.exercisesCompleted.includes(exercise.id)}
						onToggleComplete={onExerciseComplete}
					/>
				{/each}
			</section>
		{/if}

		<!-- Checklists -->
		{#if module.checklists.length > 0}
			{#each module.checklists as checklist (checklist.id)}
				<ChecklistBlock
					{checklist}
					completedItems={progress.checklistItems}
					onToggleItem={onChecklistToggle}
				/>
			{/each}
		{/if}
	</div>

	<!-- Navigation Footer -->
	{#if navigation}
		<footer class="module-footer">
			<div class="nav-buttons">
				{#if navigation.prev}
					<a href={navigation.prev.href} class="nav-btn nav-prev">
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
						<span class="nav-btn-text">
							<span class="nav-label">Previous</span>
							<span class="nav-title">{navigation.prev.title}</span>
						</span>
					</a>
				{:else}
					<div></div>
				{/if}

				{#if navigation.next}
					<a href={navigation.next.href} class="nav-btn nav-next">
						<span class="nav-btn-text">
							<span class="nav-label">Next</span>
							<span class="nav-title">{navigation.next.title}</span>
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
				{/if}
			</div>
		</footer>
	{/if}
</article>

<style>
	.module-content {
		max-width: var(--content-max-width-wide);
	}

	/* Breadcrumbs */
	.breadcrumbs {
		margin-bottom: var(--space-4);
	}

	.breadcrumb-list {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: var(--text-sm);
	}

	.breadcrumb-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.breadcrumb-item a {
		color: var(--color-text-secondary);
	}

	.breadcrumb-item a:hover {
		color: var(--color-primary-600);
	}

	.breadcrumb-separator {
		color: var(--color-text-tertiary);
	}

	.breadcrumb-current {
		color: var(--color-text-primary);
		font-weight: var(--font-medium);
	}

	/* Module Header */
	.module-header {
		margin-bottom: var(--space-8);
	}

	.module-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		flex-wrap: wrap;
	}

	.phase-badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.module-time {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.bloom-level {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		text-transform: capitalize;
		padding: var(--space-1) var(--space-2);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-sm);
	}

	.module-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		line-height: var(--leading-tight);
		margin: 0 0 var(--space-4) 0;
	}

	@media (min-width: 768px) {
		.module-title {
			font-size: var(--text-4xl);
		}
	}

	.module-progress {
		max-width: 400px;
	}

	/* Content Sections */
	.module-body {
		margin-bottom: var(--space-12);
	}

	.content-section {
		margin-bottom: var(--space-10);
		scroll-margin-top: calc(var(--header-height) + var(--space-4));
	}

	.section-heading {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.section-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
	}

	.section-content {
		color: var(--color-text-primary);
	}

	/* Concepts, Exercises sections */
	.concepts-section,
	.exercises-section {
		margin-top: var(--space-10);
		padding-top: var(--space-6);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	/* Navigation Footer */
	.module-footer {
		padding-top: var(--space-8);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.nav-buttons {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--color-text-primary);
		transition: all var(--duration-150) var(--ease-out);
		max-width: 50%;
	}

	.nav-btn:hover {
		border-color: var(--color-primary-500);
		text-decoration: none;
	}

	.nav-prev {
		text-align: left;
	}

	.nav-next {
		text-align: right;
		margin-left: auto;
	}

	.nav-btn-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.nav-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
