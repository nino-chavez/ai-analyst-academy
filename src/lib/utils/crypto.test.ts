/**
 * Unit tests for crypto utilities
 * Tests AES-256-GCM encryption/decryption and key migration
 *
 * Note: These tests use a pure Node.js implementation that mirrors
 * the production crypto utilities but without SvelteKit dependencies.
 */

import { describe, it, expect } from 'vitest';
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

// Test implementation that mirrors the production crypto.ts
// This avoids the $env/dynamic/private dependency issue in tests
const TEST_ENCRYPTION_KEY = 'test-encryption-key-that-is-at-least-32-characters-long-for-testing';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

function deriveKey(salt: Buffer): Buffer {
	return scryptSync(TEST_ENCRYPTION_KEY, salt, 32, { N: 16384, r: 8, p: 1 });
}

function encrypt(plaintext: string, associatedData?: string): string {
	const salt = randomBytes(SALT_LENGTH);
	const iv = randomBytes(IV_LENGTH);
	const key = deriveKey(salt);

	const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

	if (associatedData) {
		cipher.setAAD(Buffer.from(associatedData, 'utf8'));
	}

	const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	const combined = Buffer.concat([salt, iv, authTag, encrypted]);

	return combined.toString('base64');
}

function decrypt(encryptedBase64: string, associatedData?: string): string {
	const combined = Buffer.from(encryptedBase64, 'base64');

	if (combined.length < SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH) {
		throw new Error('Invalid encrypted data: too short');
	}

	const salt = combined.subarray(0, SALT_LENGTH);
	const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
	const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
	const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

	const key = deriveKey(salt);
	const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
	decipher.setAuthTag(authTag);

	if (associatedData) {
		decipher.setAAD(Buffer.from(associatedData, 'utf8'));
	}

	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString('utf8');
}

function isNewEncryptionFormat(encryptedBase64: string): boolean {
	if (!encryptedBase64 || encryptedBase64.length < 80) {
		return false;
	}

	try {
		const buffer = Buffer.from(encryptedBase64, 'base64');
		return buffer.length >= SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH;
	} catch {
		return false;
	}
}

function migrateOldKey(
	oldEncryptedKey: string,
	userId: string
): { plainKey: string; newEncryptedKey: string } | null {
	if (isNewEncryptionFormat(oldEncryptedKey)) {
		return null;
	}

	try {
		const decoded = Buffer.from(oldEncryptedKey, 'base64').toString('utf8');
		const colonIndex = decoded.indexOf(':');
		if (colonIndex === -1) {
			return null;
		}

		const storedUserId = decoded.substring(0, colonIndex);
		const plainKey = decoded.substring(colonIndex + 1);

		if (storedUserId !== userId) {
			return null;
		}

		const newEncryptedKey = encrypt(plainKey, userId);

		return { plainKey, newEncryptedKey };
	} catch {
		return null;
	}
}

