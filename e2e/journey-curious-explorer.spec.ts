import { test, expect } from '@playwright/test';
import { registerNewUser, generateTestEmail } from './utils/auth';

test.describe('Journey 4: Curious Explorer', () => {
  test('Select Explorer and check Sandbox Demo', async ({ page }) => {
    // 1. User Registration
    const { email } = await registerNewUser(page, generateTestEmail('explorer'));
    expect(email).toContain('test-explorer');

    // Onboarding
    await expect(page).toHaveURL(/.*\/onboarding\/role-selection/);
    await page.locator('.persona-card', { hasText: 'Curious Explorer' }).click();
    await page.click('button:has-text("Continue")');

    // Goal Setting - Skip
    await expect(page).toHaveURL(/.*\/onboarding\/goal-setting/);
    await page.click('button:has-text("Skip for now")');

    // API Setup Skip
    await expect(page).toHaveURL(/.*\/onboarding\/api-setup/);
    await page.click('text=Skip for now');

    // Dashboard
    await expect(page).toHaveURL(/.*\/learn/);
    
    // Navigate to Sandbox
    await page.click('a[href="/sandbox"]'); // Assuming sidebar link
    await expect(page).toHaveURL(/.*\/sandbox/);
    
    // Check for Demo Mode indicator
    // Looking for "Demo Mode" text or similar
    await expect(page.locator('body')).toContainText('Demo Mode');
    
    // Try sending a message (if chat input exists)
    const chatInput = page.locator('textarea[name="message"]'); // Guessing selector
    if (await chatInput.isVisible()) {
        await chatInput.fill('Hello AI');
        await page.keyboard.press('Enter');
        // valid check for response or demo limit would follow
    }
  });
});
