/**
 * Unit tests for onboarding server actions
 * Tests data validation and transformation for role-selection and goal-setting
 */

import { describe, it, expect } from 'vitest';
import { RoleSelectionSchema, GoalSettingSchema, PersonaTypeSchema } from '$lib/validation/schemas';

// Mock FormData for testing
function createFormData(data: Record<string, string>): FormData {
	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return formData;
}

describe('Onboarding - Role Selection', () => {
	describe('PersonaTypeSchema validation', () => {
		const validPersonas = ['career_pivoter', 'student', 'team_lead', 'explorer'];

		it('should accept all valid persona types', () => {
			for (const persona of validPersonas) {
				expect(() => PersonaTypeSchema.parse(persona)).not.toThrow();
				expect(PersonaTypeSchema.parse(persona)).toBe(persona);
			}
		});

		it('should reject invalid persona types', () => {
			const invalidPersonas = ['admin', 'teacher', 'manager', '', null, undefined, 123];
			for (const persona of invalidPersonas) {
				expect(() => PersonaTypeSchema.parse(persona)).toThrow();
			}
		});
	});

	describe('RoleSelectionSchema validation', () => {
		it('should validate correct role selection form data', () => {
			const result = RoleSelectionSchema.safeParse({ personaType: 'student' });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.personaType).toBe('student');
			}
		});

		it('should reject missing personaType', () => {
			const result = RoleSelectionSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it('should reject invalid personaType', () => {
			const result = RoleSelectionSchema.safeParse({ personaType: 'invalid' });
			expect(result.success).toBe(false);
		});
	});

	describe('Form data extraction for role selection', () => {
		it('should correctly extract personaType from FormData', () => {
			const formData = createFormData({ personaType: 'career_pivoter' });
			const personaType = formData.get('personaType') as string;
			expect(personaType).toBe('career_pivoter');
		});

		it('should handle empty personaType', () => {
			const formData = createFormData({ personaType: '' });
			const personaType = formData.get('personaType') as string;
			expect(personaType).toBe('');
			// Server should reject empty string
			const result = RoleSelectionSchema.safeParse({ personaType });
			expect(result.success).toBe(false);
		});

		it('should handle null personaType (missing field)', () => {
			const formData = new FormData();
			const personaType = formData.get('personaType');
			expect(personaType).toBeNull();
		});
	});
});

describe('Onboarding - Goal Setting', () => {
	describe('GoalSettingSchema validation', () => {
		const validGoals = [15, 30, 60, 90];

		it('should accept all valid goal options', () => {
			for (const goal of validGoals) {
				const result = GoalSettingSchema.safeParse({ dailyGoal: goal });
				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.dailyGoal).toBe(goal);
				}
			}
		});

		it('should accept string representations of valid goals (coercion)', () => {
			for (const goal of validGoals) {
				const result = GoalSettingSchema.safeParse({ dailyGoal: String(goal) });
				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.dailyGoal).toBe(goal);
				}
			}
		});

		it('should reject invalid goal values', () => {
			const invalidGoals = [0, 5, 10, 20, 45, 100, 120, -1, 1000];
			for (const goal of invalidGoals) {
				const result = GoalSettingSchema.safeParse({ dailyGoal: goal });
				expect(result.success).toBe(false);
			}
		});

		it('should reject non-numeric values', () => {
			const invalidValues = ['abc', '', null, undefined, NaN];
			for (const value of invalidValues) {
				const result = GoalSettingSchema.safeParse({ dailyGoal: value });
				expect(result.success).toBe(false);
			}
		});
	});

	describe('Form data extraction for goal setting', () => {
		it('should correctly extract dailyGoal from FormData', () => {
			const formData = createFormData({ dailyGoal: '30' });
			const dailyGoal = formData.get('dailyGoal') as string;
			expect(dailyGoal).toBe('30');
			expect(parseInt(dailyGoal)).toBe(30);
		});

		it('should handle empty dailyGoal with parseInt fallback', () => {
			const formData = createFormData({ dailyGoal: '' });
			const rawValue = formData.get('dailyGoal') as string;
			const dailyGoal = parseInt(rawValue) || 30;
			// Empty string parseInt returns NaN, fallback to 30
			expect(dailyGoal).toBe(30);
		});

		it('should handle invalid dailyGoal values with parseInt fallback', () => {
			const formData = createFormData({ dailyGoal: 'abc' });
			const rawValue = formData.get('dailyGoal') as string;
			const dailyGoal = parseInt(rawValue) || 30;
			// Non-numeric string parseInt returns NaN, fallback to 30
			expect(dailyGoal).toBe(30);
		});
	});

	describe('Server validation logic comparison', () => {
		/**
		 * This test highlights the mismatch between current server validation
		 * and the Zod schema. The server accepts any value 15-120, but UI and
		 * schema only allow [15, 30, 60, 90].
		 */
		it('should identify mismatch: server accepts 45 but schema rejects it', () => {
			// Current server validation (allows 15-120)
			const serverValidation = (dailyGoal: number) => dailyGoal >= 15 && dailyGoal <= 120;

			// Zod schema validation (only allows 15, 30, 60, 90)
			const schemaValidation = (dailyGoal: number) => {
				return GoalSettingSchema.safeParse({ dailyGoal }).success;
			};

			// Value 45 - accepted by server but rejected by schema
			expect(serverValidation(45)).toBe(true);
			expect(schemaValidation(45)).toBe(false);

			// Value 100 - accepted by server but rejected by schema
			expect(serverValidation(100)).toBe(true);
			expect(schemaValidation(100)).toBe(false);
		});
	});
});

