<script lang="ts">
	import { getContext } from 'svelte';

	const themeContext = getContext<{
		current: 'light' | 'dark' | 'system';
		set: (theme: 'light' | 'dark' | 'system') => void;
		cycle: () => void;
	}>('theme');

	// Color palettes for display
	const neutralColors = [
		{ name: '50', var: '--color-neutral-50' },
		{ name: '100', var: '--color-neutral-100' },
		{ name: '200', var: '--color-neutral-200' },
		{ name: '300', var: '--color-neutral-300' },
		{ name: '400', var: '--color-neutral-400' },
		{ name: '500', var: '--color-neutral-500' },
		{ name: '600', var: '--color-neutral-600' },
		{ name: '700', var: '--color-neutral-700' },
		{ name: '800', var: '--color-neutral-800' },
		{ name: '900', var: '--color-neutral-900' },
		{ name: '950', var: '--color-neutral-950' }
	];

	const primaryColors = [
		{ name: '50', var: '--color-primary-50' },
		{ name: '100', var: '--color-primary-100' },
		{ name: '200', var: '--color-primary-200' },
		{ name: '300', var: '--color-primary-300' },
		{ name: '400', var: '--color-primary-400' },
		{ name: '500', var: '--color-primary-500' },
		{ name: '600', var: '--color-primary-600' },
		{ name: '700', var: '--color-primary-700' },
		{ name: '800', var: '--color-primary-800' },
		{ name: '900', var: '--color-primary-900' }
	];

	const secondaryColors = [
		{ name: '50', var: '--color-secondary-50' },
		{ name: '100', var: '--color-secondary-100' },
		{ name: '200', var: '--color-secondary-200' },
		{ name: '300', var: '--color-secondary-300' },
		{ name: '400', var: '--color-secondary-400' },
		{ name: '500', var: '--color-secondary-500' },
		{ name: '600', var: '--color-secondary-600' },
		{ name: '700', var: '--color-secondary-700' },
		{ name: '800', var: '--color-secondary-800' },
		{ name: '900', var: '--color-secondary-900' }
	];

	const semanticColors = [
		{
			name: 'Success',
			colors: [
				{ name: '50', var: '--color-success-50' },
				{ name: '100', var: '--color-success-100' },
				{ name: '200', var: '--color-success-200' },
				{ name: '500', var: '--color-success-500' },
				{ name: '600', var: '--color-success-600' },
				{ name: '700', var: '--color-success-700' }
			]
		},
		{
			name: 'Warning',
			colors: [
				{ name: '50', var: '--color-warning-50' },
				{ name: '100', var: '--color-warning-100' },
				{ name: '200', var: '--color-warning-200' },
				{ name: '500', var: '--color-warning-500' },
				{ name: '600', var: '--color-warning-600' },
				{ name: '700', var: '--color-warning-700' }
			]
		},
		{
			name: 'Error',
			colors: [
				{ name: '50', var: '--color-error-50' },
				{ name: '100', var: '--color-error-100' },
				{ name: '200', var: '--color-error-200' },
				{ name: '500', var: '--color-error-500' },
				{ name: '600', var: '--color-error-600' },
				{ name: '700', var: '--color-error-700' }
			]
		},
		{
			name: 'Info',
			colors: [
				{ name: '50', var: '--color-info-50' },
				{ name: '100', var: '--color-info-100' },
				{ name: '200', var: '--color-info-200' },
				{ name: '500', var: '--color-info-500' },
				{ name: '600', var: '--color-info-600' },
				{ name: '700', var: '--color-info-700' }
			]
		}
	];

	const phaseColors = [
		{ name: 'Phase 1', var: '--color-phase-1', lightVar: '--color-phase-1-light' },
		{ name: 'Phase 2', var: '--color-phase-2', lightVar: '--color-phase-2-light' },
		{ name: 'Phase 3', var: '--color-phase-3', lightVar: '--color-phase-3-light' },
		{ name: 'Phase 4', var: '--color-phase-4', lightVar: '--color-phase-4-light' },
		{ name: 'Capstone', var: '--color-capstone', lightVar: '--color-capstone-light' }
	];

	const typographyScale = [
		{ name: 'text-xs', size: '0.75rem', class: 'text-xs' },
		{ name: 'text-sm', size: '0.875rem', class: 'text-sm' },
		{ name: 'text-base', size: '1rem', class: 'text-base' },
		{ name: 'text-lg', size: '1.125rem', class: 'text-lg' },
		{ name: 'text-xl', size: '1.25rem', class: 'text-xl' },
		{ name: 'text-2xl', size: '1.5rem', class: 'text-2xl' },
		{ name: 'text-3xl', size: '1.875rem', class: 'text-3xl' },
		{ name: 'text-4xl', size: '2.25rem', class: 'text-4xl' },
		{ name: 'text-5xl', size: '3rem', class: 'text-5xl' }
	];

	const spacingScale = [
		{ name: 'space-1', value: '0.25rem', pixels: '4px' },
		{ name: 'space-2', value: '0.5rem', pixels: '8px' },
		{ name: 'space-3', value: '0.75rem', pixels: '12px' },
		{ name: 'space-4', value: '1rem', pixels: '16px' },
		{ name: 'space-5', value: '1.25rem', pixels: '20px' },
		{ name: 'space-6', value: '1.5rem', pixels: '24px' },
		{ name: 'space-8', value: '2rem', pixels: '32px' },
		{ name: 'space-10', value: '2.5rem', pixels: '40px' },
		{ name: 'space-12', value: '3rem', pixels: '48px' },
		{ name: 'space-16', value: '4rem', pixels: '64px' }
	];

	const radiusScale = [
		{ name: 'radius-sm', value: '0.25rem' },
		{ name: 'radius-md', value: '0.375rem' },
		{ name: 'radius-lg', value: '0.5rem' },
		{ name: 'radius-xl', value: '0.75rem' },
		{ name: 'radius-2xl', value: '1rem' },
		{ name: 'radius-full', value: '9999px' }
	];

	const shadows = [
		{ name: 'shadow-sm', desc: 'Subtle' },
		{ name: 'shadow', desc: 'Default' },
		{ name: 'shadow-md', desc: 'Medium' },
		{ name: 'shadow-lg', desc: 'Large' },
		{ name: 'shadow-xl', desc: 'Extra Large' }
	];

	// Navigation state
	let activeSection = $state('colors');
	const sections = [
		{ id: 'colors', label: 'Colors' },
		{ id: 'typography', label: 'Typography' },
		{ id: 'spacing', label: 'Spacing' },
		{ id: 'components', label: 'Components' },
		{ id: 'animations', label: 'Animations' }
	];
