<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			personaType: string;
		};
		form: {
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>AI Sandbox Setup | AI Analyst Academy</title>
	<meta name="description" content="Learn about AI features in the sandbox" />
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
			<h1 class="onboarding-title">Meet the AI Sandbox</h1>
			<p class="onboarding-subtitle">
				Practice with real AI models — no setup required.
				The sandbox is ready to go with built-in AI access.
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
			<!-- Default Mode Card -->
			<div class="mode-card default-mode">
				<div class="mode-header">
					<div class="mode-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
							<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
						</svg>
					</div>
					<span class="mode-badge">Ready to use</span>
				</div>
				<h2 class="mode-title">Built-in AI Access</h2>
				<p class="mode-description">
					Jump right into the sandbox with our provided AI service.
					No API keys needed — just start practicing.
				</p>
				<ul class="mode-features">
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Works immediately</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Included with your account</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Perfect for learning</span>
					</li>
				</ul>
			</div>

			<!-- BYOK Mode Card -->
			<div class="mode-card byok-mode">
				<div class="mode-header">
					<div class="mode-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
							<path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
						</svg>
					</div>
					<span class="mode-badge optional">Optional</span>
				</div>
				<h2 class="mode-title">Bring Your Own Key</h2>
				<p class="mode-description">
					Power users can use their own API keys from OpenAI, Anthropic, or Google
					directly in the sandbox.
				</p>
				<ul class="mode-features">
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Choose your preferred model</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Keys stored locally in your browser</span>
					</li>
					<li>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						<span>Configure in sandbox settings</span>
					</li>
				</ul>
			</div>

			<!-- Security note -->
			<div class="security-note">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
				<p>
					<strong>Your privacy protected.</strong> If you use BYOK, your API keys are stored
					only in your browser's local storage — never on our servers.
				</p>
			</div>
		</div>

		<div class="onboarding-actions">
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
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	/* Mode Cards */
	.mode-card {
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		transition: all var(--duration-200) var(--ease-out);
	}

	.mode-card.default-mode {
		border-color: var(--color-success-300);
		background-color: var(--color-success-50);
	}

	.mode-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.mode-icon {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background-color: var(--color-bg-primary);
		color: var(--color-text-secondary);
	}

	.default-mode .mode-icon {
		background-color: var(--color-success-100);
		color: var(--color-success-600);
	}

	.mode-badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-3);
		background-color: var(--color-success-100);
		color: var(--color-success-700);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
	}

	.mode-badge.optional {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-tertiary);
	}

	.mode-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.mode-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
		line-height: 1.5;
	}

	.mode-features {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.mode-features li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.mode-features svg {
		flex-shrink: 0;
		color: var(--color-success-500);
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