describe('Onboarding Flow - Data Persistence Concerns', () => {
	/**
	 * These tests document potential issues in the onboarding data flow
	 */

	describe('Hidden input value initialization', () => {
		/**
		 * In role-selection/+page.svelte, selectedRole starts as null if no previous selection.
		 * The hidden input sends this null value when form is submitted.
		 */
		it('documents: hidden input sends empty string when no selection made', () => {
			// Simulating: <input type="hidden" name="personaType" value={selectedRole ?? ''} />
			const selectedRole: string | null = null;
			const hiddenInputValue = selectedRole ?? '';

			expect(hiddenInputValue).toBe('');

			// Server receives empty string, which should fail validation
			const result = RoleSelectionSchema.safeParse({ personaType: hiddenInputValue });
			expect(result.success).toBe(false);
		});

		/**
		 * In goal-setting/+page.svelte, selectedGoal defaults to 30 even if user hasn't chosen.
		 * This means form submission always sends a valid value.
		 */
		it('documents: goal always has default value of 30', () => {
			// From goal-setting/+page.server.ts: currentGoal: profile.daily_goal_minutes ?? 30
			// Simulating when daily_goal_minutes is null in the database
			const dailyGoalMinutes: number | null = null;
			const currentGoal = dailyGoalMinutes ?? 30;
			// From goal-setting/+page.svelte: let selectedGoal = $state(initialGoal);
			const selectedGoal = currentGoal;

			expect(selectedGoal).toBe(30);

			// User can submit without ever clicking a goal option
			const result = GoalSettingSchema.safeParse({ dailyGoal: selectedGoal });
			expect(result.success).toBe(true);
		});
	});

	describe('Value coercion edge cases', () => {
		it('parseInt behavior with various inputs', () => {
			// These are edge cases the server action might encounter
			expect(parseInt('')).toBeNaN();
			expect(parseInt('abc')).toBeNaN();
			expect(parseInt('30abc')).toBe(30); // Parses leading digits
			expect(parseInt('30.5')).toBe(30); // Ignores decimal
			expect(parseInt(' 30 ')).toBe(30); // Handles whitespace

			// The || 30 fallback catches NaN but not partial parses
			const parseWithFallback = (val: string) => parseInt(val) || 30;
			expect(parseWithFallback('')).toBe(30);
			expect(parseWithFallback('abc')).toBe(30);
			expect(parseWithFallback('30abc')).toBe(30); // Correctly gets 30
			expect(parseWithFallback('60extra')).toBe(60); // Gets 60, not 30
		});
	});
});
