<script lang="ts">
	import type { Checklist, ChecklistItem } from '$lib/content/types';

	interface Props {
		/** Checklist to display */
		checklist: Checklist;
		/** Current completion state of items */
		completedItems?: Record<string, boolean>;
		/** Callback when an item is toggled */
		onToggleItem?: (checklistId: string, itemId: string, completed: boolean) => void;
		/** Title for the checklist */
		title?: string;
	}

	let {
		checklist,
		completedItems = {},
		onToggleItem,
		title = 'Progress Checklist'
	}: Props = $props();

	function isItemCompleted(itemId: string): boolean {
		return completedItems[itemId] ?? false;
	}

	function handleToggle(item: ChecklistItem) {
		onToggleItem?.(checklist.id, item.id, !isItemCompleted(item.id));
	}

	const completedCount = $derived(
		checklist.items.filter((item) => isItemCompleted(item.id)).length
	);

	const totalCount = $derived(checklist.items.length);
	const progressPercent = $derived(totalCount > 0 ? (completedCount / totalCount) * 100 : 0);
	const isAllComplete = $derived(completedCount === totalCount && totalCount > 0);
</script>

<div class="checklist-block" class:all-complete={isAllComplete}>
	<div class="checklist-header">
		<div class="header-left">
			<span class="checklist-icon">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 11 12 14 22 4" />
					<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
				</svg>
			</span>
			<h4 class="checklist-title">{title}</h4>
		</div>
		<span class="checklist-progress">
			{completedCount}/{totalCount}
		</span>
	</div>

	<div class="progress-track">
		<div class="progress-fill" style="width: {progressPercent}%;"></div>
	</div>

	<ul class="checklist-items">
		{#each checklist.items as item (item.id)}
			<li class="checklist-item">
				<label class="item-label" class:completed={isItemCompleted(item.id)}>
					<input
						type="checkbox"
						checked={isItemCompleted(item.id)}
						onchange={() => handleToggle(item)}
						class="item-checkbox"
					/>
					<span class="item-check">
						{#if isItemCompleted(item.id)}
							<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						{/if}
					</span>
					<span class="item-text">{item.text}</span>
				</label>
			</li>
		{/each}
	</ul>

	{#if isAllComplete}
		<div class="complete-message">
			<span class="complete-icon">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="8" r="7" />
					<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
				</svg>
			</span>
			<span>All tasks complete!</span>
		</div>
	{/if}
</div>

<style>
	.checklist-block {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin: var(--space-6) 0;
	}

	.checklist-block.all-complete {
		border-color: var(--success-subtle-border);
		background-color: var(--success-subtle-bg);
	}

	.checklist-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.checklist-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-success-500);
	}

	.checklist-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.checklist-progress {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.progress-track {
		height: 4px;
		background-color: var(--progress-bg);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-4);
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-success-500);
		border-radius: var(--radius-full);
		transition: width var(--duration-300) var(--ease-out);
	}

	.checklist-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.checklist-item {
		margin: var(--space-2) 0;
	}

	.item-label {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		cursor: pointer;
		padding: var(--space-2);
		margin: calc(-1 * var(--space-2));
		border-radius: var(--radius-md);
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.item-label:hover {
		background-color: var(--color-bg-tertiary);
	}

	.item-checkbox {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.item-check {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: var(--border-width-2) solid var(--color-border-primary);
		border-radius: var(--radius-sm);
		background-color: var(--color-bg-primary);
		color: white;
		transition: all var(--duration-150) var(--ease-out);
		margin-top: 1px;
	}

	.item-label.completed .item-check {
		background-color: var(--color-success-500);
		border-color: var(--color-success-500);
	}

	.item-label:hover .item-check {
		border-color: var(--color-primary-400);
	}

	.item-text {
		flex: 1;
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		line-height: var(--leading-normal);
		transition: all var(--duration-150) var(--ease-out);
	}

	.item-label.completed .item-text {
		color: var(--color-text-tertiary);
		text-decoration: line-through;
	}

	.complete-message {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: var(--border-width) solid var(--success-subtle-border);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--success-subtle-text);
	}

	.complete-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-success-500);
	}
</style>
