<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Settings state - editable form fields
	let userName = $state('');
	let email = $state('');
	let dailyGoal = $state(30);
	let darkMode = $state(false);
	let isSubmitting = $state(false);
	let successMessage = $state<string | null>(null);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);

	// Initialize form fields from server data
	$effect(() => {
		// Track data changes and sync to form fields
		const newUserName = data.profile?.display_name || 'Student';
		const newEmail = data.email || '';
		const newDailyGoal = data.profile?.daily_goal_minutes || 30;

		untrack(() => {
			userName = newUserName;
			email = newEmail;
			dailyGoal = newDailyGoal;
		});
	});

	// Check system preference for dark mode
	$effect(() => {
		if (browser) {
			darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
		}
	});

	// Show success message when form succeeds
	$effect(() => {
		if (form?.success) {
			successMessage = form.message || 'Settings saved successfully';
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		}
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (browser) {
			document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
			localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		}
	}
</script>

<svelte:head>
	<title>Settings | AI Analyst Academy</title>
	<meta name="description" content="Manage your account settings and preferences" />
</svelte:head>

<div class="settings-page">
	<header class="page-header">
		<h1 class="page-title">Settings</h1>
		<p class="page-description">Manage your account and preferences</p>
	</header>

	<nav class="settings-nav">
		<a href="/settings" class="nav-item active">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
			Profile
		</a>
		<a href="/settings/api-keys" class="nav-item">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
			</svg>
			API Keys
		</a>
	</nav>

	{#if successMessage}
		<div class="success-message" role="status">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			{successMessage}
		</div>
	{/if}

	{#if form?.error}
		<div class="error-message" role="alert">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			{form.error}
		</div>
	{/if}

	<div class="settings-content">
		<!-- Profile Section -->
		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<section class="settings-section">
				<h2 class="section-title">Profile</h2>
				<p class="section-description">Update your personal information</p>

				<div class="form-group">
					<label class="form-label" for="userName">Display Name</label>
					<input
						type="text"
						id="userName"
						name="displayName"
						class="form-input"
						bind:value={userName}
						placeholder="Your name"
						required
						maxlength="100"
					/>
				</div>

				<div class="form-group">
					<label class="form-label" for="dailyGoal">Daily Learning Goal (minutes)</label>
					<div class="range-input">
						<input
							type="range"
							id="dailyGoal"
							name="dailyGoal"
							min="15"
							max="120"
							step="15"
							bind:value={dailyGoal}
						/>
						<span class="range-value">{dailyGoal} min</span>
					</div>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Saving...
						{:else}
							Save Profile
						{/if}
					</button>
				</div>
			</section>
		</form>

		<!-- Email Section -->
		<form
			method="POST"
			action="?/updateEmail"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<section class="settings-section">
				<h2 class="section-title">Email</h2>
				<p class="section-description">Update your email address</p>

				<div class="form-group">
					<label class="form-label" for="email">Email Address</label>
					<input
						type="email"
						id="email"
						name="email"
						class="form-input"
						bind:value={email}
						placeholder="your@email.com"
						required
					/>
					<p class="form-hint">Changing your email will require verification</p>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn btn-secondary" disabled={isSubmitting || email === data.email}>
						Update Email
					</button>
				</div>
			</section>
		</form>

		<!-- Appearance -->
		<section class="settings-section">
			<h2 class="section-title">Appearance</h2>
			<p class="section-description">Customize how the app looks</p>

			<div class="toggle-group">
				<div class="toggle-content">
					<span class="toggle-label" id="dark-mode-label">Dark Mode</span>
					<span class="toggle-description">Use dark theme for reduced eye strain</span>
				</div>
				<button
					class="toggle-switch"
					class:active={darkMode}
					onclick={toggleDarkMode}
					aria-pressed={darkMode}
					aria-labelledby="dark-mode-label"
				>
					<span class="toggle-knob"></span>
				</button>
			</div>
		</section>

		<!-- Danger Zone -->
		<section class="settings-section danger-zone">
			<h2 class="section-title">Danger Zone</h2>
			<p class="section-description">Irreversible actions for your account</p>

			<div class="danger-actions">
				<button class="btn btn-danger-outline">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
					</svg>
					Export My Data
				</button>
				<button class="btn btn-danger" onclick={() => showDeleteConfirm = true}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Delete Account
				</button>
			</div>
		</section>
	</div>
</div>

<!-- Delete Account Confirmation Modal -->
{#if showDeleteConfirm}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="modal-overlay" onclick={() => showDeleteConfirm = false} onkeydown={(e) => e.key === 'Escape' && (showDeleteConfirm = false)} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" tabindex="-1">
		<div class="modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
			<h2 class="modal-title" id="delete-modal-title">Delete your account?</h2>
			<p class="modal-description">
				This action is permanent and cannot be undone. All your progress, settings, and data will be permanently deleted.
			</p>
			<div class="modal-actions">
				<button class="btn btn-secondary" onclick={() => showDeleteConfirm = false} disabled={isDeleting}>
					Cancel
				</button>
				<form
					method="POST"
					action="?/deleteAccount"
					use:enhance={() => {
						isDeleting = true;
						return async ({ result }) => {
							if (result.type === 'success') {
								goto('/');
							} else {
								isDeleting = false;
								showDeleteConfirm = false;
							}
						};
					}}
				>
					<button type="submit" class="btn btn-danger" disabled={isDeleting}>
						{#if isDeleting}
							<span class="spinner"></span>
							Deleting...
						{:else}
							Yes, Delete My Account
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.settings-page {
		max-width: var(--container-md);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	.page-header {
		margin-bottom: var(--space-6);
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

	/* Settings Nav */
	.settings-nav {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-border-primary);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		background: none;
		border: var(--border-width) solid transparent;
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.nav-item:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-tertiary);
	}

	.nav-item.active {
		color: var(--primary-subtle-text);
		background-color: var(--primary-subtle-bg);
		border-color: var(--primary-subtle-border);
	}

	/* Messages */
	.success-message,
	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.success-message {
		background-color: var(--success-subtle-bg);
		border: var(--border-width) solid var(--success-subtle-border);
		color: var(--success-subtle-text);
	}

	.error-message {
		background-color: var(--error-subtle-bg);
		border: var(--border-width) solid var(--error-subtle-border);
		color: var(--error-subtle-text);
	}

	/* Settings Content */
	.settings-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.settings-section {
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.section-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Form Elements */
	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-group:last-child {
		margin-bottom: 0;
	}

	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		margin-bottom: var(--space-2);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		color: var(--color-text-primary);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
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

	.form-hint {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin: var(--space-2) 0 0 0;
	}

	.form-actions {
		margin-top: var(--space-4);
		display: flex;
		justify-content: flex-end;
	}

	/* Range Input */
	.range-input {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.range-input input[type='range'] {
		flex: 1;
		height: 6px;
		background: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.range-input input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: var(--color-primary-600);
		border-radius: var(--radius-full);
		cursor: pointer;
	}

	.range-value {
		min-width: 60px;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	/* Toggle */
	.toggle-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
	}

	.toggle-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.toggle-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.toggle-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.toggle-switch {
		position: relative;
		width: 48px;
		height: 28px;
		background-color: var(--color-bg-tertiary);
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: background-color var(--duration-150) var(--ease-out);
		flex-shrink: 0;
	}

	.toggle-switch.active {
		background-color: var(--color-primary-600);
	}

	.toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 24px;
		height: 24px;
		background-color: white;
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-sm);
		transition: transform var(--duration-150) var(--ease-out);
	}

	.toggle-switch.active .toggle-knob {
		transform: translateX(20px);
	}

	/* Danger Zone */
	.danger-zone {
		border-color: var(--error-subtle-border);
	}

	.danger-zone .section-title {
		color: var(--color-error-600);
	}

	.danger-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
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
		opacity: 0.6;
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

	.btn-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-danger {
		background-color: var(--color-error-600);
		color: white;
		border: none;
	}

	.btn-danger:hover {
		background-color: var(--color-error-700);
	}

	.btn-danger-outline {
		background-color: transparent;
		color: var(--error-subtle-text);
		border: var(--border-width) solid var(--error-subtle-border);
	}

	.btn-danger-outline:hover {
		background-color: var(--error-subtle-bg);
	}

	/* Spinner */
	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: var(--space-4);
	}

	.modal {
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		max-width: 420px;
		width: 100%;
		box-shadow: var(--shadow-xl);
	}

	.modal-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.modal-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
		line-height: 1.6;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
	}
</style>
