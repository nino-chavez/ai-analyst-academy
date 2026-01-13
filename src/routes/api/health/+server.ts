import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface HealthCheck {
	status: 'healthy' | 'degraded' | 'unhealthy';
	timestamp: string;
	version: string;
	checks: {
		database: {
			status: 'up' | 'down';
			latencyMs?: number;
			error?: string;
		};
	};
}

/**
 * Health check endpoint for monitoring and load balancers.
 * GET /api/health
 *
 * Returns:
 * - 200: Service is healthy
 * - 503: Service is unhealthy (database unreachable)
 */
export const GET: RequestHandler = async ({ locals }) => {
	const startTime = Date.now();
	const health: HealthCheck = {
		status: 'healthy',
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || '1.0.0',
		checks: {
			database: {
				status: 'down'
			}
		}
	};

	// Check database connectivity
	try {
		const dbStart = Date.now();
		const { error } = await locals.supabase.from('user_profiles').select('id').limit(1);
		const dbLatency = Date.now() - dbStart;

		if (error) {
			health.checks.database = {
				status: 'down',
				latencyMs: dbLatency,
				error: error.message
			};
			health.status = 'unhealthy';
		} else {
			health.checks.database = {
				status: 'up',
				latencyMs: dbLatency
			};
		}
	} catch (err) {
		health.checks.database = {
			status: 'down',
			error: err instanceof Error ? err.message : 'Unknown error'
		};
		health.status = 'unhealthy';
	}

	// Return appropriate HTTP status
	const httpStatus = health.status === 'healthy' ? 200 : 503;

	return json(health, {
		status: httpStatus,
		headers: {
			'Cache-Control': 'no-store, no-cache, must-revalidate',
			'X-Response-Time': `${Date.now() - startTime}ms`
		}
	});
};
