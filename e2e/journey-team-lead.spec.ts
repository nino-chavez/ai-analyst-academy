import { test, expect } from '@playwright/test';
import { registerNewUser, generateTestEmail } from './utils/auth';

test.describe('Journey 3: Team Lead', () => {
  test('Select Team Lead and Strategy path', async ({ page }) => {
    // 1. User Registration
    const { email } = await registerNewUser(page, generateTestEmail('lead'));
    expect(email).toContain('test-lead');
    // Onboarding
    await expect(page).toHaveURL(/.*\/onboarding\/role-selection/);
    await page.locator('.persona-card', { hasText: 'Team Lead' }).click();
    await page.click('button:has-text("Continue")');

    // Goal Setting - Low commitment
    await expect(page).toHaveURL(/.*\/onboarding\/goal-setting/);
    await page.locator('.goal-card', { hasText: '15 min' }).click();
    await page.click('button:has-text("Continue")');

    // API Setup Skip
    await expect(page).toHaveURL(/.*\/onboarding\/api-setup/);
    await page.click('text=Skip for now');

    // Dashboard
    await expect(page).toHaveURL(/.*\/learn/);
    
    // Team Lead path typically prioritizes Phase 4 (Strategy)
    // Verify Phase 4 is visible and accessible
    await expect(page.locator('text=Phase 4')).toBeVisible();
    
    // Navigate to Phase 4
    await page.click('text=Phase 4: Strategy'); // Assuming title contains Strategy
    await expect(page).toHaveURL(/.*\/learn\/phase\/4/);
  });
});
