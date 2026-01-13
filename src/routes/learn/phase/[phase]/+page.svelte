<script lang="ts">
	import { ProgressBar } from '$components';

	interface ModuleData {
		id: string;
		title: string;
		slug: string;
		order: number;
		estimatedMinutes: number;
		description: string;
	}

	interface LabData {
		id: string;
		title: string;
		slug: string;
		estimatedMinutes?: number;
		estimatedHours?: number;
		difficulty: string;
		description: string;
	}

	interface Props {
		data: {
			phase: {
				id: string;
				title: string;
				description: string;
				order: number;
				color: string;
				icon: string;
				estimatedHours: number;
				deliverable: {
					title: string;
					description: string;
				};
			};
			modules: ModuleData[];
			labs: LabData[];
			phaseNumber: number;
		};
	}

	let { data }: Props = $props();

	function getPhaseGradient(order: number): string {
		return `linear-gradient(135deg, var(--color-phase-${order}) 0%, var(--color-phase-${order}-dark) 100%)`;
	}

	function getDifficultyLabel(difficulty: string): string {
		const labels: Record<string, string> = {
			beginner: 'Beginner',
			intermediate: 'Intermediate',
			advanced: 'Advanced'
		};
		return labels[difficulty] || difficulty;
	}

	// TODO: Load actual progress from Supabase
	const moduleProgress: Record<string, number> = {};
</script>

<svelte:head>
	<title>Phase {data.phaseNumber}: {data.phase.title} | AI Analyst Academy</title>
	<meta name="description" content={data.phase.description} />
</svelte:head>