describe('crypto utilities', () => {
	describe('encrypt', () => {
		it('should encrypt plaintext and return base64 string', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted = encrypt(plaintext);

			expect(encrypted).toBeDefined();
			expect(typeof encrypted).toBe('string');
			// Base64 encoded string should be longer than plaintext due to IV + salt + auth tag
			expect(encrypted.length).toBeGreaterThan(plaintext.length);
		});

		it('should produce different ciphertext for same plaintext (due to random IV/salt)', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted1 = encrypt(plaintext);
			const encrypted2 = encrypt(plaintext);

			expect(encrypted1).not.toBe(encrypted2);
		});

		it('should handle empty string', () => {
			const encrypted = encrypt('');
			expect(encrypted).toBeDefined();
			expect(typeof encrypted).toBe('string');
		});

		it('should handle unicode characters', () => {
			const plaintext = 'test-key-with-unicode-🔑-émojis';
			const encrypted = encrypt(plaintext);
			const decrypted = decrypt(encrypted);

			expect(decrypted).toBe(plaintext);
		});

		it('should handle associated data (AAD)', () => {
			const plaintext = 'sk-test-api-key-12345';
			const userId = 'user-123';
			const encrypted = encrypt(plaintext, userId);

			expect(encrypted).toBeDefined();
			// Should only decrypt with correct AAD
			const decrypted = decrypt(encrypted, userId);
			expect(decrypted).toBe(plaintext);
		});
	});

	describe('decrypt', () => {
		it('should decrypt encrypted text back to original plaintext', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted = encrypt(plaintext);
			const decrypted = decrypt(encrypted);

			expect(decrypted).toBe(plaintext);
		});

		it('should throw on invalid base64', () => {
			expect(() => decrypt('not-valid-base64!!!')).toThrow();
		});

		it('should throw on tampered ciphertext', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted = encrypt(plaintext);

			// Tamper with the base64 string
			const buffer = Buffer.from(encrypted, 'base64');
			buffer[50] = buffer[50] ^ 0xff; // Flip bits
			const tampered = buffer.toString('base64');

			expect(() => decrypt(tampered)).toThrow();
		});

		it('should throw when decrypting with wrong associated data', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted = encrypt(plaintext, 'user-123');

			// Try to decrypt with different AAD
			expect(() => decrypt(encrypted, 'user-456')).toThrow();
		});

		it('should throw on truncated ciphertext', () => {
			const plaintext = 'sk-test-api-key-12345';
			const encrypted = encrypt(plaintext);

			// Truncate the encrypted data
			const truncated = encrypted.slice(0, 20);

			expect(() => decrypt(truncated)).toThrow();
		});
	});

	describe('isNewEncryptionFormat', () => {
		it('should return true for new format encrypted strings', () => {
			const encrypted = encrypt('test-key');
			expect(isNewEncryptionFormat(encrypted)).toBe(true);
		});

		it('should return false for old Base64 format', () => {
			// Old format: just base64 of userId:apiKey
			const oldFormat = Buffer.from('user-123:sk-old-api-key').toString('base64');
			expect(isNewEncryptionFormat(oldFormat)).toBe(false);
		});

		it('should return false for short strings', () => {
			expect(isNewEncryptionFormat('short')).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(isNewEncryptionFormat('')).toBe(false);
		});

		it('should return false for non-base64 strings', () => {
			expect(isNewEncryptionFormat('not-base64!!!')).toBe(false);
		});
	});

	describe('migrateOldKey', () => {
		it('should migrate old Base64 format to new encrypted format', () => {
			const userId = 'user-123';
			const apiKey = 'sk-old-api-key-12345';
			const oldFormat = Buffer.from(`${userId}:${apiKey}`).toString('base64');

			const result = migrateOldKey(oldFormat, userId);

			expect(result).not.toBeNull();
			expect(result!.plainKey).toBe(apiKey);
			expect(isNewEncryptionFormat(result!.newEncryptedKey)).toBe(true);

			// Verify the new encrypted key can be decrypted
			const decrypted = decrypt(result!.newEncryptedKey, userId);
			expect(decrypted).toBe(apiKey);
		});

		it('should return null for invalid old format', () => {
			const result = migrateOldKey('not-valid-base64!!!', 'user-123');
			expect(result).toBeNull();
		});

		it('should return null when userId does not match', () => {
			const oldFormat = Buffer.from('user-123:sk-api-key').toString('base64');
			const result = migrateOldKey(oldFormat, 'different-user');
			expect(result).toBeNull();
		});

		it('should return null for new format strings', () => {
			const newFormat = encrypt('sk-api-key', 'user-123');
			const result = migrateOldKey(newFormat, 'user-123');
			expect(result).toBeNull();
		});

		it('should handle old format without colon separator', () => {
			const invalidOldFormat = Buffer.from('no-colon-separator').toString('base64');
			const result = migrateOldKey(invalidOldFormat, 'user-123');
			expect(result).toBeNull();
		});
	});

	describe('round-trip encryption', () => {
		it('should handle various API key formats', () => {
			const testKeys = [
				'sk-proj-abc123def456',
				'sk-ant-api03-very-long-key-with-many-segments-here',
				'AIzaSy1234567890abcdefghij',
				'simple-key'
			];

			for (const key of testKeys) {
				const encrypted = encrypt(key);
				const decrypted = decrypt(encrypted);
				expect(decrypted).toBe(key);
			}
		});

		it('should handle long keys', () => {
			const longKey = 'sk-' + 'a'.repeat(1000);
			const encrypted = encrypt(longKey);
			const decrypted = decrypt(encrypted);
			expect(decrypted).toBe(longKey);
		});
	});
});
