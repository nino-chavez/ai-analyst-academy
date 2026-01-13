/**
 * Vitest setup file
 * Runs before each test file to set up the testing environment
 */

import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';

// Mock environment variables for tests
process.env.ENCRYPTION_KEY = 'test-encryption-key-that-is-at-least-32-characters-long';

// Mock SvelteKit's $env modules
vi.mock('$env/dynamic/private', () => ({
	env: {
		ENCRYPTION_KEY: 'test-encryption-key-that-is-at-least-32-characters-long'
	}
}));

vi.mock('$env/dynamic/public', () => ({
	env: {}
}));

// Clean up after each test
afterEach(() => {
	vi.clearAllMocks();
});