<div class="phase-page">
	<!-- Phase Header -->
	<header class="phase-header" style="background: {getPhaseGradient(data.phase.order)}">
		<div class="header-content">
			<div class="phase-badge">
				<span class="phase-icon">{data.phase.icon}</span>
				<span class="phase-label">Phase {data.phase.order}</span>
			</div>
			<h1 class="phase-title">{data.phase.title}</h1>
			<p class="phase-description">{data.phase.description}</p>

			<div class="phase-stats">
				<div class="stat">
					<span class="stat-value">{data.modules.length}</span>
					<span class="stat-label">Modules</span>
				</div>
				<div class="stat">
					<span class="stat-value">{data.labs.length}</span>
					<span class="stat-label">Labs</span>
				</div>
				<div class="stat">
					<span class="stat-value">{data.phase.estimatedHours}h</span>
					<span class="stat-label">Est. Time</span>
				</div>
			</div>
		</div>
	</header>

	<!-- Modules -->
	<section class="modules-section">
		<h2 class="section-title">Modules</h2>
		<div class="modules-list">
			{#each data.modules as module, index (module.id)}
				<a
					href="/learn/phase/{data.phaseNumber}/{module.slug}"
					class="module-card"
				>
					<div class="module-number">
						<span>{data.phaseNumber}.{index + 1}</span>
					</div>
					<div class="module-content">
						<h3 class="module-title">{module.title}</h3>
						<p class="module-description">{module.description}</p>
						<div class="module-meta">
							<span class="meta-item">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
								{module.estimatedMinutes} min
							</span>
						</div>
						{#if moduleProgress[module.id] !== undefined}
							<div class="module-progress">
								<ProgressBar value={moduleProgress[module.id]} size="sm" />
							</div>
						{/if}
					</div>
					<div class="module-arrow">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Labs -->
	{#if data.labs.length > 0}
		<section class="labs-section">
			<h2 class="section-title">Hands-on Labs</h2>
			<div class="labs-grid">
				{#each data.labs as lab (lab.id)}
					<a href="/learn/lab/{lab.slug}" class="lab-card">
						<div class="lab-header">
							<span class="lab-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M9 3h6v2H9z" />
									<path d="M14 5v2.5a1.5 1.5 0 0 0 1.5 1.5h.5a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a1 1 0 0 1 1-1h.5A1.5 1.5 0 0 0 10 7.5V5" />
									<path d="M10 15h4" />
									<path d="M12 13v4" />
								</svg>
							</span>
							<span class="lab-difficulty difficulty-{lab.difficulty}">
								{getDifficultyLabel(lab.difficulty)}
							</span>
						</div>
						<h3 class="lab-title">{lab.title}</h3>
						<p class="lab-description">{lab.description}</p>
						<div class="lab-meta">
							<span class="meta-item">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
								{#if lab.estimatedHours}
									{lab.estimatedHours}h
								{:else if lab.estimatedMinutes}
									{lab.estimatedMinutes} min
								{:else}
									45 min
								{/if}
							</span>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Deliverable -->
	<section class="deliverable-section">
		<div class="deliverable-card">
			<div class="deliverable-icon">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10" />
					<circle cx="12" cy="12" r="6" />
					<circle cx="12" cy="12" r="2" />
				</svg>
			</div>
			<div class="deliverable-content">
				<span class="deliverable-label">Phase Deliverable</span>
				<h3 class="deliverable-title">{data.phase.deliverable.title}</h3>
				<p class="deliverable-description">{data.phase.deliverable.description}</p>
			</div>
		</div>
	</section>

	<!-- Navigation -->
	<nav class="phase-nav">
		{#if data.phaseNumber > 1}
			<a href="/learn/phase/{data.phaseNumber - 1}" class="nav-link prev">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Phase {data.phaseNumber - 1}
			</a>
		{:else}
			<span></span>
		{/if}

		<a href="/learn" class="nav-link overview">
			Back to Overview
		</a>

		{#if data.phaseNumber < 4}
			<a href="/learn/phase/{data.phaseNumber + 1}" class="nav-link next">
				Phase {data.phaseNumber + 1}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</a>
		{:else}
			<span></span>
		{/if}
	</nav>
</div>

<style>
	.phase-page {
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	/* Phase Header */
	.phase-header {
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		margin-bottom: var(--space-8);
		color: white;
	}

	.header-content {
		max-width: 600px;
	}

	.phase-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-4);
	}

	.phase-icon {
		font-size: var(--text-xl);
	}

	.phase-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.phase-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-3) 0;
	}

	.phase-description {
		font-size: var(--text-lg);
		opacity: 0.9;
		margin: 0 0 var(--space-6) 0;
		line-height: var(--leading-relaxed);
	}

	.phase-stats {
		display: flex;
		gap: var(--space-6);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	.stat-label {
		font-size: var(--text-sm);
		opacity: 0.8;
	}

	/* Sections */
	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Modules */
	.modules-section {
		margin-bottom: var(--space-8);
	}

	.modules-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.module-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: inherit;
		transition: all var(--duration-150) var(--ease-out);
	}

	.module-card:hover {
		border-color: var(--color-primary-500);
		box-shadow: var(--shadow-md);
		text-decoration: none;
	}

	.module-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.module-content {
		flex: 1;
		min-width: 0;
	}

	.module-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.module-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-2) 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.module-meta {
		display: flex;
		gap: var(--space-4);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.module-progress {
		margin-top: var(--space-2);
	}

	.module-arrow {
		color: var(--color-text-tertiary);
		transition: transform var(--duration-150) var(--ease-out);
	}

	.module-card:hover .module-arrow {
		transform: translateX(4px);
		color: var(--color-primary-500);
	}

	/* Labs */
	.labs-section {
		margin-bottom: var(--space-8);
	}

	.labs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.labs-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.lab-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: inherit;
		transition: all var(--duration-150) var(--ease-out);
	}

	.lab-card:hover {
		border-color: var(--color-warning-500);
		box-shadow: var(--shadow-md);
		text-decoration: none;
	}

	.lab-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.lab-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-warning-500);
	}

	.lab-difficulty {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.difficulty-beginner {
		background-color: var(--difficulty-beginner-bg);
		color: var(--difficulty-beginner-text);
	}

	.difficulty-intermediate {
		background-color: var(--difficulty-intermediate-bg);
		color: var(--difficulty-intermediate-text);
	}

	.difficulty-advanced {
		background-color: var(--difficulty-advanced-bg);
		color: var(--difficulty-advanced-text);
	}

	.lab-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.lab-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-3) 0;
		flex: 1;
	}

	.lab-meta {
		display: flex;
		gap: var(--space-4);
	}

	/* Deliverable */
	.deliverable-section {
		margin-bottom: var(--space-8);
	}

	.deliverable-card {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-6);
		background: var(--deliverable-card-gradient);
		border: var(--border-width-2) solid var(--deliverable-card-border);
		border-radius: var(--radius-xl);
	}

	.deliverable-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-primary-500);
	}

	.deliverable-content {
		flex: 1;
	}

	.deliverable-label {
		display: block;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--deliverable-label-text);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-1);
	}

	.deliverable-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.deliverable-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* Navigation */
	.phase-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-6);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		transition: all var(--duration-150) var(--ease-out);
	}

	.nav-link:hover {
		color: var(--color-primary-600);
		background-color: var(--color-bg-secondary);
		text-decoration: none;
	}

	.nav-link.overview {
		background-color: var(--color-bg-secondary);
	}
</style>
