<script lang="ts">
	import { browser } from '$app/environment';
	import { validateByokKey, type ByokProvider } from '$lib/validation/schemas';

	// Provider mode: 'default' uses platform OpenRouter, 'byok' uses user's key
	let providerMode = $state<'default' | 'byok'>('default');
	let byokProvider = $state<ByokProvider>('openai');
	let byokKey = $state('');
	let byokKeyError = $state<string | null>(null);
	let showByokSetup = $state(false);

	let selectedPersona = $state<string | null>(null);
	let messages = $state<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
	let inputValue = $state('');
	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null);

	// Load BYOK settings from localStorage on mount
	$effect(() => {
		if (browser) {
			const savedMode = localStorage.getItem('sandbox_provider_mode');
			const savedProvider = localStorage.getItem('sandbox_byok_provider');
			const savedKey = localStorage.getItem('sandbox_byok_key');

			if (savedMode === 'byok' && savedProvider && savedKey) {
				providerMode = 'byok';
				byokProvider = savedProvider as ByokProvider;
				byokKey = savedKey;
			}
		}
	});

	const personas = [
		{
			id: 'general',
			name: 'General Assistant',
			description: 'A helpful AI assistant for general questions and tasks',
			icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
		},
		{
			id: 'gen-z',
			name: 'Gen-Z Consumer',
			description: 'Test your prompts against a skeptical Gen-Z perspective',
			icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			id: 'investor',
			name: 'Investor',
			description: 'Evaluate pitches and business ideas from an investor lens',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			id: 'editor',
			name: 'Strict Editor',
			description: 'Get critical feedback on your writing and content',
			icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
		}
	];

	const providerNames: Record<string, string> = {
		openrouter: 'AI Assistant',
		openai: 'OpenAI',
		anthropic: 'Anthropic',
		google: 'Google'
	};

	function selectPersona(id: string) {
		selectedPersona = id;
		messages = [];
		errorMessage = null;
	}

	function saveByokSettings() {
		byokKeyError = null;

		// Validate the key format
		if (!validateByokKey(byokProvider, byokKey)) {
			byokKeyError = `Invalid ${providerNames[byokProvider]} API key format`;
			return;
		}

		// Save to localStorage
		if (browser) {
			localStorage.setItem('sandbox_provider_mode', 'byok');
			localStorage.setItem('sandbox_byok_provider', byokProvider);
			localStorage.setItem('sandbox_byok_key', byokKey);
		}

		providerMode = 'byok';
		showByokSetup = false;
	}

	function clearByokSettings() {
		if (browser) {
			localStorage.removeItem('sandbox_provider_mode');
			localStorage.removeItem('sandbox_byok_provider');
			localStorage.removeItem('sandbox_byok_key');
		}

		providerMode = 'default';
		byokKey = '';
		byokProvider = 'openai';
		showByokSetup = false;
	}

	async function handleSubmit() {
		if (!inputValue.trim() || isLoading) return;

		const userMessage = inputValue.trim();
		messages = [...messages, { role: 'user', content: userMessage }];
		inputValue = '';
		isLoading = true;
		errorMessage = null;

		try {
			// Build request body based on mode
			const requestBody: Record<string, unknown> = {
				messages: messages.map((m) => ({ role: m.role, content: m.content })),
				persona: selectedPersona
			};

			if (providerMode === 'byok') {
				requestBody.provider = byokProvider;
				requestBody.byokKey = byokKey;
			} else {
				requestBody.provider = 'openrouter';
			}

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
				throw new Error(errorData.message || `Error: ${response.status}`);
			}

			const responseData = await response.json();
			messages = [...messages, { role: 'assistant', content: responseData.content }];
		} catch (err) {
			console.error('Chat error:', err);
			errorMessage = err instanceof Error ? err.message : 'Failed to send message';
			// Remove the user message if the request failed
			messages = messages.slice(0, -1);
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<svelte:head>
	<title>AI Sandbox | AI Analyst Academy</title>
	<meta
		name="description"
		content="Practice AI prompting with different personas in a safe sandbox environment"
	/>
</svelte:head>

<div class="sandbox-page">
	<header class="page-header">
		<h1 class="page-title">AI Sandbox</h1>
		<p class="page-description">
			Practice prompting techniques with AI using different personas
		</p>
	</header>

	{#if showByokSetup}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- BYOK Setup Modal -->
		<div class="modal-backdrop" onclick={() => (showByokSetup = false)} onkeydown={(e) => e.key === 'Escape' && (showByokSetup = false)} role="presentation">
			<div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-labelledby="byok-title" tabindex="-1">
				<h2 id="byok-title" class="modal-title">Use Your Own API Key</h2>
				<p class="modal-description">
					Power users can use their own API keys for more control. Keys are stored locally in your
					browser and sent per-request (never stored on our servers).
				</p>

				<div class="byok-form">
					<div class="form-group">
						<label for="byok-provider" class="form-label">Provider</label>
						<select id="byok-provider" class="form-select" bind:value={byokProvider}>
							<option value="openai">OpenAI</option>
							<option value="anthropic">Anthropic</option>
							<option value="google">Google</option>
						</select>
					</div>

					<div class="form-group">
						<label for="byok-key" class="form-label">API Key</label>
						<input
							id="byok-key"
							type="password"
							class="form-input"
							placeholder={byokProvider === 'openai'
								? 'sk-...'
								: byokProvider === 'anthropic'
									? 'sk-ant-...'
									: 'AIza...'}
							bind:value={byokKey}
						/>
						{#if byokKeyError}
							<p class="form-error">{byokKeyError}</p>
						{/if}
					</div>

					<div class="modal-actions">
						<button class="btn btn-secondary" onclick={() => (showByokSetup = false)}>
							Cancel
						</button>
						<button class="btn btn-primary" onclick={saveByokSettings} disabled={!byokKey.trim()}>
							Save & Use
						</button>
					</div>
				</div>

				<p class="modal-note">
					Your API key is stored only in your browser's localStorage and sent directly to the
					provider. We never see or store your key.
				</p>
			</div>
		</div>
	{/if}

	{#if !selectedPersona}
		<div class="persona-selection">
			<h2 class="selection-title">Choose a Persona</h2>
			<p class="selection-description">
				Select an AI persona to practice with. Each persona has different characteristics and use
				cases.
			</p>

			<!-- Provider Mode Selector -->
			<div class="mode-selector">
				{#if providerMode === 'default'}
					<div class="mode-badge default">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
						</svg>
						<span>Using AI Assistant (GPT-4o-mini)</span>
					</div>
					<button class="mode-switch" onclick={() => (showByokSetup = true)}>
						Use your own API key
					</button>
				{:else}
					<div class="mode-badge byok">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
						<span>Using {providerNames[byokProvider]} (your key)</span>
					</div>
					<button class="mode-switch" onclick={clearByokSettings}> Switch to default </button>
				{/if}
			</div>

			<div class="personas-grid">
				{#each personas as persona (persona.id)}
					<button class="persona-card" onclick={() => selectPersona(persona.id)}>
						<div class="persona-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d={persona.icon} />
							</svg>
						</div>
						<h3 class="persona-name">{persona.name}</h3>
						<p class="persona-description">{persona.description}</p>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<div class="chat-container">
			<div class="chat-header">
				<button class="back-button" onclick={() => (selectedPersona = null)}>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
					<span>Change Persona</span>
				</button>
				<div class="current-persona">
					<span class="persona-label">Chatting with:</span>
					<span class="persona-value">{personas.find((p) => p.id === selectedPersona)?.name}</span>
					<span class="provider-badge {providerMode}">
						{providerMode === 'default' ? 'AI Assistant' : providerNames[byokProvider]}
					</span>
				</div>
			</div>

			<div class="messages-container">
				{#if messages.length === 0}
					<div class="empty-state">
						<p>Start a conversation by typing a message below.</p>
					</div>
				{:else}
					{#each messages as message, i (i)}
						<div class="message {message.role}">
							<div class="message-content">{message.content}</div>
						</div>
					{/each}
					{#if isLoading}
						<div class="message assistant loading">
							<div class="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					{/if}
				{/if}
			</div>

			{#if errorMessage}
				<div class="error-banner">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<span>{errorMessage}</span>
					<button class="error-dismiss" onclick={() => (errorMessage = null)} aria-label="Dismiss">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{/if}

			<form
				class="input-container"
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<textarea
					class="message-input"
					placeholder="Type your message..."
					bind:value={inputValue}
					onkeydown={handleKeydown}
					rows="1"
				></textarea>
				<button
					type="submit"
					class="send-button"
					disabled={!inputValue.trim() || isLoading}
					aria-label="Send message"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.sandbox-page {
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

	/* Mode Selector */
	.mode-selector {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
	}

	.mode-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.mode-badge.default {
		background-color: var(--color-primary-50);
		color: var(--color-primary-700);
	}

	.mode-badge.byok {
		background-color: var(--color-success-50);
		color: var(--color-success-700);
	}

	.mode-switch {
		padding: var(--space-2) var(--space-3);
		background: none;
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.mode-switch:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: var(--space-4);
	}

	.modal-content {
		background-color: var(--color-bg-primary);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		max-width: 480px;
		width: 100%;
		box-shadow: var(--shadow-xl);
	}

	.modal-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.modal-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
		line-height: var(--leading-relaxed);
	}

	.modal-note {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin: var(--space-4) 0 0 0;
		text-align: center;
	}

	.modal-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
		margin-top: var(--space-4);
	}

	/* Form */
	.byok-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.form-select,
	.form-input {
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		color: var(--color-text-primary);
	}

	.form-select:focus,
	.form-input:focus {
		outline: none;
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.form-error {
		font-size: var(--text-sm);
		color: var(--color-error-600);
		margin: 0;
	}

	/* Persona Selection */
	.persona-selection {
		max-width: 800px;
		margin: 0 auto;
	}

	.selection-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
		text-align: center;
	}

	.selection-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-6) 0;
		text-align: center;
	}

	.personas-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.persona-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-6);
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.persona-card:hover {
		border-color: var(--color-primary-400);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.persona-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-full);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-3);
	}

	.persona-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.persona-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: var(--leading-relaxed);
	}

	/* Chat Container */
	.chat-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 240px);
		min-height: 400px;
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-bg-primary);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: none;
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.back-button:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	.current-persona {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.persona-label {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.persona-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	.provider-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.provider-badge.default {
		background-color: var(--color-primary-100);
		color: var(--color-primary-700);
	}

	.provider-badge.byok {
		background-color: var(--color-success-100);
		color: var(--color-success-700);
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-tertiary);
		font-size: var(--text-sm);
	}

	.message {
		max-width: 80%;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		line-height: var(--leading-relaxed);
	}

	.message.user {
		align-self: flex-end;
		background-color: var(--color-primary-600);
		color: white;
	}

	.message.assistant {
		align-self: flex-start;
		background-color: var(--color-bg-primary);
		border: var(--border-width) solid var(--color-border-secondary);
		color: var(--color-text-primary);
	}

	.message.loading {
		padding: var(--space-4);
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		background-color: var(--color-text-tertiary);
		border-radius: var(--radius-full);
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}
	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	/* Error Banner */
	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-error-50);
		border-top: var(--border-width) solid var(--color-error-200);
		color: var(--color-error-700);
		font-size: var(--text-sm);
	}

	.error-dismiss {
		margin-left: auto;
		padding: var(--space-1);
		background: none;
		border: none;
		color: var(--color-error-500);
		cursor: pointer;
	}

	.error-dismiss:hover {
		color: var(--color-error-700);
	}

	.input-container {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: var(--color-bg-primary);
		border-top: var(--border-width) solid var(--color-border-secondary);
	}

	.message-input {
		flex: 1;
		padding: var(--space-3);
		background-color: var(--color-bg-secondary);
		border: var(--border-width) solid var(--color-border-primary);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		color: var(--color-text-primary);
		resize: none;
		font-family: inherit;
	}

	.message-input:focus {
		outline: none;
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.send-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background-color: var(--color-primary-600);
		border: none;
		border-radius: var(--radius-lg);
		color: white;
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-out);
	}

	.send-button:hover:not(:disabled) {
		background-color: var(--color-primary-700);
	}

	.send-button:disabled {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-tertiary);
		cursor: not-allowed;
	}

	/* Buttons */
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

	.btn-primary:hover:not(:disabled) {
		background-color: var(--color-primary-700);
	}

	.btn-primary:disabled {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-tertiary);
		cursor: not-allowed;
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-text-secondary);
		border: var(--border-width) solid var(--color-border-primary);
	}

	.btn-secondary:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-primary);
	}

	@media (max-width: 640px) {
		.mode-selector {
			flex-direction: column;
		}

		.chat-header {
			flex-direction: column;
			gap: var(--space-2);
			align-items: flex-start;
		}

		.message {
			max-width: 90%;
		}
	}
</style>
