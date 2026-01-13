import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Use jsdom for DOM testing
		environment: 'jsdom',

		// Include test files
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],

		// Setup files run before each test file
		setupFiles: ['./tests/setup.ts'],

		// Enable globals (describe, it, expect, etc.)
		globals: true,

		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/types/**', '**/*.d.ts', '**/*.test.ts', '**/*.spec.ts']
		},

		// Alias resolution (inherits from SvelteKit)
		alias: {
			$lib: '/src/lib',
			$env: '/src/env'
		}
	}
});
