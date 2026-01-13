<script lang="ts">
	import { ProgressRing, ProgressBar } from '$components';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Track which review card is being rated
	let activeReviewId = $state<string | null>(null);

	function getPhaseColor(phaseId: number): string {
		return `var(--color-phase-${phaseId})`;
	}

	function formatNextReview(date: Date): string {
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffDays = Math.ceil(diffMs / 86400000);

		if (diffDays <= 0) return 'Due now';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays < 7) return `In ${diffDays} days`;
		return date.toLocaleDateString();
	}

	function showRatingButtons(reviewId: string) {
		activeReviewId = reviewId;
	}

	function hideRatingButtons() {
		activeReviewId = null;
	}
</script>

<svelte:head>
	<title>Progress | AI Operator Academy</title>
	<meta name="description" content="Track your learning progress through the AI Operator curriculum" />
</svelte:head>

<div class="progress-page">
	<header class="page-header">
		<h1 class="page-title">Your Progress</h1>
		<p class="page-description">Track your journey to becoming an AI Operator</p>
	</header>

	<!-- Overview Stats -->
	<section class="overview-section">
		<div class="overview-grid">
			<div class="overview-card main-progress">
				<div class="progress-ring-container">
					<ProgressRing value={data.overallProgress} size={120} strokeWidth={10} />
				</div>
				<div class="progress-info">
					<span class="progress-label">Overall Progress</span>
					<span class="progress-value">{data.overallProgress}%</span>
				</div>
			</div>

			<div class="overview-card">
				<div class="stat-icon streak">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{data.currentStreak} days</span>
					<span class="stat-label">Current Streak</span>
				</div>
			</div>

			<div class="overview-card">
				<div class="stat-icon time">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{data.totalTimeSpent}</span>
					<span class="stat-label">Time Invested</span>
				</div>
			</div>

			<div class="overview-card">
				<div class="stat-icon trophy">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
						<path d="M4 22h16" />
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{data.longestStreak} days</span>
					<span class="stat-label">Longest Streak</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Review Queue Section -->
	{#if data.reviewQueue.length > 0 || data.dueReviewCount > 0}
		<section class="review-section">
			<div class="section-header">
				<h2 class="section-title">
					Review Queue
					{#if data.dueReviewCount > 0}
						<span class="due-badge">{data.dueReviewCount} due</span>
					{/if}
				</h2>
				<p class="section-description">Concepts due for spaced repetition review</p>
			</div>

			<div class="review-list">
				{#each data.reviewQueue.filter(r => r.isDue) as review (review.id)}
					<div class="review-card due" class:active={activeReviewId === review.id}>
						<div class="review-header">
							<span class="review-phase" style="background-color: {getPhaseColor(review.phase)}">
								Phase {review.phase}
							</span>
							<span class="review-module">{review.moduleTitle}</span>
						</div>

						<div class="review-content">
							<h3 class="review-concept">{review.conceptTitle}</h3>
							<div class="review-meta">
								<span class="review-count">Reviewed {review.reviewCount} time{review.reviewCount === 1 ? '' : 's'}</span>
								<span class="review-status due">Due now</span>
							</div>
						</div>

						{#if activeReviewId === review.id}
							<div class="review-rating">
								<p class="rating-prompt">How well did you remember this?</p>
								<div class="rating-buttons">
									<form method="POST" action="?/review" use:enhance={() => {
										return async ({ update }) => {
											await update();
											hideRatingButtons();
										};
									}}>
										<input type="hidden" name="reviewId" value={review.id} />
										<button type="submit" name="quality" value="1" class="rating-btn forgot">
											Forgot
										</button>
									</form>
									<form method="POST" action="?/review" use:enhance={() => {
										return async ({ update }) => {
											await update();
											hideRatingButtons();
										};
									}}>
										<input type="hidden" name="reviewId" value={review.id} />
										<button type="submit" name="quality" value="3" class="rating-btn hard">
											Hard
										</button>
									</form>
									<form method="POST" action="?/review" use:enhance={() => {
										return async ({ update }) => {
											await update();
											hideRatingButtons();
										};
									}}>
										<input type="hidden" name="reviewId" value={review.id} />
										<button type="submit" name="quality" value="4" class="rating-btn good">
											Good
										</button>
									</form>
									<form method="POST" action="?/review" use:enhance={() => {
										return async ({ update }) => {
											await update();
											hideRatingButtons();
										};
									}}>
										<input type="hidden" name="reviewId" value={review.id} />
										<button type="submit" name="quality" value="5" class="rating-btn easy">
											Easy
										</button>
									</form>
								</div>
								<button class="cancel-btn" onclick={hideRatingButtons}>Cancel</button>
							</div>
						{:else}
							<button class="review-action-btn" onclick={() => showRatingButtons(review.id)}>
								Review Now
							</button>
						{/if}
					</div>
				{/each}

				{#if data.reviewQueue.filter(r => !r.isDue).length > 0}
					<div class="upcoming-header">
						<h3 class="upcoming-title">Upcoming Reviews</h3>
					</div>
					{#each data.reviewQueue.filter(r => !r.isDue).slice(0, 5) as review (review.id)}
						<div class="review-card upcoming">
							<div class="review-header">
								<span class="review-phase" style="background-color: {getPhaseColor(review.phase)}">
									Phase {review.phase}
								</span>
								<span class="review-module">{review.moduleTitle}</span>
							</div>

							<div class="review-content">
								<h3 class="review-concept">{review.conceptTitle}</h3>
								<div class="review-meta">
									<span class="review-count">Reviewed {review.reviewCount} time{review.reviewCount === 1 ? '' : 's'}</span>
									<span class="review-status upcoming">{formatNextReview(new Date(review.nextReviewAt))}</span>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	{/if}

	<!-- Phase Progress -->
	<section class="phases-section">
		<h2 class="section-title">Phase Progress</h2>
		<div class="phases-list">
			{#each data.phaseProgress as phase (phase.id)}
				<a href="/learn/phase/{phase.id}" class="phase-progress-card">
					<div class="phase-header">
						<span class="phase-number" style="background-color: {getPhaseColor(phase.id)}">
							Phase {phase.id}
						</span>
						<span class="phase-name">{phase.name}</span>
					</div>
					<div class="phase-stats">
						<span class="modules-count">{phase.completed}/{phase.modules} modules</span>
						<span class="phase-percent">{phase.progress}%</span>
					</div>
					<ProgressBar value={phase.progress} size="sm" color={getPhaseColor(phase.id)} />
				</a>
			{/each}
		</div>
	</section>

	<div class="bottom-grid">
		<!-- Recent Activity -->
		<section class="activity-section">
			<h2 class="section-title">Recent Activity</h2>
			{#if data.recentActivity.length > 0}
				<div class="activity-list">
					{#each data.recentActivity as activity, i (i)}
						<div class="activity-item">
							<div class="activity-icon" class:module={activity.type === 'module'} class:lab={activity.type === 'lab'}>
								{#if activity.type === 'module'}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
										<polyline points="14 2 14 8 20 8" />
									</svg>
								{:else}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								{/if}
							</div>
							<div class="activity-content">
								<span class="activity-title">{activity.title}</span>
								<span class="activity-time">{activity.time}</span>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p>No activity yet. Start learning to see your progress here!</p>
					<a href="/learn" class="btn btn-primary">Start Learning</a>
				</div>
			{/if}
		</section>

		<!-- Achievements -->
		<section class="achievements-section">
			<h2 class="section-title">Achievements</h2>
			<div class="achievements-grid">
				{#each data.achievements as achievement (achievement.id)}
					<div class="achievement-card" class:earned={achievement.earned}>
						<div class="achievement-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="8" r="6" />
								<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
							</svg>
						</div>
						<div class="achievement-content">
							<span class="achievement-name">{achievement.name}</span>
							<span class="achievement-description">{achievement.description}</span>
						</div>
						{#if achievement.earned}
							<div class="earned-badge">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
								</svg>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.progress-page {
		max-width: var(--container-lg);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--space-8);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.page-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Overview Section */
	.overview-section {
		margin-bottom: var(--space-8);
	}

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	@media (min-width: 768px) {
		.overview-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.overview-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-5);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-align: center;
	}

	.overview-card.main-progress {
		grid-column: span 2;
		flex-direction: row;
		gap: var(--space-6);
	}

	@media (min-width: 768px) {
		.overview-card.main-progress {
			grid-column: span 1;
			flex-direction: column;
			gap: var(--space-3);
		}
	}

	.progress-ring-container {
		flex-shrink: 0;
	}

	.progress-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.progress-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.progress-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		margin-bottom: var(--space-3);
	}

	.stat-icon.streak {
		background-color: var(--color-warning-100);
		color: var(--color-warning-600);
	}

	.stat-icon.time {
		background-color: var(--color-info-100);
		color: var(--color-info-600);
	}

	.stat-icon.trophy {
		background-color: var(--color-success-100);
		color: var(--color-success-600);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Phases Section */
	.phases-section {
		margin-bottom: var(--space-8);
	}

	.phases-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.phase-progress-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
	}

	.phase-progress-card:hover {
		border-color: var(--color-primary-400);
		box-shadow: var(--shadow-sm);
	}

	.phase-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.phase-number {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-md);
	}

	.phase-name {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.phase-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modules-count {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.phase-percent {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
	}

	/* Bottom Grid */
	.bottom-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 768px) {
		.bottom-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Activity Section */
	.activity-section {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-5);
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg);
	}

	.activity-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.activity-icon.module {
		background-color: var(--color-primary-100);
		color: var(--color-primary-600);
	}

	.activity-icon.lab {
		background-color: var(--color-secondary-100);
		color: var(--color-secondary-600);
	}

	.activity-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.activity-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.activity-time {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-6);
	}

	.empty-state p {
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

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

	.btn-primary:hover {
		background-color: var(--color-primary-700);
	}

	/* Achievements Section */
	.achievements-section {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-5);
	}

	.achievements-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.achievement-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg);
		opacity: 0.6;
	}

	.achievement-card.earned {
		opacity: 1;
	}

	.achievement-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}

	.achievement-card.earned .achievement-icon {
		background-color: var(--color-warning-100);
		color: var(--color-warning-600);
	}

	.achievement-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.achievement-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.achievement-description {
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
	}

	.earned-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background-color: var(--color-success-500);
		border-radius: var(--radius-full);
		color: white;
		flex-shrink: 0;
	}

	/* Review Queue Section */
	.review-section {
		margin-bottom: var(--space-8);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-5);
	}

	.section-header {
		margin-bottom: var(--space-4);
	}

	.section-header .section-title {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-1);
	}

	.section-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.due-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		background-color: var(--color-error-500);
		padding: 2px 8px;
		border-radius: var(--radius-full);
	}

	.review-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.review-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-secondary);
		border-radius: var(--radius-lg);
		transition: all var(--duration-150) var(--ease-out);
	}

	.review-card.due {
		border-color: var(--color-warning-300);
		background-color: var(--color-warning-50);
	}

	.review-card.active {
		border-color: var(--color-primary-400);
	}

	.review-card.upcoming {
		opacity: 0.8;
	}

	.review-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.review-phase {
		padding: 2px 8px;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-sm);
	}

	.review-module {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.review-content {
		flex: 1;
	}

	.review-concept {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.review-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.review-count {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.review-status {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.review-status.due {
		color: var(--color-warning-700);
		background-color: var(--color-warning-100);
	}

	.review-status.upcoming {
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
	}

	.review-action-btn {
		align-self: flex-start;
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: white;
		background-color: var(--color-primary-600);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.review-action-btn:hover {
		background-color: var(--color-primary-700);
	}

	.review-rating {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.rating-prompt {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		margin: 0;
	}

	.rating-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.rating-buttons form {
		display: contents;
	}

	.rating-btn {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		border: var(--border-width) solid;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.rating-btn.forgot {
		color: var(--color-error-700);
		background-color: var(--color-error-50);
		border-color: var(--color-error-300);
	}

	.rating-btn.forgot:hover {
		background-color: var(--color-error-100);
	}

	.rating-btn.hard {
		color: var(--color-warning-700);
		background-color: var(--color-warning-50);
		border-color: var(--color-warning-300);
	}

	.rating-btn.hard:hover {
		background-color: var(--color-warning-100);
	}

	.rating-btn.good {
		color: var(--color-success-700);
		background-color: var(--color-success-50);
		border-color: var(--color-success-300);
	}

	.rating-btn.good:hover {
		background-color: var(--color-success-100);
	}

	.rating-btn.easy {
		color: var(--color-primary-700);
		background-color: var(--color-primary-50);
		border-color: var(--color-primary-300);
	}

	.rating-btn.easy:hover {
		background-color: var(--color-primary-100);
	}

	.cancel-btn {
		align-self: flex-start;
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.cancel-btn:hover {
		color: var(--color-text-secondary);
	}

	.upcoming-header {
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.upcoming-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-3) 0;
	}
</style>
