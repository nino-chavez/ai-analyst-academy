/**
 * Structured Logging Utility
 *
 * Provides consistent, structured logging across the application.
 * In production, logs are JSON-formatted for easy parsing by log aggregators.
 * In development, logs are human-readable.
 *
 * SECURITY: This logger automatically redacts sensitive fields to prevent
 * accidental exposure of secrets in logs.
 */

import { dev } from '$app/environment';

// Fields that should never be logged
const SENSITIVE_FIELDS = [
	'password',
	'apiKey',
	'api_key',
	'byokKey',
	'token',
	'secret',
	'authorization',
	'cookie',
	'session',
	'encrypted_key',
	'key_hint'
];

// Regex patterns for sensitive data
const SENSITIVE_PATTERNS = [
	/sk-[a-zA-Z0-9]{32,}/g, // OpenAI API keys
	/sk-ant-[a-zA-Z0-9-]+/g, // Anthropic API keys
	/AIza[a-zA-Z0-9_-]{35}/g, // Google API keys
	/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g // JWTs
];

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
	[key: string]: unknown;
}

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: LogContext;
	error?: {
		name: string;
		message: string;
		stack?: string;
	};
}

/**
 * Redacts sensitive values from an object recursively
 */
function redactSensitive(obj: unknown, depth = 0): unknown {
	// Prevent infinite recursion
	if (depth > 10) return '[MAX_DEPTH_EXCEEDED]';

	if (obj === null || obj === undefined) return obj;

	if (typeof obj === 'string') {
		let redacted = obj;
		for (const pattern of SENSITIVE_PATTERNS) {
			redacted = redacted.replace(pattern, '[REDACTED]');
		}
		return redacted;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => redactSensitive(item, depth + 1));
	}

	if (typeof obj === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			const lowerKey = key.toLowerCase();
			if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()))) {
				result[key] = '[REDACTED]';
			} else {
				result[key] = redactSensitive(value, depth + 1);
			}
		}
		return result;
	}

	return obj;
}

/**
 * Formats a log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
	if (dev) {
		// Human-readable format for development
		const parts = [`[${entry.level.toUpperCase()}]`, entry.message];

		if (entry.context && Object.keys(entry.context).length > 0) {
			parts.push(JSON.stringify(entry.context, null, 2));
		}

		if (entry.error) {
			parts.push(`\n  Error: ${entry.error.name}: ${entry.error.message}`);
			if (entry.error.stack) {
				parts.push(`\n  Stack: ${entry.error.stack}`);
			}
		}

		return parts.join(' ');
	}

	// JSON format for production (easy to parse by log aggregators)
	return JSON.stringify(entry);
}

/**
 * Creates a log entry and outputs it
 */
function log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
	const entry: LogEntry = {
		timestamp: new Date().toISOString(),
		level,
		message,
		context: context ? (redactSensitive(context) as LogContext) : undefined
	};

	if (error) {
		entry.error = {
			name: error.name,
			message: error.message,
			stack: dev ? error.stack : undefined // Only include stack in dev
		};
	}

	const formatted = formatLogEntry(entry);

	switch (level) {
		case 'debug':
			if (dev) console.debug(formatted);
			break;
		case 'info':
			console.info(formatted);
			break;
		case 'warn':
			console.warn(formatted);
			break;
		case 'error':
			console.error(formatted);
			break;
	}
}

/**
 * Structured logger with automatic sensitive data redaction
 *
 * @example
 * // Simple message
 * logger.info('User logged in');
 *
 * // With context
 * logger.info('User logged in', { userId: '123', email: 'user@example.com' });
 *
 * // With error
 * logger.error('Failed to fetch data', { url: '/api/data' }, new Error('Network error'));
 *
 * // Sensitive data is automatically redacted
 * logger.info('Auth attempt', { password: 'secret123' }); // password will be [REDACTED]
 */
export const logger = {
	/**
	 * Debug-level logging (only shown in development)
	 */
	debug: (message: string, context?: LogContext): void => {
		log('debug', message, context);
	},

	/**
	 * Info-level logging for normal operations
	 */
	info: (message: string, context?: LogContext): void => {
		log('info', message, context);
	},

	/**
	 * Warning-level logging for concerning but non-critical issues
	 */
	warn: (message: string, context?: LogContext): void => {
		log('warn', message, context);
	},

	/**
	 * Error-level logging for failures and exceptions
	 */
	error: (message: string, error: Error, context?: LogContext): void => {
		log('error', message, context, error);
	}
};

export default logger;
