<script lang="ts">
	import type { PageData } from './$types';
	import type { PortfolioItem } from './+page.server';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	// Filter state
	let activeFilter = $state<'all' | 'deliverable' | 'lab'>('all');

	// Filtered items based on active filter
	let filteredItems = $derived(
		activeFilter === 'all'
			? data.portfolioItems
			: data.portfolioItems.filter((item) => item.type === activeFilter)
	);

	// Modal state
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let editingItem = $state<PortfolioItem | null>(null);
	let deletingItem = $state<PortfolioItem | null>(null);
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);

	// Form fields for create/edit
	let formTitle = $state('');
	let formDescription = $state('');
	let formPhaseId = $state('phase-1');
	let formDeliverableUrl = $state('');
	let formMarkComplete = $state(false);

	function resetForm() {
		formTitle = '';
		formDescription = '';
		formPhaseId = 'phase-1';
		formDeliverableUrl = '';
		formMarkComplete = false;
		formError = null;
	}

	function openCreateModal() {
		resetForm();
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
		resetForm();
	}

	function openEditModal(item: PortfolioItem) {
		if (item.type !== 'deliverable') return; // Only deliverables can be edited
		editingItem = item;
		formTitle = item.title;
		formDescription = item.description;
		formPhaseId = item.phase ? `phase-${item.phase}` : 'phase-1';
		formDeliverableUrl = item.deliverableUrl || '';
		formMarkComplete = item.status === 'complete';
		formError = null;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		editingItem = null;
		resetForm();
	}

	function openDeleteModal(item: PortfolioItem) {
		if (item.type !== 'deliverable') return; // Only deliverables can be deleted
		deletingItem = item;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		deletingItem = null;
	}

	function handleModalKeydown(event: KeyboardEvent, closeHandler: () => void) {
		if (event.key === 'Escape') {
			closeHandler();
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getTypeIcon(type: 'deliverable' | 'lab' | 'capstone'): string {
		switch (type) {
			case 'deliverable':
				return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
			case 'lab':
				return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
			case 'capstone':
				return 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z';
			default:
				return '';
		}
	}

	function getTypeLabel(type: 'deliverable' | 'lab' | 'capstone'): string {
		switch (type) {
			case 'deliverable':
				return 'Phase Deliverable';
			case 'lab':
				return 'Lab Work';
			case 'capstone':
				return 'Capstone';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<title>Portfolio | AI Analyst Academy</title>
	<meta
		name="description"
		content="Your collection of work and deliverables from the AI Analyst curriculum"
	/>
</svelte:head>

<div class="portfolio-page">
	<header class="page-header">
		<div class="header-content">
			<h1 class="page-title">Your Portfolio</h1>
			<p class="page-description">
				Your collection of deliverables, lab work, and projects from the curriculum
			</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-primary" onclick={openCreateModal}>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M12 5v14M5 12h14" />
				</svg>
				Add Deliverable
			</button>
			<button class="btn btn-secondary" disabled={data.portfolioItems.length === 0}>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
				</svg>
				Export Portfolio
			</button>
		</div>
	</header>

	<!-- Stats -->
	<section class="stats-section">
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalItems}</span>
				<span class="stat-label">Portfolio Items</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.completed}</span>
				<span class="stat-label">Completed</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.phasesWithDeliverables}/6</span>
				<span class="stat-label">Phase Deliverables</span>
			</div>
		</div>
	</section>

	<!-- Prompt Library Link -->
	<section class="prompt-library-section">
		<a href="/portfolio/prompts" class="prompt-library-card">
			<div class="prompt-library-icon">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
					<path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
				</svg>
			</div>
			<div class="prompt-library-content">
				<h3 class="prompt-library-title">Prompt Library</h3>
				<p class="prompt-library-description">Save and organize your best prompts for quick reuse</p>
			</div>
			<svg
				class="prompt-library-arrow"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M9 18l6-6-6-6" />
			</svg>
		</a>
	</section>

	<!-- Portfolio Items -->
	<section class="items-section">
		<div class="section-header">
			<h2 class="section-title">All Items</h2>
			<div class="filter-tabs">
				<button
					class="filter-tab"
					class:active={activeFilter === 'all'}
					onclick={() => (activeFilter = 'all')}
				>
					All
				</button>
				<button
					class="filter-tab"
					class:active={activeFilter === 'deliverable'}
					onclick={() => (activeFilter = 'deliverable')}
				>
					Deliverables
				</button>
				<button
					class="filter-tab"
					class:active={activeFilter === 'lab'}
					onclick={() => (activeFilter = 'lab')}
				>
					Labs
				</button>
			</div>
		</div>

		{#if data.portfolioItems.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<svg
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<h3 class="empty-title">No portfolio items yet</h3>
				<p class="empty-description">
					Complete modules and labs to start building your portfolio. Your deliverables will appear
					here.
				</p>
				<a href="/learn" class="btn btn-primary">Start Learning</a>
			</div>
		{:else if filteredItems.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<svg
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<h3 class="empty-title">No {activeFilter === 'deliverable' ? 'deliverables' : 'labs'} yet</h3>
				<p class="empty-description">
					{#if activeFilter === 'deliverable'}
						Complete phase deliverables to see them here.
					{:else}
						Submit lab work to see it here.
					{/if}
				</p>
				<button class="btn btn-secondary" onclick={() => (activeFilter = 'all')}>
					View All Items
				</button>
			</div>
		{:else}
			<div class="items-grid">
				{#each filteredItems as item (item.id)}
					<div class="portfolio-card" class:draft={item.status === 'draft'}>
						<div class="card-header">
							<div class="card-type">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d={getTypeIcon(item.type)} />
								</svg>
								<span>{getTypeLabel(item.type)}</span>
								{#if item.phase}
									<span class="phase-badge phase-{item.phase}">Phase {item.phase}</span>
								{/if}
							</div>
							<span class="status-badge" class:complete={item.status === 'complete'}>
								{item.status === 'complete' ? 'Complete' : 'Draft'}
							</span>
						</div>

						<h3 class="card-title">{item.title}</h3>
						<p class="card-description">{item.description}</p>

						<div class="card-footer">
							<span class="card-date">{formatDate(item.createdAt)}</span>
							<div class="card-actions">
								{#if item.deliverableUrl}
									<a
										href={item.deliverableUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="action-btn"
										title="View Deliverable"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</a>
								{/if}
								{#if item.type === 'deliverable'}
									<button class="action-btn" title="Edit" onclick={() => openEditModal(item)}>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button class="action-btn action-btn-danger" title="Delete" onclick={() => openDeleteModal(item)}>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Capstone CTA -->
	<section class="capstone-cta">
		<div class="cta-content">
			<div class="cta-icon">
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"
					/>
				</svg>
			</div>
			<div class="cta-text">
				<h3 class="cta-title">Ready for your Capstone?</h3>
				<p class="cta-description">
					{#if data.stats.phasesWithDeliverables >= 6}
						You've completed all phase deliverables. Start your capstone project now!
					{:else}
						Complete all six phases to unlock the capstone project - your chance to demonstrate
						mastery.
					{/if}
				</p>
			</div>
		</div>
		<a href="/learn/lab/capstone" class="btn btn-primary">
			{data.stats.phasesWithDeliverables >= 6 ? 'Start Capstone' : 'View Capstone'}
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</a>
	</section>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div
		class="modal-overlay"
		onclick={closeCreateModal}
		onkeydown={(e) => handleModalKeydown(e, closeCreateModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="create-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
			<div class="modal-header">
				<h2 id="create-modal-title" class="modal-title">Add Phase Deliverable</h2>
				<button class="modal-close" onclick={closeCreateModal} aria-label="Close">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			{#if formError}
				<div class="form-error" role="alert">{formError}</div>
			{/if}

			<form
				method="POST"
				action="?/create"
				class="modal-form"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							closeCreateModal();
							await update();
						} else if (result.type === 'failure' && result.data?.error) {
							formError = result.data.error as string;
						}
					};
				}}
			>
				<div class="form-group">
					<label for="create-title" class="form-label">Title <span class="required">*</span></label>
					<input
						type="text"
						id="create-title"
						name="title"
						class="form-input"
						bind:value={formTitle}
						placeholder="e.g., Phase 1 Economics Analysis"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="create-phase" class="form-label">Phase <span class="required">*</span></label>
					<select
						id="create-phase"
						name="phaseId"
						class="form-input"
						bind:value={formPhaseId}
						required
						disabled={isSubmitting}
					>
						<option value="phase-1">Phase 1 - AI Literacy</option>
						<option value="phase-2">Phase 2 - Workflow Engineering</option>
						<option value="phase-3">Phase 3 - Agentic Orchestration</option>
						<option value="phase-4">Phase 4 - Strategy & Economics</option>
						<option value="phase-5">Phase 5 - AI Leadership & Influence</option>
						<option value="phase-6">Phase 6 - Enterprise AI Architecture</option>
					</select>
				</div>

				<div class="form-group">
					<label for="create-description" class="form-label">Description</label>
					<textarea
						id="create-description"
						name="description"
						class="form-input form-textarea"
						bind:value={formDescription}
						placeholder="Brief description of your deliverable..."
						rows="3"
						disabled={isSubmitting}
					></textarea>
				</div>

				<div class="form-group">
					<label for="create-url" class="form-label">Deliverable URL</label>
					<input
						type="url"
						id="create-url"
						name="deliverableUrl"
						class="form-input"
						bind:value={formDeliverableUrl}
						placeholder="https://..."
						disabled={isSubmitting}
					/>
					<span class="form-hint">Link to your Google Doc, Notion page, or other deliverable</span>
				</div>

				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={closeCreateModal} disabled={isSubmitting}>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary" disabled={isSubmitting || !formTitle}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Creating...
						{:else}
							Create Deliverable
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingItem}
	<div
		class="modal-overlay"
		onclick={closeEditModal}
		onkeydown={(e) => handleModalKeydown(e, closeEditModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="edit-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
			<div class="modal-header">
				<h2 id="edit-modal-title" class="modal-title">Edit Deliverable</h2>
				<button class="modal-close" onclick={closeEditModal} aria-label="Close">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			{#if formError}
				<div class="form-error" role="alert">{formError}</div>
			{/if}

			<form
				method="POST"
				action="?/update"
				class="modal-form"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							closeEditModal();
							await update();
						} else if (result.type === 'failure' && result.data?.error) {
							formError = result.data.error as string;
						}
					};
				}}
			>
				<input type="hidden" name="id" value={editingItem.id} />

				<div class="form-group">
					<label for="edit-title" class="form-label">Title <span class="required">*</span></label>
					<input
						type="text"
						id="edit-title"
						name="title"
						class="form-input"
						bind:value={formTitle}
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="edit-description" class="form-label">Description</label>
					<textarea
						id="edit-description"
						name="description"
						class="form-input form-textarea"
						bind:value={formDescription}
						rows="3"
						disabled={isSubmitting}
					></textarea>
				</div>

				<div class="form-group">
					<label for="edit-url" class="form-label">Deliverable URL</label>
					<input
						type="url"
						id="edit-url"
						name="deliverableUrl"
						class="form-input"
						bind:value={formDeliverableUrl}
						placeholder="https://..."
						disabled={isSubmitting}
					/>
				</div>

				{#if editingItem.status !== 'complete'}
					<div class="form-group form-checkbox">
						<input
							type="checkbox"
							id="edit-complete"
							name="markComplete"
							value="true"
							bind:checked={formMarkComplete}
							disabled={isSubmitting}
						/>
						<label for="edit-complete" class="checkbox-label">Mark as complete</label>
					</div>
				{/if}

				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={closeEditModal} disabled={isSubmitting}>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary" disabled={isSubmitting || !formTitle}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Saving...
						{:else}
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && deletingItem}
	<div
		class="modal-overlay"
		onclick={closeDeleteModal}
		onkeydown={(e) => handleModalKeydown(e, closeDeleteModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal modal-sm" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
			<div class="modal-header">
				<h2 id="delete-modal-title" class="modal-title">Delete Deliverable</h2>
				<button class="modal-close" onclick={closeDeleteModal} aria-label="Close">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<p class="delete-message">
				Are you sure you want to delete "<strong>{deletingItem.title}</strong>"? This action cannot be undone.
			</p>

			<form
				method="POST"
				action="?/delete"
				class="modal-form"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							closeDeleteModal();
							await update();
						}
					};
				}}
			>
				<input type="hidden" name="id" value={deletingItem.id} />

				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={closeDeleteModal} disabled={isSubmitting}>
						Cancel
					</button>
					<button type="submit" class="btn btn-danger" disabled={isSubmitting}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Deleting...
						{:else}
							Delete
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.portfolio-page {
		max-width: var(--container-lg);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	@media (min-width: 640px) {
		.page-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
		}
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.page-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	/* Stats */
	.stats-section {
		margin-bottom: var(--space-8);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary-600);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Items Section */
	.items-section {
		margin-bottom: var(--space-8);
	}

	.section-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	@media (min-width: 640px) {
		.section-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.filter-tabs {
		display: flex;
		gap: var(--space-2);
	}

	.filter-tab {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		background: none;
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.filter-tab:hover {
		background-color: var(--color-bg-tertiary);
	}

	.filter-tab.active {
		background-color: var(--color-primary-600);
		border-color: var(--color-primary-600);
		color: white;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-12);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.empty-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-4);
	}

	.empty-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.empty-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		max-width: 400px;
		margin: 0 0 var(--space-6) 0;
	}

	/* Items Grid */
	.items-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 768px) {
		.items-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.portfolio-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		transition: all var(--duration-150) var(--ease-out);
	}

	.portfolio-card:hover {
		border-color: var(--color-primary-400);
		box-shadow: var(--shadow-md);
	}

	.portfolio-card.draft {
		opacity: 0.8;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-3);
	}

	.card-type {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.phase-badge {
		padding: 2px var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-sm);
	}

	.phase-badge.phase-1 {
		background-color: var(--color-phase-1);
	}
	.phase-badge.phase-2 {
		background-color: var(--color-phase-2);
	}
	.phase-badge.phase-3 {
		background-color: var(--color-phase-3);
	}
	.phase-badge.phase-4 {
		background-color: var(--color-phase-4);
	}
	.phase-badge.phase-5 {
		background-color: var(--color-phase-5);
	}
	.phase-badge.phase-6 {
		background-color: var(--color-phase-6);
	}

	.status-badge {
		padding: 2px var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-text-tertiary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.status-badge.complete {
		color: var(--success-subtle-text);
		background-color: var(--success-subtle-bg);
	}

	.card-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.card-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
		flex: 1;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.card-date {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.card-actions {
		display: flex;
		gap: var(--space-1);
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-tertiary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
		text-decoration: none;
	}

	.action-btn:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	/* Capstone CTA */
	.capstone-cta {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-6);
		background: linear-gradient(135deg, var(--color-capstone-light) 0%, var(--color-bg-secondary) 100%);
		border: var(--border-width-2) solid var(--color-capstone);
		border-radius: var(--radius-xl);
	}

	@media (min-width: 640px) {
		.capstone-cta {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.cta-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.cta-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		background-color: var(--color-capstone);
		border-radius: var(--radius-full);
		color: white;
		flex-shrink: 0;
	}

	.cta-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.cta-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
		text-decoration: none;
		white-space: nowrap;
	}

	.btn-primary {
		background-color: var(--color-primary-600);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		background-color: var(--color-primary-700);
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-text-secondary);
		border: var(--border-width) solid var(--color-border-primary);
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-danger {
		background-color: var(--color-error-600);
		color: white;
		border: none;
	}

	.btn-danger:hover:not(:disabled) {
		background-color: var(--color-error-700);
	}

	.btn-danger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.header-actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	/* Action button danger variant */
	.action-btn-danger:hover {
		background-color: var(--error-subtle-bg);
		color: var(--error-subtle-text);
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		z-index: 100;
		animation: fadeIn var(--duration-150) var(--ease-out);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
		width: 100%;
		max-width: 480px;
		max-height: 90vh;
		overflow-y: auto;
		animation: slideUp var(--duration-200) var(--ease-out);
	}

	.modal-sm {
		max-width: 400px;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-5) var(--space-6);
		border-bottom: var(--border-width) solid var(--color-border-primary);
	}

	.modal-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-tertiary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.modal-close:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.modal-form {
		padding: var(--space-6);
	}

	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		margin-bottom: var(--space-2);
	}

	.required {
		color: var(--color-error-500);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		color: var(--color-text-primary);
		transition: all var(--duration-150) var(--ease-out);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 3px var(--primary-subtle-border);
	}

	.form-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.form-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-textarea {
		resize: vertical;
		min-height: 80px;
	}

	.form-hint {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-top: var(--space-1);
	}

	.form-checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.form-checkbox input[type="checkbox"] {
		width: 18px;
		height: 18px;
		accent-color: var(--color-primary-600);
	}

	.checkbox-label {
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		margin: 0;
	}

	.form-error {
		padding: var(--space-3) var(--space-4);
		margin: var(--space-4) var(--space-6) 0;
		background-color: var(--error-subtle-bg);
		border: var(--border-width) solid var(--error-subtle-border);
		border-radius: var(--radius-lg);
		color: var(--error-subtle-text);
		font-size: var(--text-sm);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding-top: var(--space-4);
	}

	.delete-message {
		padding: var(--space-4) var(--space-6);
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	.delete-message strong {
		color: var(--color-text-primary);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: var(--radius-full);
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Prompt Library Link */
	.prompt-library-section {
		margin-bottom: var(--space-8);
	}

	.prompt-library-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.prompt-library-card:hover {
		border-color: var(--color-primary-400);
		box-shadow: var(--shadow-md);
	}

	.prompt-library-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background-color: var(--color-primary-100);
		border-radius: var(--radius-lg);
		color: var(--color-primary-600);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .prompt-library-icon {
		background-color: var(--color-primary-900);
	}

	.prompt-library-content {
		flex: 1;
	}

	.prompt-library-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.prompt-library-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.prompt-library-arrow {
		color: var(--color-text-tertiary);
		flex-shrink: 0;
		transition: transform var(--duration-150) var(--ease-out);
	}

	.prompt-library-card:hover .prompt-library-arrow {
		transform: translateX(4px);
		color: var(--color-primary-600);
	}
</style>
