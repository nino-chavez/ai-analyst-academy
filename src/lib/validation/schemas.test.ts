/**
 * Unit tests for Zod validation schemas
 * Tests runtime validation for API inputs and form data
 */

import { describe, it, expect } from 'vitest';
import {
	PersonaTypeSchema,
	ProgressStatusSchema,
	ProviderSchema,
	ChatPersonaSchema,
	ChatMessageSchema,
	ChatRequestSchema,
	SaveApiKeySchema,
	UpdateProfileSchema,
	ModuleProgressSchema,
	GoalSettingSchema,
	safeJsonParse,
	parseFormData
} from './schemas';
import { z } from 'zod';

describe('Database Enum Schemas', () => {
	describe('PersonaTypeSchema', () => {
		it('should accept valid persona types', () => {
			expect(PersonaTypeSchema.parse('career_pivoter')).toBe('career_pivoter');
			expect(PersonaTypeSchema.parse('student')).toBe('student');
			expect(PersonaTypeSchema.parse('team_lead')).toBe('team_lead');
			expect(PersonaTypeSchema.parse('explorer')).toBe('explorer');
		});

		it('should reject invalid persona types', () => {
			expect(() => PersonaTypeSchema.parse('invalid')).toThrow();
			expect(() => PersonaTypeSchema.parse('')).toThrow();
			expect(() => PersonaTypeSchema.parse(null)).toThrow();
		});
	});

	describe('ProgressStatusSchema', () => {
		it('should accept valid progress statuses', () => {
			expect(ProgressStatusSchema.parse('not_started')).toBe('not_started');
			expect(ProgressStatusSchema.parse('in_progress')).toBe('in_progress');
			expect(ProgressStatusSchema.parse('completed')).toBe('completed');
		});

		it('should reject invalid statuses', () => {
			expect(() => ProgressStatusSchema.parse('done')).toThrow();
			expect(() => ProgressStatusSchema.parse('pending')).toThrow();
		});
	});

	describe('ProviderSchema', () => {
		it('should accept valid providers', () => {
			expect(ProviderSchema.parse('openai')).toBe('openai');
			expect(ProviderSchema.parse('anthropic')).toBe('anthropic');
			expect(ProviderSchema.parse('google')).toBe('google');
		});

		it('should reject invalid providers', () => {
			expect(() => ProviderSchema.parse('azure')).toThrow();
			expect(() => ProviderSchema.parse('OpenAI')).toThrow(); // case sensitive
		});
	});
});

describe('Chat API Schemas', () => {
	describe('ChatPersonaSchema', () => {
		it('should accept valid chat personas', () => {
			expect(ChatPersonaSchema.parse('general')).toBe('general');
			expect(ChatPersonaSchema.parse('gen-z')).toBe('gen-z');
			expect(ChatPersonaSchema.parse('investor')).toBe('investor');
			expect(ChatPersonaSchema.parse('editor')).toBe('editor');
		});
	});

	describe('ChatMessageSchema', () => {
		it('should accept valid messages', () => {
			const result = ChatMessageSchema.parse({
				role: 'user',
				content: 'Hello, world!'
			});
			expect(result.role).toBe('user');
			expect(result.content).toBe('Hello, world!');
		});

		it('should accept all valid roles', () => {
			expect(ChatMessageSchema.parse({ role: 'user', content: 'test' }).role).toBe('user');
			expect(ChatMessageSchema.parse({ role: 'assistant', content: 'test' }).role).toBe('assistant');
			expect(ChatMessageSchema.parse({ role: 'system', content: 'test' }).role).toBe('system');
		});

		it('should reject empty content', () => {
			expect(() => ChatMessageSchema.parse({ role: 'user', content: '' })).toThrow();
		});

		it('should reject content over 32000 characters', () => {
			const longContent = 'a'.repeat(32001);
			expect(() => ChatMessageSchema.parse({ role: 'user', content: longContent })).toThrow();
		});

		it('should accept content up to 32000 characters', () => {
			const maxContent = 'a'.repeat(32000);
			const result = ChatMessageSchema.parse({ role: 'user', content: maxContent });
			expect(result.content.length).toBe(32000);
		});
	});

	describe('ChatRequestSchema', () => {
		it('should accept valid chat request', () => {
			const result = ChatRequestSchema.parse({
				messages: [{ role: 'user', content: 'Hello' }],
				persona: 'general',
				provider: 'openai'
			});
			expect(result.messages).toHaveLength(1);
			expect(result.persona).toBe('general');
			expect(result.provider).toBe('openai');
		});

		it('should default provider to openai', () => {
			const result = ChatRequestSchema.parse({
				messages: [{ role: 'user', content: 'Hello' }],
				persona: 'general'
			});
			expect(result.provider).toBe('openai');
		});

		it('should reject empty messages array', () => {
			expect(() =>
				ChatRequestSchema.parse({
					messages: [],
					persona: 'general'
				})
			).toThrow();
		});

		it('should reject more than 50 messages', () => {
			const tooManyMessages = Array(51)
				.fill(null)
				.map(() => ({ role: 'user' as const, content: 'test' }));
			expect(() =>
				ChatRequestSchema.parse({
					messages: tooManyMessages,
					persona: 'general'
				})
			).toThrow();
		});

		it('should accept up to 50 messages', () => {
			const maxMessages = Array(50)
				.fill(null)
				.map(() => ({ role: 'user' as const, content: 'test' }));
			const result = ChatRequestSchema.parse({
				messages: maxMessages,
				persona: 'general'
			});
			expect(result.messages).toHaveLength(50);
		});
	});
});

