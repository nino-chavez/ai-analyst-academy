<script lang="ts">
	// Course schedule data
	const courseInfo = {
		totalHours: 20,
		modules: 16,
		labs: 8,
		format: 'Self-paced',
		prerequisites: 'None - designed for business professionals with no coding experience'
	};

	const phases = [
		{
			id: 1,
			title: 'AI Literacy',
			description: 'Build foundational understanding of how AI systems work and how to communicate with them effectively.',
			estimatedHours: 5,
			modules: [
				{ id: '1.1', title: 'Economics of Intelligence', duration: '45 min', topics: ['Token economics', 'Cost hierarchies', 'Model selection'] },
				{ id: '1.2', title: 'Context and Memory', duration: '45 min', topics: ['Context windows', 'Memory limitations', 'Conversation design'] },
				{ id: '1.3', title: 'Providers and Models', duration: '45 min', topics: ['OpenAI, Anthropic, Google', 'Model capabilities', 'Use case matching'] },
				{ id: '1.4', title: 'Prompting as Management', duration: '45 min', topics: ['Clear instructions', 'Persona design', 'Output formatting'] }
			],
			labs: [
				{ id: 'lab-1', title: 'Persona Stress Test', duration: '1 hour' },
				{ id: 'lab-2', title: 'Chain of Thought Audit', duration: '1 hour' }
			],
			deliverable: 'Prompt Library - A collection of tested, effective prompts for common tasks'
		},
		{
			id: 2,
			title: 'Workflow Engineering',
			description: 'Learn to design AI-augmented workflows with appropriate quality controls and human oversight.',
			estimatedHours: 5,
			modules: [
				{ id: '2.1', title: 'Workflow Decomposition', duration: '45 min', topics: ['Task analysis', 'AI suitability', 'Workflow mapping'] },
				{ id: '2.2', title: 'Quality Gates', duration: '45 min', topics: ['Validation points', 'Error detection', 'Human review'] },
				{ id: '2.3', title: 'Human-AI Collaboration', duration: '45 min', topics: ['Role boundaries', 'Escalation paths', 'Feedback loops'] },
				{ id: '2.4', title: 'Batch Processing', duration: '45 min', topics: ['Parallel execution', 'Rate limiting', 'Error handling'] }
			],
			labs: [
				{ id: 'lab-3', title: 'Workflow Design Challenge', duration: '1.5 hours' },
				{ id: 'lab-4', title: 'Quality Gate Implementation', duration: '1 hour' }
			],
			deliverable: 'Workflow Diagram - A complete AI-augmented workflow for a real business process'
		},
		{
			id: 3,
			title: 'Agentic Orchestration',
			description: 'Design and deploy autonomous AI agents, multi-agent systems, and intelligent workflows that reason and act.',
			estimatedHours: 7,
			modules: [
				{ id: '3.1', title: 'No-Code AI Tools', duration: '45 min', topics: ['Tool landscape', 'Selection criteria', 'Evaluation'] },
				{ id: '3.2', title: 'API Fundamentals', duration: '45 min', topics: ['REST APIs', 'Authentication', 'Webhooks'] },
				{ id: '3.3', title: 'Automation Platforms', duration: '45 min', topics: ['Zapier', 'Make', 'n8n'] },
				{ id: '3.4', title: 'Testing and Deployment', duration: '45 min', topics: ['Testing strategies', 'Monitoring', 'Scaling'] },
				{ id: '3.5', title: 'Customization & Fine-Tuning', duration: '45 min', topics: ['RAG vs Fine-tuning', 'Economics', 'When to customize'] }
			],
			labs: [
				{ id: 'lab-5', title: 'Build an AI Assistant', duration: '1 hour' },
				{ id: 'lab-5b', title: 'Multi-Agent Orchestration', duration: '1.5 hours' }
			],
			deliverable: 'Multi-Agent System - A working system where AI agents collaborate to complete complex tasks'
		},
		{
			id: 4,
			title: 'Strategy & Economics',
			description: 'Master the business side of AI implementation including ROI analysis and organizational adoption.',
			estimatedHours: 5,
			modules: [
				{ id: '4.1', title: 'ROI Analysis', duration: '45 min', topics: ['Cost modeling', 'Value measurement', 'Break-even analysis'] },
				{ id: '4.2', title: 'Risk Management', duration: '45 min', topics: ['AI limitations', 'Failure modes', 'Mitigation strategies'] },
				{ id: '4.3', title: 'Governance Frameworks', duration: '45 min', topics: ['Policies', 'Compliance', 'Ethics'] },
				{ id: '4.4', title: 'Organizational Adoption', duration: '45 min', topics: ['Change management', 'Training', 'Culture'] }
			],
			labs: [
				{ id: 'lab-6', title: 'Business Case Development', duration: '1.5 hours' },
				{ id: 'lab-7', title: 'Governance Policy Draft', duration: '1 hour' }
			],
			deliverable: 'AI Strategy Document - A comprehensive plan for AI adoption in an organization'
		}
	];

	const capstone = {
		title: 'Capstone Project',
		description: 'Apply everything you\'ve learned by designing and implementing a complete AI solution for a real business problem.',
		duration: '4-6 hours',
		components: [
			'Problem analysis and AI suitability assessment',
			'Workflow design with quality gates',
			'Working prototype or detailed specification',
			'ROI projection and risk assessment',
			'Implementation roadmap'
		]
	};
