<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			personaType: string;
			hasApiKeys: boolean;
			configuredProviders: string[];
		};
		form: {
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let isSubmitting = $state(false);

	const providers = [
		{
			id: 'openai',
			name: 'OpenAI',
			description: 'ChatGPT, GPT-4, DALL-E',
			link: 'https://platform.openai.com/api-keys',
			color: '#10a37f'
		},
		{
			id: 'anthropic',
			name: 'Anthropic',
			description: 'Claude 3, Claude 3.5',
			link: 'https://console.anthropic.com/settings/keys',
			color: '#d4a274'
		},
		{
			id: 'google',
			name: 'Google',
			description: 'Gemini Pro, Gemini Ultra',
			link: 'https://aistudio.google.com/app/apikey',
			color: '#4285f4'
		}
	];
</script>

<svelte:head>
	<title>AI Sandbox Setup | AI Operator Academy</title>
	<meta name="description" content="Configure your AI provider API keys for the sandbox" />
</svelte:head>

<div class="onboarding-page">
	<div class="onboarding-container">
		<div class="onboarding-header">
			<div class="step-indicator">
				<span class="step completed">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="14" height="14">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</span>
				<span class="step-line completed"></span>
				<span class="step completed">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="14" height="14">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</span>
				<span class="step-line completed"></span>
				<span class="step active">3</span>
			</div>
			<h1 class="onboarding-title">Power up the AI Sandbox</h1>
			<p class="onboarding-subtitle">
				Bring your own API keys to unlock hands-on practice with real AI models.
				This is optional — you can use demo mode without keys.
			</p>
		</div>

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

		<div class="setup-content">
			<!-- Benefits section -->
			<div class="benefits-card">
				<h2 class="benefits-title">Why add API keys?</h2>
				<ul class="benefits-list">
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Practice with <strong>real AI models</strong> during labs</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Compare responses across <strong>different providers</strong></span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Build your <strong>prompt portfolio</strong> with real results</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>You <strong>control your costs</strong> — pay only for what you use</span>
					</li>
				</ul>
			</div>

			<!-- Provider cards -->
			<div class="providers-section">
				<h2 class="section-title">Supported Providers</h2>
				<p class="section-description">
					{#if data.hasApiKeys}
						You have {data.configuredProviders.length} provider{data.configuredProviders.length === 1 ? '' : 's'} configured.
					{:else}
						Set up any provider to get started. You can add more later.
					{/if}
				</p>

				<div class="providers-grid">
					{#each providers as provider (provider.id)}
						<div class="provider-card" class:configured={data.configuredProviders.includes(provider.id)}>
							<div class="provider-header">
								<div class="provider-icon" style="--provider-color: {provider.color}">
									{#if provider.id === 'openai'}
										<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
											<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
										</svg>
									{:else if provider.id === 'anthropic'}
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
								{#if data.configuredProviders.includes(provider.id)}
									<span class="configured-badge">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12">
											<polyline points="20 6 9 17 4 12" />
										</svg>
										Configured
									</span>
								{/if}
							</div>
							<h3 class="provider-name">{provider.name}</h3>
							<p class="provider-description">{provider.description}</p>
							<a href={provider.link} target="_blank" rel="noopener" class="provider-link">
								Get API key
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
									<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
								</svg>
							</a>
						</div>
					{/each}
				</div>

				<a href="/settings/api-keys" class="setup-link">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
						<path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
					{#if data.hasApiKeys}
						Manage API keys in Settings
					{:else}
						Add your API keys in Settings
					{/if}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			</div>

			<!-- Security note -->
			<div class="security-note">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
				<p>
					Your API keys are <strong>encrypted</strong> before storage and only decrypted when making API calls.
					We never see your keys in plain text.
				</p>
			</div>
		</div>

		<div class="onboarding-actions">
			<form method="POST" action="?/skip" class="skip-form">
				<button type="submit" class="skip-btn" disabled={isSubmitting}>
					{#if data.hasApiKeys}
						Continue without more keys
					{:else}
						Skip for now (demo mode)
					{/if}
				</button>
			</form>
			<form
				method="POST"
				action="?/complete"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<button
					type="submit"
					class="continue-btn"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<span class="spinner"></span>
						Finishing...
					{:else}
						Start Learning
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					{/if}
				</button>
			</form>
		</div>

		<div class="onboarding-nav">
			<a href="/onboarding/goal-setting" class="back-link">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
					<line x1="19" y1="12" x2="5" y2="12" />
					<polyline points="12 19 5 12 12 5" />
				</svg>
				Back to goal setting
			</a>
		</div>
	</div>
</div>

<style>
	.onboarding-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-6);
		background-color: var(--color-bg-primary);
	}

	.onboarding-container {
		width: 100%;
		max-width: 700px;
	}

	.onboarding-header {
		text-align: center;
		margin-bottom: var(--space-8);
	}

	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
	}

	.step {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-tertiary);
		transition: all var(--duration-200) var(--ease-out);
	}

	.step.active {
		background-color: var(--color-primary-600);
		color: white;
	}

	.step.completed {
		background-color: var(--color-success-500);
		color: white;
	}

	.step-line {
		width: 40px;
		height: 2px;
		background-color: var(--color-border-primary);
	}

	.step-line.completed {
		background-color: var(--color-success-500);
	}

	.onboarding-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3) 0;
	}

	.onboarding-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		margin: 0;
		max-width: 520px;
		margin-inline: auto;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-error-50);
		border: var(--border-width) solid var(--color-error-200);
		border-radius: var(--radius-lg);
		color: var(--color-error-700);
		font-size: var(--text-sm);
		margin-bottom: var(--space-6);
	}

	.setup-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		margin-bottom: var(--space-8);
	}

	/* Benefits Card */
	.benefits-card {
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.benefits-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.benefits-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.benefits-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.benefits-list svg {
		flex-shrink: 0;
		color: var(--color-success-500);
		margin-top: 2px;
	}

	.benefits-list strong {
		color: var(--color-text-primary);
	}

	/* Providers Section */
	.providers-section {
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

	.providers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	@media (max-width: 640px) {
		.providers-grid {
			grid-template-columns: 1fr;
		}
	}

	.provider-card {
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		transition: all var(--duration-200) var(--ease-out);
	}

	.provider-card:hover {
		border-color: var(--color-border-secondary);
		box-shadow: var(--shadow-sm);
	}

	.provider-card.configured {
		border-color: var(--color-success-200);
		background-color: var(--color-success-50);
	}

	.provider-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-3);
	}

	.provider-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background-color: color-mix(in srgb, var(--provider-color) 15%, transparent);
		color: var(--provider-color);
	}

	.configured-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background-color: var(--color-success-100);
		color: var(--color-success-700);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-full);
	}

	.provider-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.provider-description {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin: 0 0 var(--space-3) 0;
	}

	.provider-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-primary-600);
		text-decoration: none;
	}

	.provider-link:hover {
		text-decoration: underline;
	}

	.setup-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
		border: 2px dashed var(--color-border-primary);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-primary-600);
		text-decoration: none;
		transition: all var(--duration-200) var(--ease-out);
	}

	.setup-link:hover {
		border-color: var(--color-primary-300);
		background-color: var(--color-primary-50);
	}

	/* Security Note */
	.security-note {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-lg);
	}

	.security-note svg {
		flex-shrink: 0;
		color: var(--color-success-500);
	}

	.security-note p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.security-note strong {
		color: var(--color-text-primary);
	}

	/* Actions */
	.onboarding-actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-4);
	}

	.skip-form {
		display: contents;
	}

	.skip-btn {
		padding: var(--space-3) var(--space-6);
		background-color: transparent;
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.skip-btn:hover:not(:disabled) {
		background-color: var(--color-bg-secondary);
		border-color: var(--color-border-secondary);
	}

	.skip-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.continue-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-8);
		background-color: var(--color-primary-600);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: white;
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.continue-btn:hover:not(:disabled) {
		background-color: var(--color-primary-700);
	}

	.continue-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

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

	.onboarding-nav {
		text-align: center;
		margin-top: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.back-link:hover {
		color: var(--color-primary-600);
	}
</style>
