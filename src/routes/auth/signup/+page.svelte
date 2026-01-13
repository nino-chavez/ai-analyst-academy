<script lang="ts">
	import { page } from '$app/stores';
	import { createSupabaseBrowserClient } from '$lib/supabase';
	import { features } from '$lib/config/features';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	const supabase = createSupabaseBrowserClient();

	async function handleSignup(e: Event) {
		e.preventDefault();
		if (!email || !password || !confirmPassword) return;

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		isLoading = true;
		error = null;

		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${$page.url.origin}/auth/callback`
			}
		});

		if (authError) {
			error = authError.message;
			isLoading = false;
			return;
		}

		// If session exists, user is already confirmed (email confirmation disabled)
		// Redirect to onboarding
		if (data.session) {
			window.location.href = '/onboarding';
			return;
		}

		// Otherwise, show email confirmation message
		success = true;
		isLoading = false;
	}

	async function handleOAuthLogin(provider: 'google' | 'github') {
		isLoading = true;
		error = null;

		const { error: authError } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${$page.url.origin}/auth/callback`
			}
		});

		if (authError) {
			error = authError.message;
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up | AI Analyst Academy</title>
	<meta name="description" content="Create your AI Analyst Academy account" />
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<div class="auth-header">
			<a href="/" class="logo">
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
					<rect width="32" height="32" rx="8" fill="var(--color-primary-600)" />
					<path
						d="M8 22L16 10L24 22H8Z"
						stroke="white"
						stroke-width="2"
						stroke-linejoin="round"
						fill="none"
					/>
				</svg>
				<span>AI Analyst Academy</span>
			</a>
			<h1 class="auth-title">Create your account</h1>
			<p class="auth-subtitle">Start your journey to becoming an AI Analyst</p>
		</div>

		{#if success}
			<div class="success-message" role="status">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
				<div>
					<strong>Check your email</strong>
					<p>We've sent you a confirmation link to {email}</p>
				</div>
			</div>
		{:else}
			{#if error}
				<div class="error-message" role="alert">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					{error}
				</div>
			{/if}

			{#if features.auth.googleOAuth || features.auth.githubOAuth}
				<div class="oauth-buttons">
					{#if features.auth.googleOAuth}
						<button
							type="button"
							class="oauth-btn"
							onclick={() => handleOAuthLogin('google')}
							disabled={isLoading}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Continue with Google
						</button>
					{/if}

					{#if features.auth.githubOAuth}
						<button
							type="button"
							class="oauth-btn"
							onclick={() => handleOAuthLogin('github')}
							disabled={isLoading}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path
									d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
								/>
							</svg>
							Continue with GitHub
						</button>
					{/if}
				</div>

				<div class="divider">
					<span>or</span>
				</div>
			{/if}

			<form class="auth-form" onsubmit={handleSignup}>
				<div class="form-group">
					<label for="email" class="form-label">Email</label>
					<input
						type="email"
						id="email"
						class="form-input"
						bind:value={email}
						placeholder="you@example.com"
						required
						disabled={isLoading}
					/>
				</div>

				<div class="form-group">
					<label for="password" class="form-label">Password</label>
					<input
						type="password"
						id="password"
						class="form-input"
						bind:value={password}
						placeholder="••••••••"
						required
						minlength="8"
						disabled={isLoading}
					/>
					<span class="form-hint">Must be at least 8 characters</span>
				</div>

				<div class="form-group">
					<label for="confirmPassword" class="form-label">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						class="form-input"
						bind:value={confirmPassword}
						placeholder="••••••••"
						required
						disabled={isLoading}
					/>
				</div>

				<button
					type="submit"
					class="submit-btn"
					disabled={isLoading || !email || !password || !confirmPassword}
				>
					{#if isLoading}
						<span class="spinner"></span>
						Creating account...
					{:else}
						Create account
					{/if}
				</button>
			</form>
		{/if}

		<p class="auth-footer">
			Already have an account? <a href="/auth/login">Sign in</a>
		</p>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
	}

	.auth-container {
		width: 100%;
		max-width: 400px;
	}

	.auth-header {
		text-align: center;
		margin-bottom: var(--space-6);
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		text-decoration: none;
		margin-bottom: var(--space-6);
	}

	.auth-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.auth-subtitle {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.success-message {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-success-50);
		border: var(--border-width) solid var(--color-success-200);
		border-radius: var(--radius-lg);
		color: var(--color-success-700);
		margin-bottom: var(--space-4);
	}

	.success-message svg {
		flex-shrink: 0;
		margin-top: 2px;
	}

	.success-message strong {
		display: block;
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-1);
	}

	.success-message p {
		margin: 0;
		font-size: var(--text-sm);
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
		margin-bottom: var(--space-4);
	}

	.oauth-buttons {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.oauth-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.oauth-btn:hover:not(:disabled) {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-border-secondary);
	}

	.oauth-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin: var(--space-6) 0;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background-color: var(--color-border-primary);
	}

	.divider span {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.form-input {
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
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.form-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.form-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-hint {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3);
		background-color: var(--color-primary-600);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: white;
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.submit-btn:hover:not(:disabled) {
		background-color: var(--color-primary-700);
	}

	.submit-btn:disabled {
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

	.auth-footer {
		text-align: center;
		margin-top: var(--space-6);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.auth-footer a {
		color: var(--color-primary-600);
		font-weight: var(--font-medium);
		text-decoration: none;
	}

	.auth-footer a:hover {
		text-decoration: underline;
	}
</style>