</script>

<svelte:head>
	<title>Style Guide | AI Analyst Academy</title>
</svelte:head>

<div class="style-guide">
	<!-- Header -->
	<header class="header">
		<div class="header-content">
			<div class="header-title">
				<h1>AI Analyst Academy</h1>
				<span class="badge">Style Guide</span>
			</div>
			<div class="header-actions">
				<button class="theme-toggle" onclick={themeContext.cycle}>
					{#if themeContext.current === 'light'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="5"/>
							<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
						</svg>
						Light
					{:else if themeContext.current === 'dark'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
						</svg>
						Dark
					{:else}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
							<path d="M8 21h8M12 17v4"/>
						</svg>
						System
					{/if}
				</button>
				<a href="/" class="back-link">Back to App</a>
			</div>
		</div>
	</header>

	<!-- Navigation -->
	<nav class="nav">
		{#each sections as section}
			<button
				class="nav-item"
				class:active={activeSection === section.id}
				onclick={() => (activeSection = section.id)}
			>
				{section.label}
			</button>
		{/each}
	</nav>

	<!-- Main Content -->
	<main class="main">
		<!-- Colors Section -->
		{#if activeSection === 'colors'}
			<section class="section animate-fade-in">
				<h2 class="section-title">Color System</h2>
				<p class="section-description">
					Our color palette is designed for accessibility and visual hierarchy. All colors have
					light and dark mode variants.
				</p>

				<!-- Neutral Colors -->
				<div class="subsection">
					<h3>Neutral Scale</h3>
					<p class="subsection-description">
						Used for text, backgrounds, and borders. Provides the foundational grayscale.
					</p>
					<div class="color-grid">
						{#each neutralColors as color}
							<div class="color-swatch">
								<div
									class="swatch"
									style="background-color: var({color.var})"
								></div>
								<div class="swatch-label">
									<span class="swatch-name">{color.name}</span>
									<code class="swatch-var">{color.var}</code>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Primary Colors -->
				<div class="subsection">
					<h3>Primary (Blue)</h3>
					<p class="subsection-description">
						Used for learning, progress indicators, and primary actions.
					</p>
					<div class="color-grid">
						{#each primaryColors as color}
							<div class="color-swatch">
								<div
									class="swatch"
									style="background-color: var({color.var})"
								></div>
								<div class="swatch-label">
									<span class="swatch-name">{color.name}</span>
									<code class="swatch-var">{color.var}</code>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Secondary Colors -->
				<div class="subsection">
					<h3>Secondary (Indigo)</h3>
					<p class="subsection-description">
						Used for engagement elements and secondary actions.
					</p>
					<div class="color-grid">
						{#each secondaryColors as color}
							<div class="color-swatch">
								<div
									class="swatch"
									style="background-color: var({color.var})"
								></div>
								<div class="swatch-label">
									<span class="swatch-name">{color.name}</span>
									<code class="swatch-var">{color.var}</code>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Semantic Colors -->
				<div class="subsection">
					<h3>Semantic Colors</h3>
					<p class="subsection-description">
						Status and feedback colors for success, warning, error, and info states.
					</p>
					{#each semanticColors as group}
						<div class="semantic-group">
							<h4>{group.name}</h4>
							<div class="color-grid compact">
								{#each group.colors as color}
									<div class="color-swatch small">
										<div
											class="swatch"
											style="background-color: var({color.var})"
										></div>
										<span class="swatch-name">{color.name}</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<!-- Phase Colors -->
				<div class="subsection">
					<h3>Phase Colors</h3>
					<p class="subsection-description">
						Distinct colors for each curriculum phase, providing visual navigation cues.
					</p>
					<div class="phase-grid">
						{#each phaseColors as phase}
							<div class="phase-swatch">
								<div class="phase-colors">
									<div
										class="swatch phase-main"
										style="background-color: var({phase.var})"
									></div>
									<div
										class="swatch phase-light"
										style="background-color: var({phase.lightVar})"
									></div>
								</div>
								<span class="phase-name">{phase.name}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Theme Colors -->
				<div class="subsection">
					<h3>Theme-Aware Colors</h3>
					<p class="subsection-description">
						These colors automatically adapt to light/dark mode.
					</p>
					<div class="theme-colors-grid">
						<div class="theme-color">
							<div class="swatch" style="background-color: var(--color-bg-primary)"></div>
							<span>bg-primary</span>
						</div>
						<div class="theme-color">
							<div class="swatch" style="background-color: var(--color-bg-secondary)"></div>
							<span>bg-secondary</span>
						</div>
						<div class="theme-color">
							<div class="swatch" style="background-color: var(--color-bg-tertiary)"></div>
							<span>bg-tertiary</span>
						</div>
						<div class="theme-color">
							<div class="swatch text-swatch" style="background-color: var(--color-bg-secondary)">
								<span style="color: var(--color-text-primary)">Aa</span>
							</div>
							<span>text-primary</span>
						</div>
						<div class="theme-color">
							<div class="swatch text-swatch" style="background-color: var(--color-bg-secondary)">
								<span style="color: var(--color-text-secondary)">Aa</span>
							</div>
							<span>text-secondary</span>
						</div>
						<div class="theme-color">
							<div class="swatch text-swatch" style="background-color: var(--color-bg-secondary)">
								<span style="color: var(--color-text-tertiary)">Aa</span>
							</div>
							<span>text-tertiary</span>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- Typography Section -->
		{#if activeSection === 'typography'}
			<section class="section animate-fade-in">
				<h2 class="section-title">Typography</h2>
				<p class="section-description">
					Inter for body text, JetBrains Mono for code. Optimized for learning content readability.
				</p>

				<!-- Font Families -->
				<div class="subsection">
					<h3>Font Families</h3>
					<div class="font-family-demo">
						<div class="font-demo">
							<span class="font-label">Sans (Inter)</span>
							<p class="font-sans-demo">
								The quick brown fox jumps over the lazy dog. 0123456789
							</p>
						</div>
						<div class="font-demo">
							<span class="font-label">Mono (JetBrains Mono)</span>
							<p class="font-mono-demo">
								const learn = (module) => console.log(module);
							</p>
						</div>
					</div>
				</div>

				<!-- Type Scale -->
				<div class="subsection">
					<h3>Type Scale</h3>
					<div class="type-scale">
						{#each typographyScale as type}
							<div class="type-row">
								<div class="type-meta">
									<code>{type.name}</code>
									<span class="type-size">{type.size}</span>
								</div>
								<p class="type-sample" style="font-size: var(--{type.name})">
									AI Analyst Academy
								</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Font Weights -->
				<div class="subsection">
					<h3>Font Weights</h3>
					<div class="weight-demos">
						<p style="font-weight: var(--font-normal)">Normal (400) - Body text and paragraphs</p>
						<p style="font-weight: var(--font-medium)">Medium (500) - Labels and UI elements</p>
						<p style="font-weight: var(--font-semibold)">Semibold (600) - Headings and emphasis</p>
						<p style="font-weight: var(--font-bold)">Bold (700) - Strong emphasis</p>
					</div>
				</div>

				<!-- Typography Classes -->
				<div class="subsection">
					<h3>Typography Utilities</h3>
					<div class="typography-classes">
						<div class="type-class-demo">
							<code>.heading-1</code>
							<p class="heading-1">Module: Understanding Token Economics</p>
						</div>
						<div class="type-class-demo">
							<code>.heading-2</code>
							<p class="heading-2">Phase 1: AI Literacy</p>
						</div>
						<div class="type-class-demo">
							<code>.heading-3</code>
							<p class="heading-3">What Are Tokens?</p>
						</div>
						<div class="type-class-demo">
							<code>.heading-4</code>
							<p class="heading-4">Key Concept</p>
						</div>
						<div class="type-class-demo">
							<code>.body-large</code>
							<p class="body-large">
								This is body-large text, ideal for introductions and key paragraphs that need emphasis.
							</p>
						</div>
						<div class="type-class-demo">
							<code>.body</code>
							<p class="body">
								This is standard body text used throughout the curriculum content. It's optimized for readability with comfortable line height.
							</p>
						</div>
						<div class="type-class-demo">
							<code>.body-small</code>
							<p class="body-small">
								Body-small for secondary information, metadata, and supporting content.
							</p>
						</div>
						<div class="type-class-demo">
							<code>.caption</code>
							<p class="caption">CAPTION TEXT FOR LABELS AND TAGS</p>
						</div>
					</div>
				</div>

				<!-- Prose Example -->
				<div class="subsection">
					<h3>Prose Styling</h3>
					<p class="subsection-description">
						The .prose class provides optimized styling for long-form curriculum content.
					</p>
					<div class="prose-demo">
						<div class="prose">
							<h2>Understanding Token Economics</h2>
							<p>
								Large language models process text in chunks called <strong>tokens</strong>. Understanding
								tokens is fundamental to optimizing AI usage costs.
							</p>
							<h3>Why Tokens Matter</h3>
							<p>
								Every API call is priced by tokens consumed. A rough rule: 1 token equals about 4 characters
								or 0.75 words in English.
							</p>
							<ul>
								<li>Input tokens: What you send to the model</li>
								<li>Output tokens: What the model generates</li>
								<li>Context window: Maximum tokens per conversation</li>
							</ul>
							<blockquote>
								"A 100,000 token context window means roughly 75,000 words - about the length of a novel."
							</blockquote>
							<pre><code>// Calculate approximate token count
const estimateTokens = (text) => Math.ceil(text.length / 4);</code></pre>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- Spacing Section -->
		{#if activeSection === 'spacing'}
			<section class="section animate-fade-in">
				<h2 class="section-title">Spacing & Layout</h2>
				<p class="section-description">
					An 8px baseline grid system for consistent spacing throughout the application.
				</p>

				<!-- Spacing Scale -->
				<div class="subsection">
					<h3>Spacing Scale</h3>
					<div class="spacing-scale">
						{#each spacingScale as space}
							<div class="spacing-row">
								<div class="spacing-meta">
									<code>--{space.name}</code>
									<span>{space.value} ({space.pixels})</span>
								</div>
								<div class="spacing-visual">
									<div class="spacing-bar" style="width: var(--{space.name})"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Border Radius -->
				<div class="subsection">
					<h3>Border Radius</h3>
					<div class="radius-demos">
						{#each radiusScale as radius}
							<div class="radius-demo">
								<div
									class="radius-box"
									style="border-radius: var(--{radius.name})"
								></div>
								<div class="radius-label">
									<code>--{radius.name}</code>
									<span>{radius.value}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Shadows -->
				<div class="subsection">
					<h3>Shadows</h3>
					<div class="shadow-demos">
						{#each shadows as shadow}
							<div class="shadow-demo">
								<div class="shadow-box" style="box-shadow: var(--{shadow.name})"></div>
								<div class="shadow-label">
									<code>--{shadow.name}</code>
									<span>{shadow.desc}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Layout Tokens -->
				<div class="subsection">
					<h3>Layout Tokens</h3>
					<div class="layout-tokens">
						<div class="token-row">
							<code>--container-sm</code>
							<span>640px</span>
						</div>
						<div class="token-row">
							<code>--container-md</code>
							<span>768px</span>
						</div>
						<div class="token-row">
							<code>--container-lg</code>
							<span>1024px</span>
						</div>
						<div class="token-row">
							<code>--container-xl</code>
							<span>1280px</span>
						</div>
						<div class="token-row">
							<code>--sidebar-width</code>
							<span>280px</span>
						</div>
						<div class="token-row">
							<code>--header-height</code>
							<span>64px</span>
						</div>
						<div class="token-row">
							<code>--content-max-width</code>
							<span>65ch (optimal reading)</span>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- Components Section -->
		{#if activeSection === 'components'}
			<section class="section animate-fade-in">
				<h2 class="section-title">Components</h2>
				<p class="section-description">
					Core UI components built with design tokens. These serve as the foundation for the learning interface.
				</p>

				<!-- Buttons -->
				<div class="subsection">
					<h3>Buttons</h3>
					<div class="button-demos">
						<div class="button-row">
							<h4>Primary</h4>
							<div class="button-group">
								<button class="btn btn-primary btn-sm">Small</button>
								<button class="btn btn-primary">Default</button>
								<button class="btn btn-primary btn-lg">Large</button>
							</div>
						</div>
						<div class="button-row">
							<h4>Secondary</h4>
							<div class="button-group">
								<button class="btn btn-secondary btn-sm">Small</button>
								<button class="btn btn-secondary">Default</button>
								<button class="btn btn-secondary btn-lg">Large</button>
							</div>
						</div>
						<div class="button-row">
							<h4>Ghost</h4>
							<div class="button-group">
								<button class="btn btn-ghost btn-sm">Small</button>
								<button class="btn btn-ghost">Default</button>
								<button class="btn btn-ghost btn-lg">Large</button>
							</div>
						</div>
						<div class="button-row">
							<h4>States</h4>
							<div class="button-group">
								<button class="btn btn-primary" disabled>Disabled</button>
								<button class="btn btn-primary loading">
									<span class="spinner"></span>
									Loading
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Form Inputs -->
				<div class="subsection">
					<h3>Form Inputs</h3>
					<div class="input-demos">
						<div class="input-row">
							<label class="label" for="demo-text-input">Text Input</label>
							<input type="text" id="demo-text-input" class="input" placeholder="Enter your response..." />
						</div>
						<div class="input-row">
							<label class="label" for="demo-select">Select</label>
							<select id="demo-select" class="input">
								<option>Choose a model...</option>
								<option>GPT-4</option>
								<option>Claude 3</option>
								<option>Gemini Pro</option>
							</select>
						</div>
						<div class="input-row">
							<label class="label" for="demo-textarea">Textarea</label>
							<textarea id="demo-textarea" class="input textarea" placeholder="Write your prompt here..."></textarea>
						</div>
						<div class="input-row">
							<label class="checkbox-label">
								<input type="checkbox" class="checkbox" />
								<span>Mark as complete</span>
							</label>
						</div>
					</div>
				</div>

				<!-- Cards -->
				<div class="subsection">
					<h3>Cards</h3>
					<div class="card-demos">
						<div class="card">
							<div class="card-header">
								<h4>Module Card</h4>
								<span class="badge badge-primary">Phase 1</span>
							</div>
							<p class="card-body">
								Understanding the economics of AI tokens and how they impact your project costs.
							</p>
							<div class="card-footer">
								<span class="meta">10 min read</span>
								<button class="btn btn-ghost btn-sm">Start</button>
							</div>
						</div>

						<div class="card card-interactive">
							<div class="card-header">
								<h4>Interactive Card</h4>
								<span class="badge badge-secondary">Lab</span>
							</div>
							<p class="card-body">
								Hover me to see the interactive state with elevated shadow.
							</p>
							<div class="card-footer">
								<span class="progress-text">75% complete</span>
								<div class="progress-bar">
									<div class="progress-fill" style="width: 75%"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Progress Indicators -->
				<div class="subsection">
					<h3>Progress Indicators</h3>
					<div class="progress-demos">
						<div class="progress-demo">
							<h4>Progress Bar</h4>
							<div class="progress-bar">
								<div class="progress-fill" style="width: 65%"></div>
							</div>
							<span class="meta">65% Complete</span>
						</div>

						<div class="progress-demo">
							<h4>Progress Ring</h4>
							<div class="progress-rings">
								<div class="progress-ring" style="--progress: 25%">
									<svg viewBox="0 0 36 36">
										<circle class="ring-bg" cx="18" cy="18" r="16" />
										<circle class="ring-fill" cx="18" cy="18" r="16" stroke-dasharray="25, 100" />
									</svg>
									<span>25%</span>
								</div>
								<div class="progress-ring" style="--progress: 50%">
									<svg viewBox="0 0 36 36">
										<circle class="ring-bg" cx="18" cy="18" r="16" />
										<circle class="ring-fill" cx="18" cy="18" r="16" stroke-dasharray="50, 100" />
									</svg>
									<span>50%</span>
								</div>
								<div class="progress-ring" style="--progress: 75%">
									<svg viewBox="0 0 36 36">
										<circle class="ring-bg" cx="18" cy="18" r="16" />
										<circle class="ring-fill" cx="18" cy="18" r="16" stroke-dasharray="75, 100" />
									</svg>
									<span>75%</span>
								</div>
								<div class="progress-ring complete" style="--progress: 100%">
									<svg viewBox="0 0 36 36">
										<circle class="ring-bg" cx="18" cy="18" r="16" />
										<circle class="ring-fill" cx="18" cy="18" r="16" stroke-dasharray="100, 100" />
									</svg>
									<span>100%</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Badges -->
				<div class="subsection">
					<h3>Badges & Tags</h3>
					<div class="badge-demos">
						<span class="badge badge-primary">Primary</span>
						<span class="badge badge-secondary">Secondary</span>
						<span class="badge badge-success">Completed</span>
						<span class="badge badge-warning">In Progress</span>
						<span class="badge badge-error">Error</span>
						<span class="badge badge-phase-1">Phase 1</span>
						<span class="badge badge-phase-2">Phase 2</span>
						<span class="badge badge-phase-3">Phase 3</span>
						<span class="badge badge-phase-4">Phase 4</span>
					</div>
				</div>

				<!-- Alerts -->
				<div class="subsection">
					<h3>Alerts</h3>
					<div class="alert-demos">
						<div class="alert alert-info">
							<strong>Info:</strong> This module covers the basics of token economics.
						</div>
						<div class="alert alert-success">
							<strong>Success:</strong> Module completed! You've earned 10 XP.
						</div>
						<div class="alert alert-warning">
							<strong>Warning:</strong> This lab requires API key configuration.
						</div>
						<div class="alert alert-error">
							<strong>Error:</strong> Failed to save progress. Please try again.
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- Animations Section -->
		{#if activeSection === 'animations'}
			<section class="section animate-fade-in">
				<h2 class="section-title">Motion & Animations</h2>
				<p class="section-description">
					Subtle animations enhance the learning experience without distraction.
					Respects prefers-reduced-motion.
				</p>

				<!-- Timing -->
				<div class="subsection">
					<h3>Duration Tokens</h3>
					<div class="duration-demos">
						<div class="duration-row">
							<code>--duration-75</code>
							<span>75ms - Micro interactions</span>
						</div>
						<div class="duration-row">
							<code>--duration-150</code>
							<span>150ms - Quick transitions</span>
						</div>
						<div class="duration-row">
							<code>--duration-200</code>
							<span>200ms - Default transitions</span>
						</div>
						<div class="duration-row">
							<code>--duration-300</code>
							<span>300ms - Emphasis transitions</span>
						</div>
						<div class="duration-row">
							<code>--duration-500</code>
							<span>500ms - Page transitions</span>
						</div>
					</div>
				</div>

				<!-- Animation Demos -->
				<div class="subsection">
					<h3>Animation Classes</h3>
					<div class="animation-demos">
						<div class="animation-demo">
							<div class="animation-box animate-fade-in-demo">Fade In</div>
							<code>.animate-fade-in</code>
						</div>
						<div class="animation-demo">
							<div class="animation-box animate-slide-up-demo">Slide Up</div>
							<code>.animate-slide-up</code>
						</div>
						<div class="animation-demo">
							<div class="animation-box animate-scale-in-demo">Scale In</div>
							<code>.animate-scale-in</code>
						</div>
						<div class="animation-demo">
							<div class="animation-box animate-pulse">Pulse</div>
							<code>.animate-pulse</code>
						</div>
						<div class="animation-demo">
							<div class="animation-box animate-spin">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 12a9 9 0 1 1-6.219-8.56" />
								</svg>
							</div>
							<code>.animate-spin</code>
						</div>
					</div>
				</div>

				<!-- Easing -->
				<div class="subsection">
					<h3>Easing Functions</h3>
					<div class="easing-demos">
						<div class="easing-demo">
							<div class="easing-ball ease-linear"></div>
							<code>--ease-linear</code>
						</div>
						<div class="easing-demo">
							<div class="easing-ball ease-in"></div>
							<code>--ease-in</code>
						</div>
						<div class="easing-demo">
							<div class="easing-ball ease-out"></div>
							<code>--ease-out</code>
						</div>
						<div class="easing-demo">
							<div class="easing-ball ease-in-out"></div>
							<code>--ease-in-out</code>
						</div>
						<div class="easing-demo">
							<div class="easing-ball ease-bounce"></div>
							<code>--ease-bounce</code>
						</div>
					</div>
					<p class="subsection-note">Hover over each ball to see the easing in action.</p>
				</div>
			</section>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="footer">
		<p>AI Analyst Academy Design System v1.0</p>
		<p class="meta">Last updated: {new Date().toLocaleDateString()}</p>
	</footer>
</div>

<style>
	/* Layout */
	.style-guide {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
	}

	/* Header */
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background-color: var(--color-bg-primary);
		border-bottom: var(--border-width) solid var(--color-border-primary);
		padding: var(--space-4) var(--space-6);
	}

	.header-content {
		max-width: var(--container-xl);
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.header-title h1 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.theme-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: background-color var(--duration-150) var(--ease-out);
	}

	.theme-toggle:hover {
		background-color: var(--color-bg-tertiary);
	}

	.back-link {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Navigation */
	.nav {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-6);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
		background-color: var(--color-bg-secondary);
		max-width: var(--container-xl);
		margin: 0 auto;
	}

	.nav-item {
		padding: var(--space-2) var(--space-4);
		border: none;
		background: none;
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		border-radius: var(--radius-md);
		transition: all var(--duration-150) var(--ease-out);
	}

	.nav-item:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-tertiary);
	}

	.nav-item.active {
		color: var(--color-primary-600);
		background-color: var(--color-primary-50);
	}

	/* Main Content */
	.main {
		max-width: var(--container-xl);
		margin: 0 auto;
		padding: var(--space-8) var(--space-6);
	}

	.section {
		margin-bottom: var(--space-16);
	}

	.section-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-2);
	}

	.section-description {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
		margin-bottom: var(--space-8);
		max-width: var(--content-max-width);
	}

	.subsection {
		margin-bottom: var(--space-10);
	}

	.subsection h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
	}

	.subsection h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
	}

	.subsection-description {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.subsection-note {
		color: var(--color-text-tertiary);
		font-size: var(--text-sm);
		font-style: italic;
		margin-top: var(--space-4);
	}

	/* Badge */
	.badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-full);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
	}

	.badge-primary {
		background-color: var(--color-primary-100);
		color: var(--color-primary-700);
	}

	.badge-secondary {
		background-color: var(--color-secondary-100);
		color: var(--color-secondary-700);
	}

	.badge-success {
		background-color: var(--color-success-100);
		color: var(--color-success-700);
	}

	.badge-warning {
		background-color: var(--color-warning-100);
		color: var(--color-warning-700);
	}

	.badge-error {
		background-color: var(--color-error-100);
		color: var(--color-error-700);
	}

	.badge-phase-1 {
		background-color: var(--color-phase-1-light);
		color: var(--color-phase-1-dark);
	}

	.badge-phase-2 {
		background-color: var(--color-phase-2-light);
		color: var(--color-phase-2-dark);
	}

	.badge-phase-3 {
		background-color: var(--color-phase-3-light);
		color: var(--color-phase-3-dark);
	}

	.badge-phase-4 {
		background-color: var(--color-phase-4-light);
		color: var(--color-phase-4-dark);
	}

	/* Colors Section */
	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: var(--space-4);
	}

	.color-grid.compact {
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: var(--space-2);
	}

	.color-swatch {
		display: flex;
		flex-direction: column;
	}

	.color-swatch .swatch {
		height: 60px;
		border-radius: var(--radius-md);
		border: var(--border-width) solid var(--color-border-secondary);
	}

	.color-swatch.small .swatch {
		height: 40px;
	}

	.swatch-label {
		display: flex;
		flex-direction: column;
		margin-top: var(--space-2);
	}

	.swatch-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.swatch-var {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.semantic-group {
		margin-bottom: var(--space-6);
	}

	.phase-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
	}

	.phase-swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.phase-colors {
		display: flex;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.phase-colors .swatch {
		width: 60px;
		height: 60px;
	}

	.phase-name {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.theme-colors-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: var(--space-4);
	}

	.theme-color {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.theme-color .swatch {
		width: 80px;
		height: 80px;
		border-radius: var(--radius-md);
		border: var(--border-width) solid var(--color-border-primary);
	}

	.theme-color .text-swatch {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	.theme-color span {
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
	}

	/* Typography Section */
	.font-family-demo {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.font-demo {
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.font-label {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-2);
		display: block;
	}

	.font-sans-demo {
		font-family: var(--font-sans);
		font-size: var(--text-xl);
	}

	.font-mono-demo {
		font-family: var(--font-mono);
		font-size: var(--text-lg);
		color: var(--color-primary-600);
	}

	.type-scale {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.type-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
		padding: var(--space-3) 0;
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.type-meta {
		width: 120px;
		flex-shrink: 0;
	}

	.type-meta code {
		display: block;
		font-size: var(--text-sm);
	}

	.type-size {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.type-sample {
		margin: 0;
	}

	.weight-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.weight-demos p {
		font-size: var(--text-lg);
	}

	.typography-classes {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.type-class-demo {
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.type-class-demo code {
		display: block;
		margin-bottom: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.prose-demo {
		padding: var(--space-6);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	/* Spacing Section */
	.spacing-scale {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.spacing-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.spacing-meta {
		width: 200px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
	}

	.spacing-meta span {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.spacing-visual {
		flex: 1;
		height: 24px;
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.spacing-bar {
		height: 100%;
		background-color: var(--color-primary-500);
	}

	.radius-demos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
	}

	.radius-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radius-box {
		width: 80px;
		height: 80px;
		background-color: var(--color-primary-500);
	}

	.radius-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: var(--space-2);
	}

	.radius-label span {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.shadow-demos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-8);
	}

	.shadow-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.shadow-box {
		width: 100px;
		height: 100px;
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-lg);
	}

	.shadow-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: var(--space-3);
	}

	.shadow-label span {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.layout-tokens {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--space-2);
	}

	.token-row {
		display: flex;
		justify-content: space-between;
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
	}

	.token-row span {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	/* Components Section */
	.button-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.button-row {
		padding: var(--space-4);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
	}

	.button-row h4 {
		margin-bottom: var(--space-3);
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	/* Button Styles */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: 0 var(--btn-padding);
		height: var(--btn-height);
		border: var(--border-width) solid transparent;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.btn-sm {
		height: var(--btn-height-sm);
		padding: 0 var(--btn-padding-sm);
		font-size: var(--text-xs);
	}

	.btn-lg {
		height: var(--btn-height-lg);
		padding: 0 var(--btn-padding-lg);
		font-size: var(--text-base);
	}

	.btn-primary {
		background-color: var(--btn-primary-bg);
		color: var(--btn-primary-text);
	}

	.btn-primary:hover:not(:disabled) {
		background-color: var(--btn-primary-bg-hover);
	}

	.btn-secondary {
		background-color: var(--btn-secondary-bg);
		color: var(--btn-secondary-text);
		border-color: var(--btn-secondary-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: var(--btn-secondary-bg-hover);
	}

	.btn-ghost {
		background-color: var(--btn-ghost-bg);
		color: var(--btn-ghost-text);
	}

	.btn-ghost:hover:not(:disabled) {
		background-color: var(--btn-ghost-bg-hover);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.loading {
		pointer-events: none;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	/* Input Styles */
	.input-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 400px;
	}

	.input-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.input {
		height: var(--input-height);
		padding: 0 var(--input-padding);
		background-color: var(--input-bg);
		border: var(--border-width) solid var(--input-border);
		border-radius: var(--input-radius);
		font-size: var(--text-sm);
		color: var(--input-text);
		transition: border-color var(--duration-150) var(--ease-out);
	}

	.input:focus {
		outline: none;
		border-color: var(--input-border-focus);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.input::placeholder {
		color: var(--input-placeholder);
	}

	.textarea {
		height: auto;
		min-height: 100px;
		padding: var(--input-padding);
		resize: vertical;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
	}

	.checkbox {
		width: 18px;
		height: 18px;
		accent-color: var(--color-primary-600);
	}

	/* Card Styles */
	.card-demos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-6);
	}

	.card {
		background-color: var(--card-bg);
		border: var(--border-width) solid var(--card-border);
		border-radius: var(--card-radius);
		box-shadow: var(--card-shadow);
		overflow: hidden;
	}

	.card-interactive {
		transition: box-shadow var(--duration-200) var(--ease-out);
		cursor: pointer;
	}

	.card-interactive:hover {
		box-shadow: var(--card-shadow-hover);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--card-padding);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.card-header h4 {
		margin: 0;
	}

	.card-body {
		padding: var(--card-padding);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--card-padding);
		background-color: var(--color-bg-secondary);
	}

	.meta {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	/* Progress Styles */
	.progress-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.progress-demo h4 {
		margin-bottom: var(--space-3);
	}

	.progress-bar {
		height: var(--progress-height);
		background-color: var(--progress-bg);
		border-radius: var(--progress-radius);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--progress-fill);
		border-radius: var(--progress-radius);
		transition: width var(--duration-300) var(--ease-out);
	}

	.progress-text {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.progress-rings {
		display: flex;
		gap: var(--space-6);
	}

	.progress-ring {
		position: relative;
		width: 80px;
		height: 80px;
	}

	.progress-ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.progress-ring .ring-bg {
		fill: none;
		stroke: var(--progress-bg);
		stroke-width: 3;
	}

	.progress-ring .ring-fill {
		fill: none;
		stroke: var(--progress-fill);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.progress-ring.complete .ring-fill {
		stroke: var(--color-success-500);
	}

	.progress-ring span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	/* Badge Demos */
	.badge-demos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	/* Alert Styles */
	.alert-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.alert {
		padding: var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.alert-info {
		background-color: var(--color-info-50);
		color: var(--color-info-700);
		border-left: var(--border-width-4) solid var(--color-info-500);
	}

	.alert-success {
		background-color: var(--color-success-50);
		color: var(--color-success-700);
		border-left: var(--border-width-4) solid var(--color-success-500);
	}

	.alert-warning {
		background-color: var(--color-warning-50);
		color: var(--color-warning-700);
		border-left: var(--border-width-4) solid var(--color-warning-500);
	}

	.alert-error {
		background-color: var(--color-error-50);
		color: var(--color-error-700);
		border-left: var(--border-width-4) solid var(--color-error-500);
	}

	/* Animations Section */
	.duration-demos {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.duration-row {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
	}

	.duration-row span {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.animation-demos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
	}

	.animation-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.animation-box {
		width: 100px;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-primary-500);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-lg);
	}

	.animate-fade-in-demo {
		animation: fadeIn 1s ease-out infinite;
	}

	.animate-slide-up-demo {
		animation: slideUp 1s ease-out infinite;
	}

	.animate-scale-in-demo {
		animation: scaleIn 1s ease-out infinite;
	}

	.easing-demos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
	}

	.easing-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.easing-ball {
		width: 48px;
		height: 48px;
		background-color: var(--color-secondary-500);
		border-radius: 50%;
		transition: transform 0.5s;
	}

	.easing-demo:hover .easing-ball {
		transform: translateY(-20px);
	}

	.ease-linear { transition-timing-function: var(--ease-linear); }
	.ease-in { transition-timing-function: var(--ease-in); }
	.ease-out { transition-timing-function: var(--ease-out); }
	.ease-in-out { transition-timing-function: var(--ease-in-out); }
	.ease-bounce { transition-timing-function: var(--ease-bounce); }

	/* Footer */
	.footer {
		padding: var(--space-8) var(--space-6);
		border-top: var(--border-width) solid var(--color-border-secondary);
		text-align: center;
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.footer .meta {
		margin-top: var(--space-1);
	}
</style>
