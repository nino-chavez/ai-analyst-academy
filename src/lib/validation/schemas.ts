/**
 * Zod validation schemas for runtime input validation.
 * These schemas ensure type safety at runtime for user inputs and API requests.
 */

import { z } from 'zod';

// ============================================================================
// Database Enum Schemas
// These match the CHECK constraints in the database
// ============================================================================

/**
 * User persona types - must match database CHECK constraint
 */
export const PersonaTypeSchema = z.enum([
	'career_pivoter',
	'student',
	'team_lead',
	'explorer'
]);
export type PersonaType = z.infer<typeof PersonaTypeSchema>;

/**
 * Progress status values - must match database CHECK constraint
 */
export const ProgressStatusSchema = z.enum(['not_started', 'in_progress', 'completed']);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

/**
 * API provider types for BYOK (Bring Your Own Key) mode
 */
export const ByokProviderSchema = z.enum(['openai', 'anthropic', 'google']);
export type ByokProvider = z.infer<typeof ByokProviderSchema>;

/**
 * All provider types including platform-provided OpenRouter
 */
export const ProviderSchema = z.enum(['openrouter', 'openai', 'anthropic', 'google']);
export type Provider = z.infer<typeof ProviderSchema>;

// ============================================================================
// User Profile Schemas
// ============================================================================

/**
 * Schema for updating user profile
 */
export const UpdateProfileSchema = z.object({
	display_name: z
		.string()
		.min(1, 'Display name is required')
		.max(100, 'Display name must be less than 100 characters')
		.optional(),
	persona_type: PersonaTypeSchema.optional(),
	daily_goal_minutes: z
		.number()
		.int('Goal must be a whole number')
		.min(5, 'Minimum goal is 5 minutes')
		.max(480, 'Maximum goal is 8 hours')
		.optional(),
	timezone: z.string().max(100).optional(),
	theme_preference: z.enum(['light', 'dark', 'system']).optional()
});
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// ============================================================================
// Module Progress Schemas
// ============================================================================

/**
 * Schema for saving module progress
 */
export const ModuleProgressSchema = z.object({
	module_id: z.string().min(1, 'Module ID is required'),
	status: ProgressStatusSchema,
	sections_viewed: z.array(z.string()).default([]),
	concepts_understood: z.array(z.string()).default([]),
	exercises_completed: z.array(z.string()).default([]),
	checklists_completed: z.array(z.string()).default([]),
	time_spent_minutes: z.number().int().min(0).max(1440).optional()
});
export type ModuleProgress = z.infer<typeof ModuleProgressSchema>;

/**
 * Schema for form data submission of module progress
 */
export const ModuleProgressFormSchema = z.object({
	sectionId: z.string().optional(),
	conceptId: z.string().optional(),
	conceptUnderstood: z.enum(['true', 'false']).optional(),
	exerciseId: z.string().optional(),
	exerciseCompleted: z.enum(['true', 'false']).optional(),
	checklistId: z.string().optional(),
	itemId: z.string().optional(),
	itemCompleted: z.enum(['true', 'false']).optional(),
	sectionsViewed: z.string().optional(), // JSON string of array
	conceptsUnderstood: z.string().optional(), // JSON string of array
	exercisesCompleted: z.string().optional(), // JSON string of array
	checklistsCompleted: z.string().optional() // JSON string of array
});

// ============================================================================
// Chat API Schemas
// ============================================================================

/**
 * Valid chat personas
 */
export const ChatPersonaSchema = z.enum(['general', 'gen-z', 'investor', 'editor']);
export type ChatPersona = z.infer<typeof ChatPersonaSchema>;

/**
 * Chat message role
 */
export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);

/**
 * Single chat message
 */
export const ChatMessageSchema = z.object({
	role: MessageRoleSchema,
	content: z
		.string()
		.min(1, 'Message cannot be empty')
		.max(32000, 'Message is too long (max 32000 characters)')
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * Chat API request body
 * Supports two modes:
 * 1. Default (OpenRouter): No byokKey needed, uses platform API key
 * 2. BYOK: Client sends their API key per-request (never stored server-side)
 */
export const ChatRequestSchema = z.object({
	messages: z
		.array(ChatMessageSchema)
		.min(1, 'At least one message is required')
		.max(50, 'Too many messages in conversation (max 50)'),
	persona: ChatPersonaSchema,
	provider: ProviderSchema.default('openrouter'),
	// Optional: Client-side BYOK key (only sent per-request, never stored)
	byokKey: z.string().min(1).optional()
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ============================================================================
// API Key Schemas (for client-side BYOK validation)
// ============================================================================

/**
 * API key patterns by BYOK provider
 */
const BYOK_KEY_PATTERNS: Record<ByokProvider, RegExp> = {
	openai: /^sk-[a-zA-Z0-9]{32,}$/,
	anthropic: /^sk-ant-[a-zA-Z0-9-]{90,}$/,
	google: /^[a-zA-Z0-9_-]{35,45}$/
};

/**
 * Validate a BYOK API key format (used client-side before sending)
 */
export function validateByokKey(provider: ByokProvider, key: string): boolean {
	const pattern = BYOK_KEY_PATTERNS[provider];
	return pattern.test(key.trim());
}

/**
 * Schema for client-side BYOK key validation
 */
export const ByokKeySchema = z
	.object({
		provider: ByokProviderSchema,
		apiKey: z.string().min(1, 'API key is required')
	})
	.refine(
		(data) => {
			const pattern = BYOK_KEY_PATTERNS[data.provider];
			return pattern.test(data.apiKey.trim());
		},
		{
			message: 'Invalid API key format',
			path: ['apiKey']
		}
	);
export type ByokKey = z.infer<typeof ByokKeySchema>;

// ============================================================================
// Onboarding Schemas
// ============================================================================

/**
 * Role selection form
 */
export const RoleSelectionSchema = z.object({
	personaType: PersonaTypeSchema
});

/**
 * Goal setting form - valid daily minute options
 */
export const GoalSettingSchema = z.object({
	dailyGoal: z.coerce
		.number()
		.int()
		.refine((val) => [15, 30, 60, 90].includes(val), {
			message: 'Invalid goal option'
		})
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Safely parse JSON with Zod validation
 */
export function safeJsonParse<T>(
	jsonString: string | null | undefined,
	schema: z.ZodSchema<T>,
	fallback: T
): T {
	if (!jsonString) return fallback;

	try {
		const parsed = JSON.parse(jsonString);
		const result = schema.safeParse(parsed);
		return result.success ? result.data : fallback;
	} catch {
		return fallback;
	}
}

/**
 * Parse form data with a schema, returning errors for invalid fields
 */
export function parseFormData<T>(
	formData: FormData,
	schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
	const rawData: Record<string, unknown> = {};

	for (const [key, value] of formData.entries()) {
		rawData[key] = value;
	}

	const result = schema.safeParse(rawData);

	if (result.success) {
		return { success: true, data: result.data };
	}

	const errors: Record<string, string> = {};
	for (const issue of result.error.issues) {
		const path = issue.path.join('.');
		errors[path] = issue.message;
	}

	return { success: false, errors };
}
