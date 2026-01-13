<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			personaType: string;
			currentGoal: number;
		};
		form: {
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	// svelte-ignore state_referenced_locally
	const initialGoal = data.currentGoal;
	let selectedGoal = $state(initialGoal);
	let isSubmitting = $state(false);

	const goalOptions = [
		{
			minutes: 15,
			label: '15 min',
			description: 'Quick daily check-in',
			pace: '~6 weeks to complete',
			icon: 'clock-15'
		},
		{
			minutes: 30,
			label: '30 min',
			description: 'Focused learning session',
			pace: '~4 weeks to complete',
			icon: 'clock-30',
			recommended: true
		},
		{
			minutes: 60,
			label: '1 hour',
			description: 'Deep dive each day',
			pace: '~2 weeks to complete',
			icon: 'clock-60'
		},
		{
			minutes: 90,
			label: '90 min',
			description: 'Intensive learning mode',
			pace: '~10 days to complete',
			icon: 'clock-90'
		}
	];

	// Keys must match database CHECK constraint: career_pivoter, student, team_lead, explorer
	const personaLabels: Record<string, string> = {
		career_pivoter: 'Career Pivoter',
		student: 'Business Student',
		team_lead: 'Team Lead',
		explorer: 'Curious Explorer'
	};
</script>

<svelte:head>
	<title>Set Your Goal | AI Analyst Academy</title>
	<meta name="description" content="Choose your daily learning commitment" />
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
				<span class="step active">2</span>
				<span class="step-line"></span>
				<span class="step">3</span>
			</div>
			<h1 class="onboarding-title">How much time can you commit?</h1>
			<p class="onboarding-subtitle">
				As a <strong>{personaLabels[data.personaType] || 'learner'}</strong>, set a realistic daily goal. Consistency matters more than intensity.
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
			action="?/setGoal"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<input type="hidden" name="dailyGoal" value={selectedGoal} />

			<div class="goal-grid">
				{#each goalOptions as option (option.minutes)}
					<button
						type="button"
						class="goal-card"
						class:selected={selectedGoal === option.minutes}
						class:recommended={option.recommended}
						onclick={() => (selectedGoal = option.minutes)}
					>
						<div class="goal-icon">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 {option.minutes === 15 ? '14 13' : option.minutes === 30 ? '16 12' : option.minutes === 60 ? '12 18' : '8 16'}" />
							</svg>
						</div>
						<div class="goal-content">
							<span class="goal-label">{option.label}</span>
							<span class="goal-description">{option.description}</span>
							<span class="goal-pace">{option.pace}</span>
						</div>
						{#if option.recommended}
							<span class="recommended-badge">Recommended</span>
						{/if}
						{#if selectedGoal === option.minutes}
							<div class="selected-indicator">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
						{/if}
					</button>
				{/each}
			</div>

			<div class="motivation-note">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="16" x2="12" y2="12" />
					<line x1="12" y1="8" x2="12.01" y2="8" />
				</svg>
				<p>
					Research shows that <strong>consistent short sessions</strong> beat irregular long ones.
					Start smaller than you think — you can always increase later.
				</p>
			</div>

			<div class="onboarding-actions">
				<button
					type="submit"
					class="continue-btn"
					disabled={isSubmitting}
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

		<div class="skip-wrapper">
			<form method="POST" action="?/skip">
				<button type="submit" class="skip-btn" disabled={isSubmitting}>
					Skip for now
				</button>
			</form>
		</div>

		<div class="onboarding-nav">
			<a href="/onboarding/role-selection" class="back-link">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
					<line x1="19" y1="12" x2="5" y2="12" />
					<polyline points="12 19 5 12 12 5" />
				</svg>
				Back to role selection
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
		max-width: 600px;
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
	}

	.onboarding-subtitle strong {
		color: var(--color-primary-600);
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

	.goal-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	@media (max-width: 500px) {
		.goal-grid {
			grid-template-columns: 1fr;
		}
	}

	.goal-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: 2px solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-align: center;
		cursor: pointer;
		transition: all var(--duration-200) var(--ease-out);
	}

	.goal-card:hover {
		border-color: var(--color-border-secondary);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.goal-card.selected {
		border-color: var(--color-primary-500);
		background-color: var(--color-bg-primary);
		box-shadow: var(--shadow-lg);
	}

	.goal-card.recommended {
		border-color: var(--primary-subtle-border);
	}

	.goal-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--primary-icon-bg);
		color: var(--color-primary-500);
		margin-bottom: var(--space-3);
	}

	.goal-icon svg {
		width: 24px;
		height: 24px;
	}

	.goal-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.goal-label {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
	}

	.goal-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.goal-pace {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-top: var(--space-1);
	}

	.recommended-badge {
		position: absolute;
		top: calc(-1 * var(--space-2));
		right: var(--space-3);
		padding: var(--space-1) var(--space-2);
		background-color: var(--color-primary-600);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
	}

	.selected-indicator {
		position: absolute;
		top: var(--space-3);
		left: var(--space-3);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-primary-600);
		border-radius: 50%;
		color: white;
	}

	.selected-indicator svg {
		width: 14px;
		height: 14px;
	}

	.motivation-note {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-8);
	}

	.motivation-note svg {
		flex-shrink: 0;
		color: var(--color-primary-500);
	}

	.motivation-note p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.motivation-note strong {
		color: var(--color-text-primary);
	}

	.onboarding-actions {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.skip-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-4);
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
