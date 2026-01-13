<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Provider display names
	const providerNames: Record<string, string> = {
		openai: 'OpenAI',
		anthropic: 'Anthropic',
		google: 'Google (Gemini)'
	};

	let showAddModal = $state(false);
	let selectedProvider = $state<'openai' | 'anthropic' | 'google' | null>(null);
	let keyInput = $state('');
	let isSubmitting = $state(false);
	let successMessage = $state<string | null>(null);

	// Show success message when form succeeds
	$effect(() => {
		if (form?.success) {
			successMessage = form.provider
				? `${providerNames[form.provider as string] || form.provider} API key saved`
				: form.removed
					? `${providerNames[form.removed as string] || form.removed} API key removed`
					: 'Changes saved';
			closeModal();
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		}
	});

	function openAddModal(provider: 'openai' | 'anthropic' | 'google') {
		selectedProvider = provider;
		keyInput = '';
		showAddModal = true;
	}

	function closeModal() {
		showAddModal = false;
		selectedProvider = null;
		keyInput = '';
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:head>
	<title>API Keys | Settings | AI Analyst Academy</title>
	<meta name="description" content="Manage your AI provider API keys for the sandbox" />
</svelte:head>

<div class="settings-page">
	<header class="page-header">
		<h1 class="page-title">Settings</h1>
		<p class="page-description">Manage your account and preferences</p>
	</header>

	<nav class="settings-nav">
		<a href="/settings" class="nav-item">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
			Profile
		</a>
		<a href="/settings/api-keys" class="nav-item active">
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
		<!-- Info Banner -->
		<div class="info-banner">
			<div class="info-icon">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<circle cx="12" cy="12" r="10" />
					<path d="M12 16v-4M12 8h.01" />
				</svg>
			</div>
			<div class="info-content">
				<h3 class="info-title">Bring Your Own Key (BYOK)</h3>
				<p class="info-text">
					Your API keys are encrypted and stored securely on our servers.
					They are only decrypted when making API calls to your chosen providers.
				</p>
			</div>
		</div>

		<!-- API Keys List -->
		<section class="keys-section">
			<h2 class="section-title">Configured Providers</h2>
			<p class="section-description">Add API keys to enable the AI Sandbox with different providers</p>

			<div class="keys-list">
				{#each data.keys as key (key.provider)}
					<div class="key-card" class:configured={key.configured}>
						<div class="key-provider">
							<div class="provider-icon {key.provider}">
								{#if key.provider === 'openai'}
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4066-.6567zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
									</svg>
								{:else if key.provider === 'anthropic'}
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M17.304 3.541h-3.672l6.696 16.918h3.672L17.304 3.541zm-10.608 0L0 20.459h3.744l1.38-3.636h6.912l1.38 3.636h3.744L10.464 3.541H6.696zm.576 10.778l2.352-6.192 2.352 6.192H7.272z" />
									</svg>
								{:else}
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
										<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
										<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
										<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
									</svg>
								{/if}
							</div>
							<div class="provider-info">
								<span class="provider-name">{providerNames[key.provider] || key.provider}</span>
								{#if key.configured}
									<span class="provider-status configured">
										{key.keyHint ? key.keyHint : 'Configured'}
									</span>
								{:else}
									<span class="provider-status">Not configured</span>
								{/if}
							</div>
						</div>

						<div class="key-actions">
							{#if key.configured}
								<button class="btn btn-secondary btn-sm" onclick={() => openAddModal(key.provider as 'openai' | 'anthropic' | 'google')}>
									Update
								</button>
								<form
									method="POST"
									action="?/removeKey"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											await update();
											isSubmitting = false;
										};
									}}
								>
									<input type="hidden" name="provider" value={key.provider} />
									<button type="submit" class="btn btn-danger-outline btn-sm" disabled={isSubmitting}>
										Remove
									</button>
								</form>
							{:else}
								<button class="btn btn-primary btn-sm" onclick={() => openAddModal(key.provider as 'openai' | 'anthropic' | 'google')}>
									Add Key
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Security Info -->
		<section class="security-section">
			<h2 class="section-title">Security</h2>
			<ul class="security-list">
				<li>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					Keys are encrypted before being stored
				</li>
				<li>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					API calls are proxied through our secure servers
				</li>
				<li>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					Keys are only decrypted when making API requests
				</li>
			</ul>
		</section>
	</div>
</div>

<!-- Add Key Modal -->
{#if showAddModal && selectedProvider}
	<div
		class="modal-overlay"
		onclick={closeModal}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions, a11y_no_static_element_interactions -->
		<div class="modal" onclick={(e) => e.stopPropagation()} role="document">
			<div class="modal-header">
				<h2 class="modal-title" id="modal-title">
					Add {providerNames[selectedProvider]} API Key
				</h2>
				<button class="modal-close" onclick={closeModal} aria-label="Close modal">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<form
				method="POST"
				action="?/saveKey"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="modal-body">
					<input type="hidden" name="provider" value={selectedProvider} />

					<div class="form-group">
						<label class="form-label" for="apiKey">API Key</label>
						<input
							type="password"
							id="apiKey"
							name="apiKey"
							class="form-input"
							bind:value={keyInput}
							placeholder={selectedProvider === 'openai' ? 'sk-...' : selectedProvider === 'anthropic' ? 'sk-ant-...' : 'AIza...'}
							required
						/>
					</div>

					<div class="key-help">
						<p class="help-text">
							{#if selectedProvider === 'openai'}
								Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">OpenAI Dashboard</a>
							{:else if selectedProvider === 'anthropic'}
								Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Anthropic Console</a>
							{:else}
								Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>
							{/if}
						</p>
					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn btn-primary" disabled={!keyInput.trim() || isSubmitting}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Saving...
						{:else}
							Save Key
						{/if}
					</button>
				</div>
			</form>
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
		color: var(--color-primary-600);
		background-color: var(--color-primary-50);
		border-color: var(--color-primary-200);
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
		background-color: var(--color-success-50);
		border: var(--border-width) solid var(--color-success-200);
		color: var(--color-success-700);
	}

	.error-message {
		background-color: var(--color-error-50);
		border: var(--border-width) solid var(--color-error-200);
		color: var(--color-error-700);
	}

	/* Settings Content */
	.settings-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
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

	/* Info Banner */
	.info-banner {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-info-50);
		border: var(--border-width) solid var(--color-info-200);
		border-radius: var(--radius-lg);
	}

	.info-icon {
		flex-shrink: 0;
		color: var(--color-info-600);
	}

	.info-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.info-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--leading-relaxed);
	}

	/* Keys Section */
	.keys-section {
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.keys-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.key-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
	}

	.key-card.configured {
		border-color: var(--color-success-200);
	}

	.key-provider {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.provider-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-lg);
	}

	.provider-icon.openai {
		background-color: #10a37f20;
		color: #10a37f;
	}

	.provider-icon.anthropic {
		background-color: #d4a27420;
		color: #d4a274;
	}

	.provider-icon.google {
		background-color: #4285f420;
		color: #4285f4;
	}

	.provider-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.provider-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.provider-status {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		font-family: monospace;
	}

	.provider-status.configured {
		color: var(--color-success-600);
	}

	.key-actions {
		display: flex;
		gap: var(--space-2);
	}

	/* Security Section */
	.security-section {
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.security-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.security-list li {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.security-list svg {
		color: var(--color-success-500);
		flex-shrink: 0;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		z-index: 100;
	}

	.modal {
		width: 100%;
		max-width: 480px;
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4) var(--space-5);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
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
		width: 32px;
		height: 32px;
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

	.modal-body {
		padding: var(--space-5);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-5);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	/* Form Elements */
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

	.form-input {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		font-family: monospace;
		color: var(--color-text-primary);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		transition: all var(--duration-150) var(--ease-out);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.key-help {
		padding: var(--space-3);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
	}

	.help-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.help-text a {
		color: var(--color-primary-600);
		text-decoration: none;
	}

	.help-text a:hover {
		text-decoration: underline;
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

	.btn-sm {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
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

	.btn-secondary:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.btn-danger-outline {
		background-color: transparent;
		color: var(--color-error-600);
		border: var(--border-width) solid var(--color-error-200);
	}

	.btn-danger-outline:hover:not(:disabled) {
		background-color: var(--color-error-50);
	}

	.btn-danger-outline:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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
</style>