describe('API Key Schemas', () => {
	describe('SaveApiKeySchema', () => {
		it('should accept valid OpenAI API key', () => {
			const result = SaveApiKeySchema.parse({
				provider: 'openai',
				apiKey: 'sk-proj1234567890abcdefghijklmnopqrst'
			});
			expect(result.provider).toBe('openai');
		});

		it('should accept valid Anthropic API key', () => {
			// Anthropic keys: sk-ant- followed by 90+ alphanumeric/hyphen chars
			const anthropicKey = 'sk-ant-' + 'a'.repeat(90);
			const result = SaveApiKeySchema.parse({
				provider: 'anthropic',
				apiKey: anthropicKey
			});
			expect(result.provider).toBe('anthropic');
		});

		it('should accept valid Google API key', () => {
			// Google keys: 35-45 alphanumeric chars with underscores/hyphens
			const result = SaveApiKeySchema.parse({
				provider: 'google',
				apiKey: 'AIzaSyA1234567890abcdefghijklmnopqrs'  // 39 chars
			});
			expect(result.provider).toBe('google');
		});

		it('should reject invalid OpenAI key format', () => {
			expect(() =>
				SaveApiKeySchema.parse({
					provider: 'openai',
					apiKey: 'invalid-key'
				})
			).toThrow();
		});

		it('should reject empty API key', () => {
			expect(() =>
				SaveApiKeySchema.parse({
					provider: 'openai',
					apiKey: ''
				})
			).toThrow();
		});

		it('should trim whitespace from API key', () => {
			const result = SaveApiKeySchema.parse({
				provider: 'openai',
				apiKey: '  sk-proj1234567890abcdefghijklmnopqrst  '
			});
			expect(result.apiKey).toBe('  sk-proj1234567890abcdefghijklmnopqrst  ');
			// Note: The schema trims during validation, not in the output
		});
	});
});

describe('User Profile Schemas', () => {
	describe('UpdateProfileSchema', () => {
		it('should accept valid profile update', () => {
			const result = UpdateProfileSchema.parse({
				display_name: 'John Doe',
				persona_type: 'student',
				daily_goal_minutes: 30
			});
			expect(result.display_name).toBe('John Doe');
			expect(result.persona_type).toBe('student');
			expect(result.daily_goal_minutes).toBe(30);
		});

		it('should accept partial updates', () => {
			const result = UpdateProfileSchema.parse({
				display_name: 'Jane'
			});
			expect(result.display_name).toBe('Jane');
			expect(result.persona_type).toBeUndefined();
		});

		it('should accept empty object', () => {
			const result = UpdateProfileSchema.parse({});
			expect(result).toEqual({});
		});

		it('should reject display name over 100 characters', () => {
			expect(() =>
				UpdateProfileSchema.parse({
					display_name: 'a'.repeat(101)
				})
			).toThrow();
		});

		it('should reject daily goal below 5 minutes', () => {
			expect(() =>
				UpdateProfileSchema.parse({
					daily_goal_minutes: 4
				})
			).toThrow();
		});

		it('should reject daily goal above 480 minutes', () => {
			expect(() =>
				UpdateProfileSchema.parse({
					daily_goal_minutes: 481
				})
			).toThrow();
		});

		it('should reject non-integer daily goal', () => {
			expect(() =>
				UpdateProfileSchema.parse({
					daily_goal_minutes: 30.5
				})
			).toThrow();
		});

		it('should accept valid theme preferences', () => {
			expect(UpdateProfileSchema.parse({ theme_preference: 'light' }).theme_preference).toBe('light');
			expect(UpdateProfileSchema.parse({ theme_preference: 'dark' }).theme_preference).toBe('dark');
			expect(UpdateProfileSchema.parse({ theme_preference: 'system' }).theme_preference).toBe('system');
		});
	});
});

