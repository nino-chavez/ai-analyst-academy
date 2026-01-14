import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const ssr = true;

injectAnalytics({ mode: dev ? 'development' : 'production' });
