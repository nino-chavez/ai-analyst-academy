/**
 * Simple in-memory rate limiter using sliding window algorithm.
 *
 * Note: This is suitable for single-instance deployments.
 * For multi-instance deployments, consider using Redis or Supabase.
 */

interface RateLimitEntry {
	count: number;
	windowStart: number;
}

interface RateLimiterConfig {
	/** Maximum number of requests allowed in the window */
	maxRequests: number;
	/** Window size in milliseconds */
	windowMs: number;
}

// Store for rate limit entries: Map<key, entry>
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupOldEntries(windowMs: number): void {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL) {
		return;
	}

	lastCleanup = now;
	const threshold = now - windowMs * 2;

	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.windowStart < threshold) {
			rateLimitStore.delete(key);
		}
	}
}

/**
 * Check if a request should be rate limited.
 *
 * @param key Unique identifier for the rate limit bucket (e.g., userId, IP + endpoint)
 * @param config Rate limiting configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
	key: string,
	config: RateLimiterConfig
): { allowed: boolean; remaining: number; resetMs: number } {
	const now = Date.now();
	const { maxRequests, windowMs } = config;

	// Run periodic cleanup
	cleanupOldEntries(windowMs);

	const entry = rateLimitStore.get(key);

	// No existing entry - create new window
	if (!entry) {
		rateLimitStore.set(key, { count: 1, windowStart: now });
		return { allowed: true, remaining: maxRequests - 1, resetMs: windowMs };
	}

	// Check if current window has expired
	const windowAge = now - entry.windowStart;
	if (windowAge >= windowMs) {
		// Start a new window
		rateLimitStore.set(key, { count: 1, windowStart: now });
		return { allowed: true, remaining: maxRequests - 1, resetMs: windowMs };
	}

	// Within current window - check limit
	if (entry.count >= maxRequests) {
		const resetMs = windowMs - windowAge;
		return { allowed: false, remaining: 0, resetMs };
	}

	// Increment count
	entry.count += 1;
	const remaining = maxRequests - entry.count;
	const resetMs = windowMs - windowAge;

	return { allowed: true, remaining, resetMs };
}

/**
 * Pre-configured rate limiters for different endpoints
 */
export const RateLimits = {
	/** Chat API: 60 requests per minute per user */
	chat: { maxRequests: 60, windowMs: 60 * 1000 },

	/** Auth attempts: 10 per minute per IP */
	auth: { maxRequests: 10, windowMs: 60 * 1000 },

	/** API key operations: 20 per minute per user */
	apiKeys: { maxRequests: 20, windowMs: 60 * 1000 },

	/** General API: 100 requests per minute per user */
	general: { maxRequests: 100, windowMs: 60 * 1000 }
} as const;

/**
 * Create a rate limit key from user ID and endpoint
 */
export function createRateLimitKey(userId: string, endpoint: string): string {
	return `${userId}:${endpoint}`;
}

/**
 * Create a rate limit key from IP and endpoint (for unauthenticated routes)
 */
export function createIpRateLimitKey(ip: string, endpoint: string): string {
	return `ip:${ip}:${endpoint}`;
}

/**
 * Get client IP from request headers
 * Handles common proxy headers
 */
export function getClientIp(request: Request): string {
	// Check standard proxy headers
	const forwardedFor = request.headers.get('x-forwarded-for');
	if (forwardedFor) {
		// Take the first IP (original client)
		return forwardedFor.split(',')[0].trim();
	}

	const realIp = request.headers.get('x-real-ip');
	if (realIp) {
		return realIp.trim();
	}

	// Fallback to a generic key
	return 'unknown';
}

/**
 * Reset rate limit for testing purposes
 */
export function resetRateLimit(key: string): void {
	rateLimitStore.delete(key);
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
	rateLimitStore.clear();
}
