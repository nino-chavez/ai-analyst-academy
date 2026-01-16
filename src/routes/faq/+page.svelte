<script lang="ts">
	import {
		generateFAQSchema,
		generateWebPageSchema,
		serializeSchema,
		generateMetaTags
	} from '$lib/seo';

	// FAQ data - structured for both display and schema generation
	const faqs = [
		{
			category: 'About the Course',
			questions: [
				{
					question: 'What is an AI Analyst?',
					answer:
						'An AI Analyst is a professional who designs human-AI systems for business operations. They bridge the gap between technical AI capabilities and business needs, focusing on workflow automation, process optimization, and strategic AI implementation without needing to write code.'
				},
				{
					question: 'Who is this course designed for?',
					answer:
						'This course is designed for business professionals, operations managers, consultants, and anyone who wants to leverage AI tools effectively in their work. No coding experience is required. The curriculum assumes familiarity with basic business concepts but teaches all AI fundamentals from scratch.'
				},
				{
					question: 'How long does it take to complete the curriculum?',
					answer:
						'The full curriculum consists of 6 phases with 24 modules and 12 hands-on labs, totaling approximately 35-45 hours of content. Most learners complete it in 4-8 weeks depending on their pace and available time. The self-paced format allows you to learn on your own schedule.'
				},
				{
					question: 'Is there a certificate upon completion?',
					answer:
						'Yes, upon completing all modules, labs, and the capstone project, you receive an AI Analyst certification. This demonstrates your ability to design and implement AI-augmented workflows, conduct ROI analysis, and lead AI initiatives in organizations.'
				}
			]
		},
		{
			category: 'Curriculum & Content',
			questions: [
				{
					question: 'What topics does the curriculum cover?',
					answer:
						'The curriculum covers six phases: (1) AI Literacy - understanding AI economics and prompting, (2) Workflow Engineering - designing AI-augmented processes, (3) Agentic Orchestration - building AI agents and automation, (4) Strategy & Economics - ROI analysis and governance, (5) AI Leadership - stakeholder management and team building, and (6) Enterprise Architecture - scaling AI across organizations.'
				},
				{
					question: 'Do I need to know programming or coding?',
					answer:
						'No programming knowledge is required. The course focuses on no-code and low-code approaches to AI implementation. You will learn to use tools like ChatGPT, Claude, automation platforms (Zapier, Make), and AI assistants without writing code. Technical concepts are explained in business-friendly terms.'
				},
				{
					question: 'What are the hands-on labs like?',
					answer:
						'Labs are practical exercises where you apply concepts to realistic business scenarios. Examples include: stress-testing AI personas, designing workflow diagrams, building AI assistants, calculating ROI for AI projects, and creating governance frameworks. Each lab produces a portfolio artifact you can use in your work.'
				},
				{
					question: 'What is the capstone project?',
					answer:
						'The capstone project is a comprehensive final project where you design and document an AI implementation for a real or realistic business scenario. You will apply skills from all six phases to create a complete proposal including workflow designs, agent specifications, ROI analysis, and implementation roadmap.'
				}
			]
		},
		{
			category: 'Learning Format',
			questions: [
				{
					question: 'Is this course self-paced or scheduled?',
					answer:
						'The course is entirely self-paced. You can start anytime, learn at your own speed, and revisit materials as needed. There are no deadlines or scheduled sessions. Progress is automatically tracked so you can pick up where you left off.'
				},
				{
					question: 'Can I access the course on mobile devices?',
					answer:
						'Yes, the platform is fully responsive and works on smartphones, tablets, and desktop computers. However, for hands-on labs and exercises involving AI tools, a laptop or desktop is recommended for the best experience.'
				},
				{
					question: 'How is progress tracked?',
					answer:
						'Your progress is automatically saved as you complete modules, exercises, and labs. The dashboard shows your completion percentage for each phase, concepts mastered, and exercises completed. You can also track your portfolio of deliverables built throughout the course.'
				}
			]
		},
		{
			category: 'Practical Application',
			questions: [
				{
					question: 'Can I apply what I learn to my current job?',
					answer:
						'Absolutely. The curriculum is designed for immediate practical application. Each module includes exercises based on real business scenarios. Many learners begin implementing AI workflows in their organizations while still taking the course. The portfolio you build contains artifacts directly usable in your work.'
				},
				{
					question: 'What AI tools will I learn to use?',
					answer:
						'You will work with major AI platforms including ChatGPT, Claude, and Google Gemini. You will also learn automation tools like Zapier and Make, API basics for connecting services, and evaluation frameworks for selecting the right AI tools for specific use cases.'
				},
				{
					question: 'What kind of portfolio will I build?',
					answer:
						'Throughout the course, you build a professional portfolio including: a prompt library, workflow diagrams, AI agent specifications, ROI analysis templates, governance frameworks, change management plans, and a complete capstone implementation proposal. These artifacts demonstrate your skills to employers or clients.'
				}
			]
		},
		{
			category: 'Getting Started',
			questions: [
				{
					question: 'How do I get started?',
					answer:
						'Simply create a free account and begin with Phase 1: AI Literacy. No credit card or payment is required to start learning. The first modules introduce fundamental concepts that provide the foundation for everything that follows.'
				},
				{
					question: 'Is the course free?',
					answer:
						'Yes, the core curriculum is free to access. All 24 modules, 12 labs, and the capstone project are available at no cost. This allows anyone interested in AI to develop practical skills regardless of budget.'
				},
				{
					question: 'Do I need any special software or subscriptions?',
					answer:
						'For the core curriculum, you only need a web browser. For hands-on practice with AI tools, free tiers of ChatGPT, Claude, and automation platforms are sufficient. The course teaches you how to maximize value from free AI tools before considering paid upgrades.'
				}
			]
		}
	];

	// Flatten FAQs for schema
	const allFaqs = faqs.flatMap((category) =>
		category.questions.map((q) => ({
			question: q.question,
			answer: q.answer
		}))
	);

	// Generate SEO data
	const meta = generateMetaTags({
		title: 'Frequently Asked Questions',
		description:
			'Find answers to common questions about the AI Analyst Academy curriculum, learning format, prerequisites, and career outcomes.',
		path: '/faq',
		image: '/og/faq.png',
		type: 'website',
		keywords: [
			'AI Analyst FAQ',
			'AI training questions',
			'AI course FAQ',
			'AI certification questions',
			'learn AI FAQ'
		]
	});

	const faqSchema = generateFAQSchema(allFaqs);
	const pageSchema = generateWebPageSchema(
		'AI Analyst Academy - Frequently Asked Questions',
		meta.description,
		'/faq',
		'WebPage'
	);

	// Track expanded state for accordion
	let expandedItems = $state<Set<string>>(new Set());

	function toggleItem(id: string) {
		const next = new Set(expandedItems);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedItems = next;
	}

	function getItemId(categoryIndex: number, questionIndex: number): string {
		return `${categoryIndex}-${questionIndex}`;
	}
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta name="author" content={meta.author} />
	{#if meta.keywords}
		<meta name="keywords" content={meta.keywords.join(', ')} />
	{/if}
	<meta name="robots" content={meta.robots} />
	<link rel="canonical" href={meta.canonical} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={meta.ogType} />
	<meta property="og:url" content={meta.canonical} />
	<meta property="og:title" content={meta.ogTitle} />
	<meta property="og:description" content={meta.ogDescription} />
	<meta property="og:image" content={meta.ogImage} />
	<meta property="og:site_name" content="AI Analyst Academy" />

	<!-- Twitter -->
	<meta name="twitter:card" content={meta.twitterCard} />
	<meta name="twitter:url" content={meta.canonical} />
	<meta name="twitter:title" content={meta.twitterTitle} />
	<meta name="twitter:description" content={meta.twitterDescription} />
	<meta name="twitter:image" content={meta.twitterImage} />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${serializeSchema(faqSchema)}</script>`}
	{@html `<script type="application/ld+json">${serializeSchema(pageSchema)}</script>`}
</svelte:head>

<div class="faq-page">
	<header class="page-header">
		<h1 class="page-title">Frequently Asked Questions</h1>
		<p class="page-description">
			Everything you need to know about the AI Analyst Academy curriculum, learning format, and what
			to expect.
		</p>
	</header>

	<div class="faq-content">
		{#each faqs as category, categoryIndex}
			<section class="faq-category">
				<h2 class="category-title">{category.category}</h2>

				<div class="questions-list">
					{#each category.questions as item, questionIndex}
						{@const itemId = getItemId(categoryIndex, questionIndex)}
						{@const isExpanded = expandedItems.has(itemId)}

						<div class="faq-item" class:expanded={isExpanded}>
							<button
								class="faq-question"
								onclick={() => toggleItem(itemId)}
								aria-expanded={isExpanded}
								aria-controls="answer-{itemId}"
							>
								<span class="question-text">{item.question}</span>
								<svg
									class="chevron"
									class:rotated={isExpanded}
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</button>

							{#if isExpanded}
								<div class="faq-answer" id="answer-{itemId}">
									<p>{item.answer}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<section class="cta-section">
		<h2 class="cta-title">Ready to get started?</h2>
		<p class="cta-description">
			Begin your journey to becoming an AI Analyst today. No prerequisites required.
		</p>
		<a href="/learn" class="btn btn-primary">Start Learning</a>
	</section>
</div>

<style>
	.faq-page {
		max-width: var(--container-lg);
		margin: 0 auto;
		padding: var(--space-6);
	}

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
		margin: 0 auto;
		line-height: var(--leading-relaxed);
	}

	.faq-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
	}

	.faq-category {
		margin-bottom: var(--space-2);
	}

	.category-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width-2) solid var(--color-primary-500);
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.faq-item {
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: border-color var(--duration-150) var(--ease-out);
	}

	.faq-item:hover {
		border-color: var(--color-border-secondary);
	}

	.faq-item.expanded {
		border-color: var(--color-primary-500);
	}

	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: var(--space-4);
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.faq-question:hover {
		background-color: var(--color-bg-tertiary);
	}

	.faq-question:focus {
		outline: none;
		background-color: var(--color-bg-tertiary);
	}

	.faq-question:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: -2px;
	}

	.question-text {
		flex: 1;
		padding-right: var(--space-4);
	}

	.chevron {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
		transition: transform var(--duration-200) var(--ease-out);
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.faq-answer {
		padding: 0 var(--space-4) var(--space-4) var(--space-4);
		animation: slideDown var(--duration-200) var(--ease-out);
	}

	.faq-answer p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* CTA Section */
	.cta-section {
		margin-top: var(--space-16);
		padding: var(--space-10);
		background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-bg-secondary) 100%);
		border-radius: var(--radius-xl);
		text-align: center;
	}

	:global([data-theme='dark']) .cta-section {
		background: linear-gradient(
			135deg,
			var(--color-primary-950) 0%,
			var(--color-bg-secondary) 100%
		);
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
</style>
