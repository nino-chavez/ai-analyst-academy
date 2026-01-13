import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from './types/database';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
} from '$env/static/public';

// Browser client for client-side operations
export function createSupabaseBrowserClient() {
	return createBrowserClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
	);
}

// Cookie interface for server client
interface CookieInterface {
	name: string;
	value: string;
	options?: Record<string, unknown>;
}

// Server client for server-side operations (load functions, form actions)
export function createSupabaseServerClient(
	cookies: {
		getAll: () => { name: string; value: string }[];
		setAll: (cookies: CookieInterface[]) => void;
	}
) {
	return createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
		{
			cookies: {
				getAll() {
					return cookies.getAll();
				},
				setAll(cookiesToSet: CookieInterface[]) {
					cookies.setAll(cookiesToSet);
				}
			}
		}
	);
}

// Type-safe table names
export const TABLES = {
	USER_PROFILES: 'user_profiles',
	MODULE_PROGRESS: 'module_progress',
	LAB_PROGRESS: 'lab_progress',
	PHASE_DELIVERABLES: 'phase_deliverables',
	CAPSTONE_PROJECTS: 'capstone_projects',
	SANDBOX_SESSIONS: 'sandbox_sessions',
	SAVED_PROMPTS: 'saved_prompts',
	REVIEW_QUEUE: 'review_queue'
} as const;
