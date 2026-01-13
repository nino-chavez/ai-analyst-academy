import { test, expect } from '@playwright/test';
import { registerNewUser, generateTestEmail } from './utils/auth';

test.describe('Journey 2: Business Student', () => {
  test('Select Business Student and navigate curriculum', async ({ page }) => {
    // 1. User Registration
    const { email } = await registerNewUser(page, generateTestEmail('student'));
    expect(email).toContain('test-student');
    await expect(page).toHaveURL(/.*\/onboarding\/role-selection/);
    await page.locator('.persona-card', { hasText: 'Business Student' }).click();
    await page.click('button:has-text("Continue")');

    // Goal Setting - Aggressive
    await expect(page).toHaveURL(/.*\/onboarding\/goal-setting/);
    await page.locator('.goal-card', { hasText: '1 hour' }).click(); // 60 mins
    await page.click('button:has-text("Continue")');

    // API Setup Skip
    await expect(page).toHaveURL(/.*\/onboarding\/api-setup/);
    await page.click('text=Skip for now');

    // Dashboard
    await expect(page).toHaveURL(/.*\/learn/);
    
    // Verify differentiation - maybe Phase 2 or Capstone is highlighted? 
    // For now, just verify we can navigate to Phase 2 directly if unlocked (it might be locked)
    // Actually, everything is open in this app version likely, or sequential.
    // Let's verify we can see Phase 2 in the list.
    await expect(page.locator('text=Phase 2')).toBeVisible();
    
    // Navigate to Phase 1 and fast forward
    await page.click('text=Phase 1');
    await expect(page).toHaveURL(/.*\/learn\/phase\/1/);
  });
});
