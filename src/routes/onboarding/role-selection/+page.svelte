<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			currentPersona: string | null;
		};
		form: {
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	// svelte-ignore state_referenced_locally
	const initialPersona = data.currentPersona;
	let selectedRole = $state<string | null>(initialPersona);
	let isSubmitting = $state(false);

	// IDs must match database CHECK constraint: career_pivoter, student, team_lead, explorer
	const personas = [
		{
			id: 'career_pivoter',
			title: 'Career Pivoter',
			subtitle: 'Transitioning into AI',
			description:
				'You have domain expertise and want to add AI skills to your toolkit. Ready for a structured learning path.',
			icon: 'compass',
			timeCommitment: '8-10 hours/week',
			path: 'Full sequential curriculum',
			color: 'phase-1'
		},
		{
			id: 'student',
			title: 'Business Student',
			subtitle: 'Academic foundation',
			description:
				'You want to understand AI from a business perspective. Focused on concepts, strategy, and the capstone project.',
			icon: 'academic',
			timeCommitment: '4-6 hours/week',
			path: 'Accelerated with capstone focus',
			color: 'phase-2'
		},
		{
			id: 'team_lead',
			title: 'Team Lead',
			subtitle: 'Leading AI adoption',
			description:
				"You're responsible for AI initiatives at your organization. Need strategy and governance frameworks first.",
			icon: 'users',
			timeCommitment: '2-4 hours/week',
			path: 'Strategy-first approach',
			color: 'phase-4'
		},
		{
			id: 'explorer',
			title: 'Curious Explorer',
			subtitle: 'Learning by doing',
			description:
				"You prefer hands-on experimentation over structured learning. Jump into the sandbox and explore freely.",
			icon: 'sparkles',
			timeCommitment: 'Self-paced',
			path: 'Sandbox-first exploration',
			color: 'phase-3'
		}
	];

	function selectRole(id: string) {
		selectedRole = id;
	}
</script>

<svelte:head>
	<title>Choose Your Path | AI Analyst Academy</title>
	<meta name="description" content="Select your learning persona to get a personalized curriculum path" />
</svelte:head>

<div class="onboarding-page">
	<div class="onboarding-container">
		<div class="onboarding-header">
			<div class="step-indicator">
				<span class="step active">1</span>
				<span class="step-line"></span>
				<span class="step">2</span>
				<span class="step-line"></span>
				<span class="step">3</span>
			</div>
			<h1 class="onboarding-title">What brings you here?</h1>
			<p class="onboarding-subtitle">
				Choose the path that best matches your situation. This helps us personalize your learning experience.
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

		<form
			method="POST"
			action="?/selectRole"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<input type="hidden" name="personaType" value={selectedRole ?? ''} />

			<div class="persona-grid">
				{#each personas as persona (persona.id)}
					<button
						type="button"
						class="persona-card {persona.color}"
						class:selected={selectedRole === persona.id}
						onclick={() => selectRole(persona.id)}
					>
						<div class="persona-icon">
							{#if persona.icon === 'compass'}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="10" />
									<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
								</svg>
							{:else if persona.icon === 'academic'}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
									<path d="M6 12v5c3 3 9 3 12 0v-5" />
								</svg>
							{:else if persona.icon === 'users'}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
							{:else if persona.icon === 'sparkles'}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
									<path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
									<path d="M18 14l.5 1.5L20 16l-1.5.5L18 18l-.5-1.5L16 16l1.5-.5L18 14z" />
								</svg>
							{/if}
						</div>
						<div class="persona-content">
							<h3 class="persona-title">{persona.title}</h3>
							<span class="persona-subtitle">{persona.subtitle}</span>
							<p class="persona-description">{persona.description}</p>
							<div class="persona-meta">
								<span class="meta-item">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
									{persona.timeCommitment}
								</span>
								<span class="meta-item">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
										<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
										<polyline points="22 4 12 14.01 9 11.01" />
									</svg>
									{persona.path}
								</span>
							</div>
						</div>
						{#if selectedRole === persona.id}
							<div class="selected-indicator">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
						{/if}
					</button>
				{/each}
			</div>

			<div class="onboarding-actions">
				<button
					type="submit"
					class="continue-btn"
					disabled={!selectedRole || isSubmitting}
				>
					{#if isSubmitting}
						<span class="spinner"></span>
						Saving...
					{:else}
						Continue
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					{/if}
				</button>
			</div>
		</form>

		<p class="onboarding-footer">
			You can change this later in your <a href="/settings">settings</a>
		</p>
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
		max-width: 800px;
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

	.step-line {
		width: 40px;
		height: 2px;
		background-color: var(--color-border-primary);
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
		max-width: 500px;
		margin-inline: auto;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background-color: var(--error-subtle-bg);
		border: var(--border-width) solid var(--error-subtle-border);
		border-radius: var(--radius-lg);
		color: var(--error-subtle-text);
		font-size: var(--text-sm);
		margin-bottom: var(--space-6);
	}

	.persona-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	@media (max-width: 640px) {
		.persona-grid {
			grid-template-columns: 1fr;
		}
	}

	.persona-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: 2px solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-align: left;
		cursor: pointer;
		transition: all var(--duration-200) var(--ease-out);
	}

	.persona-card:hover {
		border-color: var(--color-border-secondary);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.persona-card.selected {
		border-color: var(--phase-color, var(--color-primary-500));
		background-color: var(--color-bg-primary);
		box-shadow: var(--shadow-lg);
	}

	.persona-card.phase-1 {
		--phase-color: var(--color-phase-1);
	}

	.persona-card.phase-2 {
		--phase-color: var(--color-phase-2);
	}

	.persona-card.phase-3 {
		--phase-color: var(--color-phase-3);
	}

	.persona-card.phase-4 {
		--phase-color: var(--color-phase-4);
	}

	.persona-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		background-color: var(--phase-color, var(--primary-icon-bg));
		color: var(--phase-color, var(--color-primary-500));
		margin-bottom: var(--space-4);
	}

	.persona-icon svg {
		width: 24px;
		height: 24px;
	}

	.persona-content {
		flex: 1;
	}

	.persona-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.persona-subtitle {
		font-size: var(--text-sm);
		color: var(--phase-color, var(--color-primary-600));
		font-weight: var(--font-medium);
	}

	.persona-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: var(--space-3) 0;
		line-height: 1.5;
	}

	.persona-meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.selected-indicator {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--phase-color, var(--color-primary-600));
		border-radius: 50%;
		color: white;
	}

	.selected-indicator svg {
		width: 14px;
		height: 14px;
	}

	.onboarding-actions {
		display: flex;
		justify-content: center;
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

	.onboarding-footer {
		text-align: center;
		margin-top: var(--space-6);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.onboarding-footer a {
		color: var(--color-primary-600);
		font-weight: var(--font-medium);
		text-decoration: none;
	}

	.onboarding-footer a:hover {
		text-decoration: underline;
	}
</style>
