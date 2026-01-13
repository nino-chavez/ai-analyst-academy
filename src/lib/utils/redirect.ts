/**
 * Validates and sanitizes redirect URLs to prevent open redirect vulnerabilities.
 *
 * Open redirect attacks can be used for phishing - an attacker creates a link like:
 * https://trusted-site.com/callback?next=https://evil-site.com
 * Users see the trusted domain and click, but end up on the malicious site.
 */

/**
 * Allowed paths that can be used as redirect destinations.
 * Add new internal routes here as needed.
 */
const ALLOWED_REDIRECT_PATHS = [
	'/learn',
	'/progress',
	'/settings',
	'/portfolio',
	'/sandbox',
	'/onboarding',
	'/syllabus'
];

/**
 * Default redirect destination when the provided URL is invalid.
 */
const DEFAULT_REDIRECT = '/learn';

/**
 * Validates a redirect URL and returns a safe destination.
 *
 * Rules:
 * 1. Must start with '/' (relative path)
 * 2. Must not contain '//' (prevents protocol-relative URLs like //evil.com)
 * 3. Must not contain '\' or encoded variants (prevents bypass attempts)
 * 4. Path must start with an allowed prefix
 *
 * @param redirectTo - The redirect URL to validate
 * @param defaultPath - Fallback path if validation fails (default: '/learn')
 * @returns A safe redirect path
 */
export function getSafeRedirect(
	redirectTo: string | null | undefined,
	defaultPath: string = DEFAULT_REDIRECT
): string {
	// No redirect provided
	if (!redirectTo) {
		return defaultPath;
	}

	// Must be a string
	if (typeof redirectTo !== 'string') {
		return defaultPath;
	}

	// Decode any URL encoding first to catch bypass attempts
	let decoded: string;
	try {
		decoded = decodeURIComponent(redirectTo);
	} catch {
		// Invalid URL encoding
		return defaultPath;
	}

	// Must start with exactly one forward slash (relative path)
	if (!decoded.startsWith('/') || decoded.startsWith('//')) {
		return defaultPath;
	}

	// Reject backslashes which can be used for bypass attempts
	if (decoded.includes('\\')) {
		return defaultPath;
	}

	// Reject any URL that could be interpreted as absolute
	if (decoded.includes('://') || decoded.includes(':')) {
		return defaultPath;
	}

	// Extract just the path (ignore query strings and fragments for validation)
	const pathOnly = decoded.split('?')[0].split('#')[0];

	// Check against allowed paths (must start with one of them)
	const isAllowed = ALLOWED_REDIRECT_PATHS.some(
		(allowedPath) => pathOnly === allowedPath || pathOnly.startsWith(`${allowedPath}/`)
	);

	if (!isAllowed) {
		return defaultPath;
	}

	// Return the validated path (keep query string if it was a valid path)
	return decoded;
}

/**
 * Validates that a URL is safe for OAuth state parameter.
 * Same rules as getSafeRedirect but returns boolean.
 */
export function isValidRedirectUrl(url: string | null | undefined): boolean {
	if (!url) return false;
	const safe = getSafeRedirect(url, '');
	return safe !== '' && safe === url;
}
