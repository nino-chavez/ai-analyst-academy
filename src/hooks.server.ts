import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase';
import { dev } from '$app/environment';

// Routes that require authentication
const PROTECTED_ROUTES = ['/settings', '/progress', '/portfolio', '/sandbox'];

/**
 * Security headers to protect against common web vulnerabilities.
 * These are applied to all responses.
 */
const securityHeaders: Record<string, string> = {
	// Prevent clickjacking attacks by disallowing embedding in iframes
	'X-Frame-Options': 'DENY',

	// Prevent MIME type sniffing which can lead to security vulnerabilities
	'X-Content-Type-Options': 'nosniff',

	// Enable XSS protection in older browsers (modern browsers don't need this)
	'X-XSS-Protection': '1; mode=block',

	// Control what information is sent in the Referer header
	'Referrer-Policy': 'strict-origin-when-cross-origin',

	// Restrict browser features and APIs
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',

	// Content Security Policy - restrict resource loading
	// Note: 'unsafe-inline' for styles is needed for Svelte's scoped styles
	// In production, consider using nonces for inline scripts
	'Content-Security-Policy': [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for some dev tools
		"style-src 'self' 'unsafe-inline'", // needed for Svelte scoped styles
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self' https://*.supabase.co https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'"
	].join('; ')
};

// HSTS header only in production (not localhost)
const hstsHeader = dev
	? {}
	: { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' };

// Routes that should redirect authenticated users away (auth pages)
const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client for the request
	event.locals.supabase = createSupabaseServerClient({
		getAll: () => event.cookies.getAll(),
		setAll: (cookiesToSet) => {
			cookiesToSet.forEach(({ name, value, options }) => {
				event.cookies.set(name, value, { path: '/', ...options });
			});
		}
	});

	// Helper to get session (convenience method)
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		// Verify the user to ensure the session is valid
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			// JWT validation failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Check route protection
	const { pathname } = event.url;
	const { session } = await event.locals.safeGetSession();

	// Redirect unauthenticated users from protected routes
	const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
	if (isProtectedRoute && !session) {
		const redirectUrl = encodeURIComponent(pathname);
		redirect(303, `/auth/login?next=${redirectUrl}`);
	}

	// Redirect authenticated users away from auth pages
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
	if (isAuthRoute && session) {
		redirect(303, '/learn');
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});

	// Apply security headers to all responses
	const allSecurityHeaders = { ...securityHeaders, ...hstsHeader };
	for (const [header, value] of Object.entries(allSecurityHeaders)) {
		response.headers.set(header, value);
	}

	return response;
};
