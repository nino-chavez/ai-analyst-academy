<script lang="ts">
	import { ProgressRing } from '$components';

	// Icon components for cleaner, more professional look
</script>

<svelte:head>
	<title>AI Analyst Academy | Design Human-AI Systems for Business</title>
	<meta
		name="description"
		content="Learn to become an AI Analyst - Design human-AI systems and architect business automation through hands-on training"
	/>
</svelte:head>

<div class="landing-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<div class="hero-badge">
				<svg class="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
					<path d="M6 12v5c3 3 9 3 12 0v-5"/>
				</svg>
				<span class="badge-text">Self-Paced Learning</span>
			</div>
			<h1 class="hero-title">
				Become an <span class="highlight">AI Analyst</span>
			</h1>
			<p class="hero-description">
				Master the skills to design human-AI systems that transform business operations. Learn process decomposition,
				agent orchestration, and strategic AI architecture through hands-on labs and real-world
				projects.
			</p>
			<div class="hero-actions">
				<a href="/learn" class="btn btn-primary">
					Start Learning
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
				<a href="/learn" class="btn btn-secondary">
					View Curriculum
				</a>
			</div>
		</div>
		<div class="hero-visual">
			<div class="stats-card">
				<div class="stat">
					<span class="stat-value">4</span>
					<span class="stat-label">Phases</span>
				</div>
				<div class="stat">
					<span class="stat-value">16</span>
					<span class="stat-label">Modules</span>
				</div>
				<div class="stat">
					<span class="stat-value">8</span>
					<span class="stat-label">Labs</span>
				</div>
				<div class="stat">
					<span class="stat-value">20h</span>
					<span class="stat-label">Content</span>
				</div>
			</div>
		</div>
	</section>

	<!-- What You'll Learn Section -->
	<section class="curriculum-preview">
		<h2 class="section-title">What You'll Learn</h2>
		<p class="section-subtitle">
			A structured path from AI fundamentals to strategic implementation
		</p>

		<div class="phases-grid stagger-children">
			<a href="/learn/phase/1" class="phase-card phase-1 card-interactive animate-slide-up">
				<div class="phase-icon">
					<!-- Brain icon for AI Literacy -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.5"/>
						<path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.5"/>
					</svg>
				</div>
				<div class="phase-number">Phase 1</div>
				<h3 class="phase-title">AI Literacy</h3>
				<p class="phase-description">
					Understand AI economics, context windows, and effective prompting techniques
				</p>
			</a>

			<a href="/learn/phase/2" class="phase-card phase-2 card-interactive animate-slide-up">
				<div class="phase-icon">
					<!-- Workflow/Settings icon -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="6" width="4" height="12" rx="1"/>
						<rect x="10" y="3" width="4" height="18" rx="1"/>
						<rect x="18" y="8" width="4" height="8" rx="1"/>
						<path d="M4 12h6M14 12h4"/>
					</svg>
				</div>
				<div class="phase-number">Phase 2</div>
				<h3 class="phase-title">Workflow Engineering</h3>
				<p class="phase-description">
					Design AI-augmented workflows with quality gates and human oversight
				</p>
			</a>

			<a href="/learn/phase/3" class="phase-card phase-3 card-interactive animate-slide-up">
				<div class="phase-icon">
					<!-- Code/Build icon -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="16 18 22 12 16 6"/>
						<polyline points="8 6 2 12 8 18"/>
						<line x1="12" y1="2" x2="12" y2="22"/>
					</svg>
				</div>
				<div class="phase-number">Phase 3</div>
				<h3 class="phase-title">Agentic Orchestration</h3>
				<p class="phase-description">
					Design and deploy autonomous AI agents and multi-agent systems
				</p>
			</a>

			<a href="/learn/phase/4" class="phase-card phase-4 card-interactive animate-slide-up">
				<div class="phase-icon">
					<!-- Chart/Strategy icon -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<line x1="12" y1="20" x2="12" y2="10"/>
						<line x1="18" y1="20" x2="18" y2="4"/>
						<line x1="6" y1="20" x2="6" y2="14"/>
						<path d="M3 20h18"/>
					</svg>
				</div>
				<div class="phase-number">Phase 4</div>
				<h3 class="phase-title">Strategy & Economics</h3>
				<p class="phase-description">
					Master ROI analysis, governance frameworks, and organizational AI adoption
				</p>
			</a>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features">
		<h2 class="section-title">How It Works</h2>
		<div class="features-grid stagger-children">
			<div class="feature-card animate-slide-up">
				<div class="feature-icon">
					<!-- Book/Curriculum icon -->
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
						<line x1="8" y1="7" x2="16" y2="7"/>
						<line x1="8" y1="11" x2="14" y2="11"/>
					</svg>
				</div>
				<h3 class="feature-title">Structured Curriculum</h3>
				<p class="feature-description">
					16 modules organized in 4 progressive phases, each building on the previous
				</p>
			</div>

			<div class="feature-card animate-slide-up">
				<div class="feature-icon">
					<!-- Flask/Lab icon -->
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 3h6"/>
						<path d="M10 3v6.5l-4.5 7.5a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 9.5V3"/>
						<circle cx="12" cy="16" r="1.5"/>
					</svg>
				</div>
				<h3 class="feature-title">Hands-on Labs</h3>
				<p class="feature-description">
					8 practical labs where you apply concepts to real business scenarios
				</p>
			</div>

			<div class="feature-card animate-slide-up">
				<div class="feature-icon">
					<!-- Target/Deliverable icon -->
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<circle cx="12" cy="12" r="6"/>
						<circle cx="12" cy="12" r="2"/>
					</svg>
				</div>
				<h3 class="feature-title">Phase Deliverables</h3>
				<p class="feature-description">
					Build a portfolio of artifacts: prompt libraries, workflows, and governance docs
				</p>
			</div>

			<div class="feature-card animate-slide-up">
				<div class="feature-icon">
					<!-- Trophy/Award icon -->
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
						<path d="M4 22h16"/>
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
					</svg>
				</div>
				<h3 class="feature-title">Capstone Project</h3>
				<p class="feature-description">
					Demonstrate mastery with a comprehensive AI implementation project
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta">
		<div class="cta-content">
			<h2 class="cta-title">Ready to become an AI Analyst?</h2>
			<p class="cta-description">
				Start your journey today. No prerequisites required - just curiosity and a willingness to
				learn.
			</p>
			<a href="/learn" class="btn btn-primary btn-lg">
				Get Started Free
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="9 18 15 12 9 6" />
				</svg>
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="landing-footer">
		<div class="footer-content">
			<div class="footer-brand">
				<span class="footer-logo">AI Analyst Academy</span>
				<p class="footer-tagline">Design human-AI systems that transform business.</p>
			</div>
			<div class="footer-links">
				<a href="/syllabus">Syllabus</a>
				<a href="/legal/terms">Terms of Service</a>
				<a href="/legal/privacy">Privacy Policy</a>
			</div>
			<p class="footer-copyright">&copy; {new Date().getFullYear()} AI Analyst Academy. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
	.landing-page {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Hero Section */
	.hero {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		padding: var(--space-12) 0;
		min-height: 60vh;
		align-items: center;
	}

	@media (min-width: 768px) {
		.hero {
			grid-template-columns: 1fr 1fr;
		}
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background-color: var(--badge-primary-bg);
		color: var(--badge-primary-text);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		margin-bottom: var(--space-4);
	}

	.badge-icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.hero-title {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: var(--text-5xl);
		}
	}

	.highlight {
		background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0 0 var(--space-6) 0;
		max-width: 540px;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		text-decoration: none;
		transition: all var(--duration-150) var(--ease-out);
		cursor: pointer;
		border: none;
	}

	.btn-primary {
		background-color: var(--color-primary-500);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--color-primary-600);
		transform: translateY(-1px);
		box-shadow: var(--shadow-primary);
		text-decoration: none;
	}

	.btn-primary:active {
		transform: translateY(0);
		box-shadow: none;
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

	.btn-lg {
		padding: var(--space-4) var(--space-8);
		font-size: var(--text-lg);
	}

	/* Hero Visual */
	.hero-visual {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stats-card {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		padding: var(--space-6);
		background: var(--stats-card-gradient);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-lg);
	}

	.stats-card .stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-4);
	}

	.stats-card .stat-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-primary-500);
	}

	.stats-card .stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Section Styles */
	.section-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		text-align: center;
		margin: 0 0 var(--space-2) 0;
	}

	.section-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		text-align: center;
		margin: 0 0 var(--space-8) 0;
	}

	/* Curriculum Preview */
	.curriculum-preview {
		padding: var(--space-12) 0;
	}

	.phases-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.phases-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.phases-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.phase-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-5);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		text-decoration: none;
		color: inherit;
		transition: all var(--duration-200) var(--ease-out);
	}

	.phase-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
		text-decoration: none;
	}

	.phase-1:hover {
		border-color: var(--color-phase-1);
	}
	.phase-2:hover {
		border-color: var(--color-phase-2);
	}
	.phase-3:hover {
		border-color: var(--color-phase-3);
	}
	.phase-4:hover {
		border-color: var(--color-phase-4);
	}

	.phase-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: var(--space-3);
		color: var(--phase-color, var(--color-primary-500));
		background-color: var(--phase-color-light, var(--color-primary-50));
		border-radius: var(--radius-lg);
	}

	.phase-1 .phase-icon {
		color: var(--color-phase-1);
		background-color: var(--color-phase-1-light);
	}

	.phase-2 .phase-icon {
		color: var(--color-phase-2);
		background-color: var(--color-phase-2-light);
	}

	.phase-3 .phase-icon {
		color: var(--color-phase-3);
		background-color: var(--color-phase-3-light);
	}

	.phase-4 .phase-icon {
		color: var(--color-phase-4);
		background-color: var(--color-phase-4-light);
	}

	.phase-number {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-1);
	}

	.phase-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.phase-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* Features */
	.features {
		padding: var(--space-12) 0;
		background-color: var(--color-bg-secondary);
		margin: 0 calc(-1 * var(--space-6));
		padding-left: var(--space-6);
		padding-right: var(--space-6);
	}

	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
		max-width: var(--container-lg);
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.features-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.feature-card {
		text-align: center;
		padding: var(--space-6);
	}

	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		margin: 0 auto var(--space-4) auto;
		color: var(--color-primary-600);
		background-color: var(--color-primary-100);
		border-radius: var(--radius-xl);
	}

	.feature-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.feature-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* CTA */
	.cta {
		padding: var(--space-16) 0;
		text-align: center;
	}

	.cta-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.cta-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.cta-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
	}

	/* Footer */
	.landing-footer {
		margin-top: var(--space-12);
		padding: var(--space-8) 0;
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.footer-content {
		text-align: center;
	}

	.footer-brand {
		margin-bottom: var(--space-4);
	}

	.footer-logo {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
	}

	.footer-tagline {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin: var(--space-1) 0 0 0;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		gap: var(--space-6);
		margin-bottom: var(--space-4);
	}

	.footer-links a {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--duration-150) var(--ease-out);
	}

	.footer-links a:hover {
		color: var(--color-primary-500);
	}

	.footer-copyright {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin: 0;
	}

</style>
