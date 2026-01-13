<script lang="ts">
	import { ProgressRing, ProgressBar } from '$components';

	interface PhaseData {
		id: string;
		title: string;
		description: string;
		order: number;
		color: string;
		icon: string;
		estimatedHours: number;
		moduleCount: number;
		labCount: number;
		deliverable: {
			title: string;
			description: string;
		};
	}

	interface Props {
		data: {
			phases: PhaseData[];
			capstone: {
				id: string;
				title: string;
				slug: string;
				estimatedHours?: number;
			};
			stats: {
				totalPhases: number;
				totalModules: number;
				totalLabs: number;
				totalEstimatedHours: number;
			};
		};
	}

	let { data }: Props = $props();

	function getPhaseColor(order: number): string {
		return `var(--color-phase-${order})`;
	}

	function getPhaseGradient(order: number): string {
		return `linear-gradient(135deg, var(--color-phase-${order}) 0%, var(--color-phase-${order}-dark) 100%)`;
	}

	// TODO: Load actual progress from Supabase
	const phaseProgress: Record<string, number> = {};
</script>

<svelte:head>
	<title>Learn | AI Analyst Academy</title>
	<meta
		name="description"
		content="Master AI tools and workflows through our structured curriculum"
	/>
</svelte:head>

<div class="learn-page">
	<!-- Hero Section -->
	<header class="page-header">
		<h1 class="page-title">AI Analyst Curriculum</h1>
		<p class="page-description">
			Master the skills to become an AI Analyst through {data.stats.totalModules} modules, {data.stats.totalLabs}
			hands-on labs, and a capstone project.
		</p>

		<!-- Stats -->
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalPhases}</span>
				<span class="stat-label">Phases</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalModules}</span>
				<span class="stat-label">Modules</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalLabs}</span>
				<span class="stat-label">Labs</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{data.stats.totalEstimatedHours}h</span>
				<span class="stat-label">Total Time</span>
			</div>
		</div>
	</header>

	<!-- Phases Grid -->
	<section class="phases-section">
		<h2 class="section-title">Learning Path</h2>

		<div class="phases-grid">
			{#each data.phases as phase (phase.id)}
				<a href="/learn/phase/{phase.order}" class="phase-card phase-{phase.order}">
					<div class="phase-header" style="background: {getPhaseGradient(phase.order)}">
						<span class="phase-number">Phase {phase.order}</span>
						<span class="phase-icon">{phase.icon}</span>
					</div>

					<div class="phase-body">
						<h3 class="phase-title">{phase.title}</h3>
						<p class="phase-description">{phase.description}</p>

						<div class="phase-meta">
							<span class="meta-item">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
									<polyline points="14 2 14 8 20 8" />
								</svg>
								{phase.moduleCount} modules
							</span>
							<span class="meta-item">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
								{phase.labCount} labs
							</span>
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
								{phase.estimatedHours}h
							</span>
						</div>

						{#if phaseProgress[phase.id] !== undefined}
							<div class="phase-progress">
								<ProgressBar
									value={phaseProgress[phase.id]}
									size="sm"
									color={getPhaseColor(phase.order)}
								/>
							</div>
						{/if}
					</div>

					<div class="phase-footer">
						<div class="deliverable">
							<span class="deliverable-label">Deliverable</span>
							<span class="deliverable-title">{phase.deliverable.title}</span>
						</div>
						<svg
							class="arrow-icon"
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

	<!-- Capstone Section -->
	<section class="capstone-section">
		<a href="/learn/lab/{data.capstone.slug}" class="capstone-card">
			<div class="capstone-badge">
				<span class="badge-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
						<path d="M4 22h16" />
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
					</svg>
				</span>
				<span class="badge-text">Capstone Project</span>
			</div>

			<h3 class="capstone-title">{data.capstone.title}</h3>

			<p class="capstone-description">
				Apply everything you've learned in a comprehensive project that demonstrates your AI
				Operator skills.
			</p>

			{#if data.capstone.estimatedHours}
				<div class="capstone-meta">
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
						{data.capstone.estimatedHours} hours
					</span>
				</div>
			{/if}

			<span class="capstone-cta">
				Start Capstone
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
			</span>
		</a>
	</section>
</div>

<style>
	.learn-page {
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	/* Page Header */
	.page-header {
		text-align: center;
		margin-bottom: var(--space-12);
	}

	.page-title {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.page-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		max-width: 600px;
		margin: 0 auto var(--space-8) auto;
		line-height: var(--leading-relaxed);
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		max-width: 500px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
			max-width: 600px;
		}
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary-600);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Section Title */
	.section-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-6) 0;
	}

	/* Phases Grid */
	.phases-section {
		margin-bottom: var(--space-12);
	}

	.phases-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 768px) {
		.phases-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Phase Card */
	.phase-card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: all var(--duration-200) var(--ease-out);
	}

	.phase-card:hover {
		border-color: var(--phase-color, var(--color-border-primary));
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
		text-decoration: none;
	}

	.phase-1 {
		--phase-color: var(--color-phase-1);
	}
	.phase-2 {
		--phase-color: var(--color-phase-2);
	}
	.phase-3 {
		--phase-color: var(--color-phase-3);
	}
	.phase-4 {
		--phase-color: var(--color-phase-4);
	}

	.phase-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		color: white;
	}

	.phase-number {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.9;
	}

	.phase-icon {
		font-size: var(--text-2xl);
	}

	.phase-body {
		flex: 1;
		padding: var(--space-4);
	}

	.phase-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.phase-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-4) 0;
	}

	.phase-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.phase-progress {
		margin-top: var(--space-4);
	}

	.phase-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-bg-secondary);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.deliverable {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.deliverable-label {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.deliverable-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
	}

	.arrow-icon {
		color: var(--color-text-tertiary);
		transition: transform var(--duration-150) var(--ease-out);
	}

	.phase-card:hover .arrow-icon {
		transform: translateX(4px);
		color: var(--phase-color);
	}

	/* Capstone Section */
	.capstone-section {
		margin-bottom: var(--space-12);
	}

	.capstone-card {
		display: block;
		background: linear-gradient(135deg, var(--color-capstone-light) 0%, var(--color-bg-primary) 100%);
		border: var(--border-width-2) solid var(--color-capstone);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		text-decoration: none;
		color: inherit;
		text-align: center;
		transition: all var(--duration-200) var(--ease-out);
	}

	.capstone-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
		text-decoration: none;
	}

	.capstone-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background-color: var(--color-capstone);
		color: white;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-4);
	}

	.badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.capstone-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.capstone-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		max-width: 500px;
		margin: 0 auto var(--space-4) auto;
		line-height: var(--leading-relaxed);
	}

	.capstone-meta {
		display: flex;
		justify-content: center;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.capstone-cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-capstone-dark);
	}

	.capstone-card:hover .capstone-cta {
		gap: var(--space-3);
	}
</style>