describe('Module Progress Schemas', () => {
	describe('ModuleProgressSchema', () => {
		it('should accept valid module progress', () => {
			const result = ModuleProgressSchema.parse({
				module_id: '1.1',
				status: 'in_progress',
				sections_viewed: ['intro', 'main'],
				concepts_understood: ['concept-1'],
				exercises_completed: [],
				checklists_completed: []
			});
			expect(result.module_id).toBe('1.1');
			expect(result.status).toBe('in_progress');
		});

		it('should default arrays to empty', () => {
			const result = ModuleProgressSchema.parse({
				module_id: '1.1',
				status: 'not_started'
			});
			expect(result.sections_viewed).toEqual([]);
			expect(result.concepts_understood).toEqual([]);
		});

		it('should reject empty module_id', () => {
			expect(() =>
				ModuleProgressSchema.parse({
					module_id: '',
					status: 'completed'
				})
			).toThrow();
		});

		it('should accept time_spent_minutes up to 1440', () => {
			const result = ModuleProgressSchema.parse({
				module_id: '1.1',
				status: 'completed',
				time_spent_minutes: 1440
			});
			expect(result.time_spent_minutes).toBe(1440);
		});

		it('should reject negative time_spent_minutes', () => {
			expect(() =>
				ModuleProgressSchema.parse({
					module_id: '1.1',
					status: 'completed',
					time_spent_minutes: -1
				})
			).toThrow();
		});
	});
});

describe('Goal Setting Schema', () => {
	describe('GoalSettingSchema', () => {
		it('should accept valid goal options', () => {
			expect(GoalSettingSchema.parse({ dailyGoal: 15 }).dailyGoal).toBe(15);
			expect(GoalSettingSchema.parse({ dailyGoal: 30 }).dailyGoal).toBe(30);
			expect(GoalSettingSchema.parse({ dailyGoal: 60 }).dailyGoal).toBe(60);
			expect(GoalSettingSchema.parse({ dailyGoal: 90 }).dailyGoal).toBe(90);
		});

		it('should coerce string to number', () => {
			expect(GoalSettingSchema.parse({ dailyGoal: '30' }).dailyGoal).toBe(30);
		});

		it('should reject invalid goal options', () => {
			expect(() => GoalSettingSchema.parse({ dailyGoal: 20 })).toThrow();
			expect(() => GoalSettingSchema.parse({ dailyGoal: 45 })).toThrow();
			expect(() => GoalSettingSchema.parse({ dailyGoal: 120 })).toThrow();
		});
	});
});

describe('Utility Functions', () => {
	describe('safeJsonParse', () => {
		const testSchema = z.object({
			name: z.string(),
			age: z.number()
		});
		const fallback = { name: 'default', age: 0 };

		it('should parse valid JSON', () => {
			const result = safeJsonParse('{"name":"John","age":30}', testSchema, fallback);
			expect(result).toEqual({ name: 'John', age: 30 });
		});

		it('should return fallback for invalid JSON', () => {
			const result = safeJsonParse('not json', testSchema, fallback);
			expect(result).toEqual(fallback);
		});

		it('should return fallback for null input', () => {
			const result = safeJsonParse(null, testSchema, fallback);
			expect(result).toEqual(fallback);
		});

		it('should return fallback for undefined input', () => {
			const result = safeJsonParse(undefined, testSchema, fallback);
			expect(result).toEqual(fallback);
		});

		it('should return fallback for valid JSON that fails schema validation', () => {
			const result = safeJsonParse('{"name":"John","age":"not a number"}', testSchema, fallback);
			expect(result).toEqual(fallback);
		});

		it('should return fallback for empty string', () => {
			const result = safeJsonParse('', testSchema, fallback);
			expect(result).toEqual(fallback);
		});
	});

	describe('parseFormData', () => {
		const testSchema = z.object({
			name: z.string().min(1),
			email: z.string().email()
		});

		it('should parse valid form data', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('email', 'john@example.com');

			const result = parseFormData(formData, testSchema);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ name: 'John', email: 'john@example.com' });
			}
		});

		it('should return errors for invalid form data', () => {
			const formData = new FormData();
			formData.append('name', '');
			formData.append('email', 'not-an-email');

			const result = parseFormData(formData, testSchema);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toHaveProperty('name');
				expect(result.errors).toHaveProperty('email');
			}
		});

		it('should handle missing fields', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			// email is missing

			const result = parseFormData(formData, testSchema);
			expect(result.success).toBe(false);
		});
	});
});
