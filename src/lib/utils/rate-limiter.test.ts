/**
 * Tests for the rate limiter utility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	checkRateLimit,
	createRateLimitKey,
	createIpRateLimitKey,
	getClientIp,
	resetRateLimit,
	clearAllRateLimits,
	RateLimits
} from './rate-limiter';

describe('Rate Limiter', () => {
	beforeEach(() => {
		clearAllRateLimits();
	});

	describe('checkRateLimit', () => {
		it('should allow requests within limit', () => {
			const key = 'test-user:endpoint';
			const config = { maxRequests: 5, windowMs: 60000 };

			// First 5 requests should be allowed
			for (let i = 0; i < 5; i++) {
				const result = checkRateLimit(key, config);
				expect(result.allowed).toBe(true);
				expect(result.remaining).toBe(4 - i);
			}
		});

		it('should block requests exceeding limit', () => {
			const key = 'test-user:endpoint';
			const config = { maxRequests: 3, windowMs: 60000 };

			// Use up the limit
			for (let i = 0; i < 3; i++) {
				checkRateLimit(key, config);
			}

			// Next request should be blocked
			const result = checkRateLimit(key, config);
			expect(result.allowed).toBe(false);
			expect(result.remaining).toBe(0);
			expect(result.resetMs).toBeGreaterThan(0);
			expect(result.resetMs).toBeLessThanOrEqual(60000);
		});

		it('should reset after window expires', async () => {
			const key = 'test-user:endpoint';
			const config = { maxRequests: 2, windowMs: 50 }; // 50ms window for testing

			// Use up the limit
			checkRateLimit(key, config);
			checkRateLimit(key, config);

			// Should be blocked
			expect(checkRateLimit(key, config).allowed).toBe(false);

			// Wait for window to expire
			await new Promise((resolve) => setTimeout(resolve, 60));

			// Should be allowed again
			const result = checkRateLimit(key, config);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(1);
		});

		it('should track different keys independently', () => {
			const config = { maxRequests: 2, windowMs: 60000 };

			// Use up limit for user1
			checkRateLimit('user1:endpoint', config);
			checkRateLimit('user1:endpoint', config);
			expect(checkRateLimit('user1:endpoint', config).allowed).toBe(false);

			// user2 should still be allowed
			const result = checkRateLimit('user2:endpoint', config);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(1);
		});
	});

	describe('createRateLimitKey', () => {
		it('should create key from userId and endpoint', () => {
			const key = createRateLimitKey('user123', 'chat');
			expect(key).toBe('user123:chat');
		});
	});

	describe('createIpRateLimitKey', () => {
		it('should create key from IP and endpoint', () => {
			const key = createIpRateLimitKey('192.168.1.1', 'auth');
			expect(key).toBe('ip:192.168.1.1:auth');
		});
	});

	describe('getClientIp', () => {
		it('should extract IP from x-forwarded-for header', () => {
			const request = new Request('https://example.com', {
				headers: {
					'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178'
				}
			});
			expect(getClientIp(request)).toBe('203.0.113.195');
		});

		it('should extract IP from x-real-ip header', () => {
			const request = new Request('https://example.com', {
				headers: {
					'x-real-ip': '203.0.113.195'
				}
			});
			expect(getClientIp(request)).toBe('203.0.113.195');
		});

		it('should prefer x-forwarded-for over x-real-ip', () => {
			const request = new Request('https://example.com', {
				headers: {
					'x-forwarded-for': '10.0.0.1',
					'x-real-ip': '10.0.0.2'
				}
			});
			expect(getClientIp(request)).toBe('10.0.0.1');
		});

		it('should return unknown when no IP headers present', () => {
			const request = new Request('https://example.com');
			expect(getClientIp(request)).toBe('unknown');
		});
	});

	describe('resetRateLimit', () => {
		it('should reset a specific rate limit key', () => {
			const key = 'test-user:endpoint';
			const config = { maxRequests: 2, windowMs: 60000 };

			// Use up the limit
			checkRateLimit(key, config);
			checkRateLimit(key, config);
			expect(checkRateLimit(key, config).allowed).toBe(false);

			// Reset
			resetRateLimit(key);

			// Should be allowed again
			const result = checkRateLimit(key, config);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(1);
		});
	});

	describe('RateLimits presets', () => {
		it('should have chat rate limit configured', () => {
			expect(RateLimits.chat).toEqual({
				maxRequests: 60,
				windowMs: 60000
			});
		});

		it('should have auth rate limit configured', () => {
			expect(RateLimits.auth).toEqual({
				maxRequests: 10,
				windowMs: 60000
			});
		});

		it('should have apiKeys rate limit configured', () => {
			expect(RateLimits.apiKeys).toEqual({
				maxRequests: 20,
				windowMs: 60000
			});
		});

		it('should have general rate limit configured', () => {
			expect(RateLimits.general).toEqual({
				maxRequests: 100,
				windowMs: 60000
			});
		});
	});
});
