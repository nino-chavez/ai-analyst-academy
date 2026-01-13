<script lang="ts">
	import { page } from '$app/stores';

	const status = $derived($page.status);
	const message = $derived($page.error?.message || 'Something went wrong');

	const errorMessages: Record<number, { title: string; description: string }> = {
		404: {
			title: 'Page not found',
			description: "The page you're looking for doesn't exist or has been moved."
		},
		500: {
			title: 'Server error',
			description: 'Something went wrong on our end. Please try again later.'
		},
		403: {
			title: 'Access denied',
			description: "You don't have permission to view this page."
		}
	};

	const errorInfo = $derived(
		errorMessages[status] || {
			title: 'Error',
			description: message
		}
	);
</script>

<div class="error-page">
	<div class="error-content">
		<div class="error-code">{status}</div>
		<h1 class="error-title">{errorInfo.title}</h1>
		<p class="error-description">{errorInfo.description}</p>

		<div class="error-actions">
			<a href="/" class="btn btn-primary">Go home</a>
			<a href="/learn" class="btn btn-secondary">Browse curriculum</a>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: calc(100vh - var(--header-height, 64px));
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		background-color: var(--color-bg-primary);
	}

	.error-content {
		text-align: center;
		max-width: 480px;
	}

	.error-code {
		font-size: clamp(4rem, 15vw, 8rem);
		font-weight: var(--font-bold);
		color: var(--color-text-tertiary);
		line-height: 1;
		margin-bottom: var(--space-4);
	}

	.error-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-3);
	}

	.error-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-8);
		line-height: var(--leading-relaxed);
	}

	.error-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all var(--duration-150) var(--ease-out);
		cursor: pointer;
		border: none;
	}

	.btn:focus-visible {
		outline: 2px solid var(--ring-color);
		outline-offset: 2px;
	}

	.btn-primary {
		background-color: var(--color-primary-500);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--color-primary-600);
		text-decoration: none;
	}

	.btn-secondary {
		background-color: var(--color-bg-secondary);
		color: var(--color-text-primary);
		border: var(--border-width) solid var(--color-border-primary);
	}

	.btn-secondary:hover {
		background-color: var(--color-bg-tertiary);
		text-decoration: none;
	}
</style>