</script>

<svelte:head>
	<title>Syllabus | AI Analyst Academy</title>
	<meta name="description" content="Complete course syllabus for the AI Analyst certification program" />
</svelte:head>

<div class="syllabus-page">
	<header class="page-header">
		<h1 class="page-title">Course Syllabus</h1>
		<p class="page-description">
			Complete curriculum overview for the AI Analyst certification program
		</p>
	</header>

	<!-- Course Overview -->
	<section class="overview-section">
		<h2 class="section-title">Course Overview</h2>
		<div class="overview-grid">
			<div class="overview-card">
				<span class="overview-value">{courseInfo.totalHours}h</span>
				<span class="overview-label">Total Content</span>
			</div>
			<div class="overview-card">
				<span class="overview-value">{courseInfo.modules}</span>
				<span class="overview-label">Modules</span>
			</div>
			<div class="overview-card">
				<span class="overview-value">{courseInfo.labs}</span>
				<span class="overview-label">Hands-on Labs</span>
			</div>
			<div class="overview-card">
				<span class="overview-value">{courseInfo.format}</span>
				<span class="overview-label">Format</span>
			</div>
		</div>
		<div class="prerequisites">
			<strong>Prerequisites:</strong> {courseInfo.prerequisites}
		</div>
	</section>

	<!-- Learning Objectives -->
	<section class="objectives-section">
		<h2 class="section-title">Learning Objectives</h2>
		<p class="section-intro">By the end of this course, you will be able to:</p>
		<ul class="objectives-list">
			<li>Understand AI economics and select appropriate models for different use cases</li>
			<li>Write effective prompts that consistently produce desired outputs</li>
			<li>Design AI-augmented workflows with proper quality controls</li>
			<li>Implement production-ready AI assistants with context management</li>
			<li>Build compelling business cases for AI adoption</li>
			<li>Develop governance frameworks for responsible AI use</li>
		</ul>
	</section>

	<!-- Curriculum -->
	<section class="curriculum-section">
		<h2 class="section-title">Curriculum</h2>

		{#each phases as phase (phase.id)}
			<div class="phase-block phase-{phase.id}">
				<div class="phase-header">
					<div class="phase-badge">Phase {phase.id}</div>
					<h3 class="phase-title">{phase.title}</h3>
					<span class="phase-duration">{phase.estimatedHours} hours</span>
				</div>

				<p class="phase-description">{phase.description}</p>

				<div class="phase-content">
					<div class="modules-section">
						<h4 class="subsection-title">Modules</h4>
						<div class="modules-list">
							{#each phase.modules as module (module.id)}
								<div class="module-item">
									<div class="module-header">
										<span class="module-id">{module.id}</span>
										<span class="module-title">{module.title}</span>
										<span class="module-duration">{module.duration}</span>
									</div>
									<div class="module-topics">
										{#each module.topics as topic, i}
											<span class="topic-tag">{topic}</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>

					<div class="labs-section">
						<h4 class="subsection-title">Labs</h4>
						<div class="labs-list">
							{#each phase.labs as lab (lab.id)}
								<div class="lab-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
									<span class="lab-title">{lab.title}</span>
									<span class="lab-duration">{lab.duration}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="deliverable-section">
						<h4 class="subsection-title">Phase Deliverable</h4>
						<p class="deliverable-text">{phase.deliverable}</p>
					</div>
				</div>
			</div>
		{/each}

		<!-- Capstone -->
		<div class="capstone-block">
			<div class="capstone-header">
				<div class="capstone-badge">Capstone</div>
				<h3 class="capstone-title">{capstone.title}</h3>
				<span class="capstone-duration">{capstone.duration}</span>
			</div>

			<p class="capstone-description">{capstone.description}</p>

			<div class="capstone-components">
				<h4 class="subsection-title">Project Components</h4>
				<ul class="components-list">
					{#each capstone.components as component, i}
						<li>{component}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta-section">
		<h2 class="cta-title">Ready to Get Started?</h2>
		<p class="cta-description">Begin your journey to becoming an AI Analyst today.</p>
		<a href="/learn" class="btn btn-primary">
			Start Learning
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</a>
	</section>
</div>

<style>
	.syllabus-page {
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

	.subsection-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 var(--space-3) 0;
	}

	/* Overview Section */
	.overview-section {
		margin-bottom: var(--space-8);
		padding: var(--space-6);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	@media (min-width: 640px) {
		.overview-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.overview-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg);
	}

	.overview-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary-600);
	}

	.overview-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.prerequisites {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		padding: var(--space-3);
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg);
	}

	/* Objectives Section */
	.objectives-section {
		margin-bottom: var(--space-8);
	}

	.section-intro {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	.objectives-list {
		margin: 0;
		padding-left: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.objectives-list li {
		font-size: var(--text-base);
		color: var(--color-text-primary);
		line-height: var(--leading-relaxed);
	}

	/* Curriculum Section */
	.curriculum-section {
		margin-bottom: var(--space-8);
	}

	.phase-block {
		margin-bottom: var(--space-6);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.phase-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.phase-badge {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		border-radius: var(--radius-md);
	}

	.phase-1 .phase-badge { background-color: var(--color-phase-1); }
	.phase-2 .phase-badge { background-color: var(--color-phase-2); }
	.phase-3 .phase-badge { background-color: var(--color-phase-3); }
	.phase-4 .phase-badge { background-color: var(--color-phase-4); }

	.phase-title {
		flex: 1;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.phase-duration {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.phase-description {
		padding: var(--space-4);
		margin: 0;
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-primary);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.phase-content {
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
	}

	.modules-section,
	.labs-section,
	.deliverable-section {
		margin-bottom: var(--space-4);
	}

	.modules-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.module-item {
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.module-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.module-id {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-text-tertiary);
	}

	.module-title {
		flex: 1;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.module-duration {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.module-topics {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.topic-tag {
		padding: 2px var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.labs-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.lab-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		color: var(--color-text-secondary);
	}

	.lab-title {
		flex: 1;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.lab-duration {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.deliverable-text {
		margin: 0;
		padding: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		background-color: var(--success-subtle-bg);
		border-left: 3px solid var(--color-success-500);
		border-radius: var(--radius-md);
	}

	/* Capstone */
	.capstone-block {
		border: var(--border-width-2) solid var(--color-capstone);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.capstone-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: linear-gradient(135deg, var(--color-capstone-light) 0%, var(--color-bg-primary) 100%);
		border-bottom: var(--border-width) solid var(--color-capstone);
	}

	.capstone-badge {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: white;
		background-color: var(--color-capstone);
		border-radius: var(--radius-md);
	}

	.capstone-title {
		flex: 1;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.capstone-duration {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.capstone-description {
		padding: var(--space-4);
		margin: 0;
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-primary);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.capstone-components {
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
	}

	.components-list {
		margin: 0;
		padding-left: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.components-list li {
		font-size: var(--text-sm);
		color: var(--color-text-primary);
	}

	/* CTA Section */
	.cta-section {
		text-align: center;
		padding: var(--space-8);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
	}

	.cta-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.cta-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
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
</style>
