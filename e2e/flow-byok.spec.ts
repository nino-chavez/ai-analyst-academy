import { test, expect } from '@playwright/test';
import { registerNewUser, generateTestEmail } from './utils/auth';

test.describe('Flow: BYOK Setup', () => {
  test.skip('Navigate to Settings and Enter API Key', async ({ page }) => {
    // 1. Register
    const { email } = await registerNewUser(page, generateTestEmail('byok'));

    // Go to Settings -> API Keys
    await page.goto('/settings/api-keys');

    // Open OpenAI Key Modal
    // We target the OpenAI card specifically
    await page.locator('.key-card').filter({ hasText: 'OpenAI' }).getByRole('button', { name: 'Update' }).or(
        page.locator('.key-card').filter({ hasText: 'OpenAI' }).getByRole('button', { name: 'Add Key' })
    ).click();
    
    // Verify Key Input
    const keyInput = page.locator('input[name="apiKey"]');
    await expect(keyInput).toBeVisible();
    
    // Enter Valid Mock Key
    // Skipping invalid key check for now to focus on happy path
    await keyInput.fill('sk-mock-valid-key-123456789'); // Mock format
    
    // Save
    await page.click('button:has-text("Save Key")'); // Button text from component
    
    // Verify Success
    // Component sets successMessage which renders .success-message
    // Also check for "Configured" text in the card
    await expect(page.locator('.key-card').filter({ hasText: 'OpenAI' })).toContainText('Configured', { timeout: 10000 });
  });
});
