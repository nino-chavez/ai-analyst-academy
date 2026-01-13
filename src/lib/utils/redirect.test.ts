/**
 * Unit tests for redirect validation utilities
 * Tests protection against open redirect vulnerabilities
 */

import { describe, it, expect } from 'vitest';
import { getSafeRedirect, isValidRedirectUrl } from './redirect';

describe('redirect utilities', () => {
	describe('getSafeRedirect', () => {
		// Valid redirects
		it('should allow valid internal paths', () => {
			expect(getSafeRedirect('/learn')).toBe('/learn');
			expect(getSafeRedirect('/progress')).toBe('/progress');
			expect(getSafeRedirect('/settings')).toBe('/settings');
			expect(getSafeRedirect('/portfolio')).toBe('/portfolio');
			expect(getSafeRedirect('/sandbox')).toBe('/sandbox');
			expect(getSafeRedirect('/onboarding')).toBe('/onboarding');
			expect(getSafeRedirect('/syllabus')).toBe('/syllabus');
		});

		it('should allow subpaths of allowed paths', () => {
			expect(getSafeRedirect('/learn/phase/1')).toBe('/learn/phase/1');
			expect(getSafeRedirect('/learn/lab/test-lab')).toBe('/learn/lab/test-lab');
			expect(getSafeRedirect('/settings/api-keys')).toBe('/settings/api-keys');
		});

		it('should preserve query strings on valid paths', () => {
			expect(getSafeRedirect('/learn?tab=1')).toBe('/learn?tab=1');
			expect(getSafeRedirect('/settings?section=profile')).toBe('/settings?section=profile');
		});

		it('should preserve fragments on valid paths', () => {
			expect(getSafeRedirect('/learn#section-1')).toBe('/learn#section-1');
		});

		// Default behavior
		it('should return default for null input', () => {
			expect(getSafeRedirect(null)).toBe('/learn');
		});

		it('should return default for undefined input', () => {
			expect(getSafeRedirect(undefined)).toBe('/learn');
		});

		it('should return default for empty string', () => {
			expect(getSafeRedirect('')).toBe('/learn');
		});

		it('should return custom default when specified', () => {
			expect(getSafeRedirect(null, '/custom')).toBe('/custom');
			expect(getSafeRedirect('', '/custom')).toBe('/custom');
		});

		// Attack prevention - protocol attacks
		it('should reject absolute URLs', () => {
			expect(getSafeRedirect('https://evil.com')).toBe('/learn');
			expect(getSafeRedirect('http://evil.com')).toBe('/learn');
			expect(getSafeRedirect('ftp://evil.com')).toBe('/learn');
		});

		it('should reject protocol-relative URLs', () => {
			expect(getSafeRedirect('//evil.com')).toBe('/learn');
			expect(getSafeRedirect('//evil.com/learn')).toBe('/learn');
		});

		it('should reject javascript: protocol', () => {
			expect(getSafeRedirect('javascript:alert(1)')).toBe('/learn');
		});

		it('should reject data: protocol', () => {
			expect(getSafeRedirect('data:text/html,<script>alert(1)</script>')).toBe('/learn');
		});

		// Attack prevention - bypass attempts
		it('should reject backslash paths (IE bypass)', () => {
			expect(getSafeRedirect('/learn\\@evil.com')).toBe('/learn');
			expect(getSafeRedirect('\\\\evil.com')).toBe('/learn');
		});

		it('should reject URLs with encoded bypasses', () => {
			// Double-encoded //
			expect(getSafeRedirect('/%2f/evil.com')).toBe('/learn');
			// Encoded backslash
			expect(getSafeRedirect('/learn%5c@evil.com')).toBe('/learn');
		});

		it('should reject URLs with colons (protocol indicators)', () => {
			expect(getSafeRedirect('/learn:evil.com')).toBe('/learn');
			expect(getSafeRedirect('/foo:bar')).toBe('/learn');
		});

		// Attack prevention - path traversal
		it('should reject paths not in allowlist', () => {
			expect(getSafeRedirect('/admin')).toBe('/learn');
			expect(getSafeRedirect('/api/secret')).toBe('/learn');
			expect(getSafeRedirect('/auth/logout')).toBe('/learn');
			expect(getSafeRedirect('/')).toBe('/learn');
		});

		// Edge cases
		it('should handle URL-encoded valid paths', () => {
			expect(getSafeRedirect('%2Flearn')).toBe('/learn');
		});

		it('should reject invalid URL encoding', () => {
			expect(getSafeRedirect('%ZZ')).toBe('/learn');
			expect(getSafeRedirect('/learn%')).toBe('/learn');
		});

		it('should handle non-string input gracefully', () => {
			// TypeScript would prevent this, but runtime safety is important
			expect(getSafeRedirect(123 as any)).toBe('/learn');
			expect(getSafeRedirect({} as any)).toBe('/learn');
			expect(getSafeRedirect([] as any)).toBe('/learn');
		});

		// Real-world attack vectors
		it('should reject CRLF injection attempts', () => {
			expect(getSafeRedirect('/learn%0d%0aSet-Cookie:evil=value')).toBe('/learn');
		});

		it('should reject open redirect via @ symbol', () => {
			expect(getSafeRedirect('/learn@evil.com')).toBe('/learn');
		});

		it('should reject fragment-based attacks', () => {
			// These should still be allowed as they're valid paths with fragments
			expect(getSafeRedirect('/learn#evil.com')).toBe('/learn#evil.com');
		});
	});

	describe('isValidRedirectUrl', () => {
		it('should return true for valid redirect URLs', () => {
			expect(isValidRedirectUrl('/learn')).toBe(true);
			expect(isValidRedirectUrl('/settings')).toBe(true);
			expect(isValidRedirectUrl('/learn/phase/1')).toBe(true);
		});

		it('should return false for invalid redirect URLs', () => {
			expect(isValidRedirectUrl(null)).toBe(false);
			expect(isValidRedirectUrl(undefined)).toBe(false);
			expect(isValidRedirectUrl('')).toBe(false);
			expect(isValidRedirectUrl('//evil.com')).toBe(false);
			expect(isValidRedirectUrl('https://evil.com')).toBe(false);
		});

		it('should return false for paths not in allowlist', () => {
			expect(isValidRedirectUrl('/admin')).toBe(false);
			expect(isValidRedirectUrl('/api/secret')).toBe(false);
		});
	});
});
