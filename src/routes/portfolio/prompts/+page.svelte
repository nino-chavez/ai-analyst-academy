<script lang="ts">
	import type { PageData } from './$types';
	import type { SavedPrompt } from '$lib/types/database';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	// Filter state
	let activeCategory = $state<string>('all');
	let searchQuery = $state('');

	// Filtered prompts based on category and search
	let filteredPrompts = $derived(() => {
		let results = data.prompts;

		// Filter by category
		if (activeCategory !== 'all') {
			results = results.filter((p) => (p.category || 'other') === activeCategory);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			results = results.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.prompt_text.toLowerCase().includes(query) ||
					(p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
			);
		}

		return results;
	});

	// Modal state
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let showViewModal = $state(false);
	let editingPrompt = $state<SavedPrompt | null>(null);
	let deletingPrompt = $state<SavedPrompt | null>(null);
	let viewingPrompt = $state<SavedPrompt | null>(null);
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);
	let copySuccess = $state(false);

	// Form fields
	let formTitle = $state('');
	let formPromptText = $state('');
	let formCategory = $state('other');
	let formTags = $state('');

	function resetForm() {
		formTitle = '';
		formPromptText = '';
		formCategory = 'other';
		formTags = '';
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

	function openEditModal(prompt: SavedPrompt) {
		editingPrompt = prompt;
		formTitle = prompt.title;
		formPromptText = prompt.prompt_text;
		formCategory = prompt.category || 'other';
		formTags = prompt.tags?.join(', ') || '';
		formError = null;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		editingPrompt = null;
		resetForm();
	}

	function openDeleteModal(prompt: SavedPrompt) {
		deletingPrompt = prompt;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		deletingPrompt = null;
	}

	function openViewModal(prompt: SavedPrompt) {
		viewingPrompt = prompt;
		showViewModal = true;
	}

	function closeViewModal() {
		showViewModal = false;
		viewingPrompt = null;
	}

	function handleModalKeydown(event: KeyboardEvent, closeHandler: () => void) {
		if (event.key === 'Escape') {
			closeHandler();
		}
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getCategoryLabel(category: string | null): string {
		const cat = data.categories.find((c) => c.value === category);
		return cat?.label || 'Other';
	}

	function getCategoryColor(category: string | null): string {
		switch (category) {
			case 'analysis':
				return 'var(--color-phase-1)';
			case 'coding':
				return 'var(--color-phase-2)';
			case 'writing':
				return 'var(--color-phase-3)';
			case 'research':
				return 'var(--color-phase-4)';
			case 'brainstorm':
				return 'var(--color-phase-5)';
			default:
				return 'var(--color-neutral-500)';
		}
	}

	function truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	}
</script>

<svelte:head>
	<title>Prompt Library | AI Analyst Academy</title>
	<meta name="description" content="Your collection of saved prompts for AI interactions" />
</svelte:head>

<div class="prompts-page">
	<header class="page-header">
		<div class="header-content">
			<nav class="breadcrumb" aria-label="Breadcrumb">
				<a href="/portfolio">Portfolio</a>
				<span class="separator">/</span>
				<span>Prompts</span>
			</nav>
			<h1 class="page-title">Prompt Library</h1>
			<p class="page-description">Save and organize your best prompts for quick reuse</p>
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
				New Prompt
			</button>
		</div>
	</header>

	<!-- Stats -->
	<section class="stats-section">
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalPrompts}</span>
				<span class="stat-label">Saved Prompts</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalUses}</span>
				<span class="stat-label">Total Uses</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{Object.keys(data.stats.categoryCounts).length}</span>
				<span class="stat-label">Categories</span>
			</div>
		</div>
	</section>

	<!-- Filters -->
	<section class="filters-section">
		<div class="search-box">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.35-4.35" />
			</svg>
			<input
				type="text"
				placeholder="Search prompts..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>
		<div class="filter-tabs">
			<button
				class="filter-tab"
				class:active={activeCategory === 'all'}
				onclick={() => (activeCategory = 'all')}
			>
				All
			</button>
			{#each data.categories as category}
				<button
					class="filter-tab"
					class:active={activeCategory === category.value}
					onclick={() => (activeCategory = category.value)}
				>
					{category.label}
					{#if data.stats.categoryCounts[category.value]}
						<span class="count">({data.stats.categoryCounts[category.value]})</span>
					{/if}
				</button>
			{/each}
		</div>
	</section>

	<!-- Prompts List -->
	<section class="prompts-section">
		{#if data.prompts.length === 0}
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
							d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
						/>
					</svg>
				</div>
				<h3 class="empty-title">No saved prompts yet</h3>
				<p class="empty-description">
					Save your best prompts to quickly reuse them in the sandbox. Build your personal prompt
					library as you learn.
				</p>
				<button class="btn btn-primary" onclick={openCreateModal}>Create Your First Prompt</button>
			</div>
		{:else if filteredPrompts().length === 0}
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
						<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<h3 class="empty-title">No matching prompts</h3>
				<p class="empty-description">Try adjusting your search or filter criteria.</p>
				<button
					class="btn btn-secondary"
					onclick={() => {
						activeCategory = 'all';
						searchQuery = '';
					}}
				>
					Clear Filters
				</button>
			</div>
		{:else}
			<div class="prompts-grid">
				{#each filteredPrompts() as prompt (prompt.id)}
					<div class="prompt-card">
						<div class="card-header">
							<span
								class="category-badge"
								style="background-color: {getCategoryColor(prompt.category)}"
							>
								{getCategoryLabel(prompt.category)}
							</span>
							{#if prompt.use_count && prompt.use_count > 0}
								<span class="use-count" title="Times used">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
									</svg>
									{prompt.use_count}
								</span>
							{/if}
						</div>

						<h3 class="card-title">{prompt.title}</h3>
						<p class="card-preview">{truncateText(prompt.prompt_text, 120)}</p>

						{#if prompt.tags && prompt.tags.length > 0}
							<div class="tags-list">
								{#each prompt.tags.slice(0, 3) as tag}
									<span class="tag">{tag}</span>
								{/each}
								{#if prompt.tags.length > 3}
									<span class="tag tag-more">+{prompt.tags.length - 3}</span>
								{/if}
							</div>
						{/if}

						<div class="card-footer">
							<span class="card-date">{formatDate(prompt.updated_at || prompt.created_at)}</span>
							<div class="card-actions">
								<button
									class="action-btn"
									title="View prompt"
									onclick={() => openViewModal(prompt)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								</button>
								<button
									class="action-btn"
									title="Copy prompt"
									onclick={() => copyToClipboard(prompt.prompt_text)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
										<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
									</svg>
								</button>
								<button class="action-btn" title="Edit" onclick={() => openEditModal(prompt)}>
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
								<button
									class="action-btn action-btn-danger"
									title="Delete"
									onclick={() => openDeleteModal(prompt)}
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
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
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
		<div
			class="modal modal-lg"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="modal-header">
				<h2 id="create-modal-title" class="modal-title">New Prompt</h2>
				<button class="modal-close" onclick={closeCreateModal} aria-label="Close">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
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
					<label for="create-title" class="form-label"
						>Title <span class="required">*</span></label
					>
					<input
						type="text"
						id="create-title"
						name="title"
						class="form-input"
						bind:value={formTitle}
						placeholder="e.g., Business Analysis Template"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="create-category" class="form-label">Category</label>
					<select
						id="create-category"
						name="category"
						class="form-input"
						bind:value={formCategory}
						disabled={isSubmitting}
					>
						{#each data.categories as category}
							<option value={category.value}>{category.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="create-prompt" class="form-label"
						>Prompt Text <span class="required">*</span></label
					>
					<textarea
						id="create-prompt"
						name="promptText"
						class="form-input form-textarea"
						bind:value={formPromptText}
						placeholder="Enter your prompt here..."
						rows="8"
						required
						disabled={isSubmitting}
					></textarea>
				</div>

				<div class="form-group">
					<label for="create-tags" class="form-label">Tags</label>
					<input
						type="text"
						id="create-tags"
						name="tags"
						class="form-input"
						bind:value={formTags}
						placeholder="e.g., analysis, business, template"
						disabled={isSubmitting}
					/>
					<span class="form-hint">Separate tags with commas</span>
				</div>

				<div class="modal-actions">
					<button
						type="button"
						class="btn btn-secondary"
						onclick={closeCreateModal}
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={isSubmitting || !formTitle || !formPromptText}
					>
						{#if isSubmitting}
							<span class="spinner"></span>
							Saving...
						{:else}
							Save Prompt
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingPrompt}
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
		<div
			class="modal modal-lg"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="modal-header">
				<h2 id="edit-modal-title" class="modal-title">Edit Prompt</h2>
				<button class="modal-close" onclick={closeEditModal} aria-label="Close">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
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
				<input type="hidden" name="id" value={editingPrompt.id} />

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
					<label for="edit-category" class="form-label">Category</label>
					<select
						id="edit-category"
						name="category"
						class="form-input"
						bind:value={formCategory}
						disabled={isSubmitting}
					>
						{#each data.categories as category}
							<option value={category.value}>{category.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="edit-prompt" class="form-label"
						>Prompt Text <span class="required">*</span></label
					>
					<textarea
						id="edit-prompt"
						name="promptText"
						class="form-input form-textarea"
						bind:value={formPromptText}
						rows="8"
						required
						disabled={isSubmitting}
					></textarea>
				</div>

				<div class="form-group">
					<label for="edit-tags" class="form-label">Tags</label>
					<input
						type="text"
						id="edit-tags"
						name="tags"
						class="form-input"
						bind:value={formTags}
						placeholder="e.g., analysis, business, template"
						disabled={isSubmitting}
					/>
					<span class="form-hint">Separate tags with commas</span>
				</div>

				<div class="modal-actions">
					<button
						type="button"
						class="btn btn-secondary"
						onclick={closeEditModal}
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={isSubmitting || !formTitle || !formPromptText}
					>
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

<!-- View Modal -->
{#if showViewModal && viewingPrompt}
	<div
		class="modal-overlay"
		onclick={closeViewModal}
		onkeydown={(e) => handleModalKeydown(e, closeViewModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="view-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="modal modal-lg"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="modal-header">
				<h2 id="view-modal-title" class="modal-title">{viewingPrompt.title}</h2>
				<button class="modal-close" onclick={closeViewModal} aria-label="Close">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="view-content">
				<div class="view-meta">
					<span
						class="category-badge"
						style="background-color: {getCategoryColor(viewingPrompt.category)}"
					>
						{getCategoryLabel(viewingPrompt.category)}
					</span>
					<span class="meta-text">
						Created {formatDate(viewingPrompt.created_at)}
						{#if viewingPrompt.use_count}
							&middot; Used {viewingPrompt.use_count} times
						{/if}
					</span>
				</div>

				<div class="prompt-display">
					<pre>{viewingPrompt.prompt_text}</pre>
				</div>

				{#if viewingPrompt.tags && viewingPrompt.tags.length > 0}
					<div class="tags-list">
						{#each viewingPrompt.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>

			<div class="modal-actions">
				<button class="btn btn-secondary" onclick={closeViewModal}>Close</button>
				<button
					class="btn btn-primary"
					onclick={() => viewingPrompt && copyToClipboard(viewingPrompt.prompt_text)}
				>
					{#if copySuccess}
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M20 6L9 17l-5-5" />
						</svg>
						Copied!
					{:else}
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
							<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
						</svg>
						Copy to Clipboard
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && deletingPrompt}
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
		<div
			class="modal modal-sm"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="modal-header">
				<h2 id="delete-modal-title" class="modal-title">Delete Prompt</h2>
				<button class="modal-close" onclick={closeDeleteModal} aria-label="Close">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<p class="delete-message">
				Are you sure you want to delete "<strong>{deletingPrompt.title}</strong>"? This action
				cannot be undone.
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
				<input type="hidden" name="id" value={deletingPrompt.id} />

				<div class="modal-actions">
					<button
						type="button"
						class="btn btn-secondary"
						onclick={closeDeleteModal}
						disabled={isSubmitting}
					>
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
	.prompts-page {
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

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-2);
	}

	.breadcrumb a {
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-primary-600);
	}

	.separator {
		color: var(--color-text-tertiary);
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

	/* Stats */
	.stats-section {
		margin-bottom: var(--space-6);
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

	/* Filters */
	.filters-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	@media (min-width: 768px) {
		.filters-section {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		color: var(--color-text-tertiary);
	}

	.search-box:focus-within {
		border-color: var(--color-primary-500);
	}

	.search-input {
		flex: 1;
		border: none;
		background: none;
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		outline: none;
	}

	.search-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.filter-tabs {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.filter-tab {
		padding: var(--space-2) var(--space-3);
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

	.filter-tab .count {
		opacity: 0.8;
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

	/* Prompts Grid */
	.prompts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 768px) {
		.prompts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.prompts-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.prompt-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		transition: all var(--duration-150) var(--ease-out);
	}

	.prompt-card:hover {
		border-color: var(--color-primary-400);
		box-shadow: var(--shadow-md);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.category-badge {
		padding: 2px var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-sm);
	}

	.use-count {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.card-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.card-preview {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
		flex: 1;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-top: var(--space-3);
	}

	.tag {
		padding: 2px var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.tag-more {
		color: var(--color-text-tertiary);
		font-style: italic;
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
	}

	.action-btn:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.action-btn-danger:hover {
		background-color: var(--error-subtle-bg);
		color: var(--error-subtle-text);
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

	.btn-primary:hover:not(:disabled) {
		background-color: var(--color-primary-700);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	.header-actions {
		display: flex;
		gap: var(--space-3);
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

	.modal-lg {
		max-width: 640px;
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

	.view-content {
		padding: var(--space-6);
	}

	.view-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.meta-text {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.prompt-display {
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	.prompt-display pre {
		margin: 0;
		font-family: inherit;
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		white-space: pre-wrap;
		word-wrap: break-word;
		line-height: var(--leading-relaxed);
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
		min-height: 120px;
		font-family: monospace;
	}

	.form-hint {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-top: var(--space-1);
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
		padding: var(--space-4) var(--space-6);
		border-top: var(--border-width) solid var(--color-border-primary);
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
</style>
