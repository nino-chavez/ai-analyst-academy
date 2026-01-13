import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import { env } from '$env/dynamic/private';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

/**
 * Derives a 256-bit key from the encryption secret using scrypt.
 * The salt ensures that even with the same secret, different users get different derived keys.
 */
function deriveKey(salt: Buffer): Buffer {
	const encryptionSecret = env.ENCRYPTION_KEY;

	if (!encryptionSecret || encryptionSecret.length < 32) {
		throw new Error(
			'ENCRYPTION_KEY environment variable must be set and at least 32 characters long'
		);
	}

	// scrypt parameters: N=2^14, r=8, p=1 (recommended for interactive logins)
	return scryptSync(encryptionSecret, salt, 32, { N: 16384, r: 8, p: 1 });
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * Output format: base64(salt || iv || authTag || ciphertext)
 *
 * @param plaintext - The string to encrypt
 * @param associatedData - Optional additional authenticated data (e.g., user ID)
 * @returns Base64-encoded encrypted string
 */
export function encrypt(plaintext: string, associatedData?: string): string {
	// Generate random salt and IV
	const salt = randomBytes(SALT_LENGTH);
	const iv = randomBytes(IV_LENGTH);

	// Derive key from secret + salt
	const key = deriveKey(salt);

	// Create cipher
	const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

	// Add associated data if provided (authenticated but not encrypted)
	if (associatedData) {
		cipher.setAAD(Buffer.from(associatedData, 'utf8'));
	}

	// Encrypt
	const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

	// Get auth tag
	const authTag = cipher.getAuthTag();

	// Combine: salt || iv || authTag || ciphertext
	const combined = Buffer.concat([salt, iv, authTag, encrypted]);

	return combined.toString('base64');
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 *
 * @param encryptedBase64 - Base64-encoded encrypted string (from encrypt())
 * @param associatedData - Optional additional authenticated data (must match encrypt call)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export function decrypt(encryptedBase64: string, associatedData?: string): string {
	// Decode from base64
	const combined = Buffer.from(encryptedBase64, 'base64');

	// Extract components
	const salt = combined.subarray(0, SALT_LENGTH);
	const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
	const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
	const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

	// Derive key from secret + salt
	const key = deriveKey(salt);

	// Create decipher
	const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

	// Set auth tag for verification
	decipher.setAuthTag(authTag);

	// Add associated data if provided
	if (associatedData) {
		decipher.setAAD(Buffer.from(associatedData, 'utf8'));
	}

	// Decrypt
	const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

	return decrypted.toString('utf8');
}

/**
 * Checks if a string appears to be encrypted with the new format.
 * Used for migration detection.
 *
 * New format starts with salt (32 bytes) + iv (16 bytes) + authTag (16 bytes)
 * which means minimum length is 64 bytes = ~86 base64 characters
 */
export function isNewEncryptionFormat(encryptedBase64: string): boolean {
	try {
		const decoded = Buffer.from(encryptedBase64, 'base64');
		// New format minimum: salt(32) + iv(16) + authTag(16) + at least 1 byte ciphertext = 65 bytes
		return decoded.length >= 65;
	} catch {
		return false;
	}
}

/**
 * Migrates an old Base64-encoded key to the new encrypted format.
 * Old format: base64(userId:apiKey)
 *
 * @param oldEncryptedKey - The old base64-encoded value
 * @param userId - The user ID for verification and AAD
 * @returns Object with the plain key and new encrypted value
 */
export function migrateOldKey(
	oldEncryptedKey: string,
	userId: string
): { plainKey: string; newEncryptedKey: string } | null {
	try {
		// Decode old format
		const decoded = Buffer.from(oldEncryptedKey, 'base64').toString('utf8');

		// Old format was "userId:apiKey"
		const colonIndex = decoded.indexOf(':');
		if (colonIndex === -1) {
			return null;
		}

		const storedUserId = decoded.substring(0, colonIndex);
		const plainKey = decoded.substring(colonIndex + 1);

		// Verify user ID matches
		if (storedUserId !== userId) {
			return null;
		}

		// Re-encrypt with new format
		const newEncryptedKey = encrypt(plainKey, userId);

		return { plainKey, newEncryptedKey };
	} catch {
		return null;
	}
}

/**
 * Generates a secure random string for use as ENCRYPTION_KEY.
 * Only used for initial setup - call this once and store the result.
 */
export function generateEncryptionKey(): string {
	return randomBytes(32).toString('base64');
}
