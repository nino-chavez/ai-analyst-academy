import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase';

// Routes that require authentication
const PROTECTED_ROUTES = ['/settings', '/progress', '/portfolio', '/sandbox'];

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

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
