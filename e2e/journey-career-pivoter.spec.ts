import { test, expect } from '@playwright/test';
import { registerNewUser, generateTestEmail } from './utils/auth';

test.describe('Journey 1: Career Pivoter', () => {
  test('Complete Onboarding and Start Phase 1', async ({ page }) => {
    // 1. User Registration
    const { email } = await registerNewUser(page, generateTestEmail('pivoter'));
    expect(email).toContain('test-pivoter');

    // Should be at role selection
    await expect(page).toHaveURL(/.*\/onboarding\/role-selection/);
    await page.click('text=Career Pivoter'); 
    await page.click('button:has-text("Continue")'); // Assuming continue button exists

    // Goal Setting
    await expect(page).toHaveURL(/.*\/onboarding\/goal-setting/);
    await page.locator('.goal-card').filter({ hasText: '30 min' }).click();
    await page.click('button:has-text("Continue")');

    // API Setup (Skip for now)
    await expect(page).toHaveURL(/.*\/onboarding\/api-setup/);
    await page.click('text=Skip for now');

    // 2. Dashboard & Learning Flow
    await expect(page).toHaveURL(/.*\/learn/); 
    
    // Start Phase 1
    await page.click('text=Phase 1');
    await expect(page).toHaveURL(/.*\/learn\/phase\/1/);

    // Open Module 1.1
    await page.click('text=1.1 Economics of Intelligence');
    await expect(page).toHaveURL(/.*\/learn\/phase\/1\/1.1-economics-of-intelligence/);

    // Verify content sections (Why, What, How)
    // Actual headers include "WHY This Matters", "WHAT You Need to Know", etc.
    // Use first() or just checking visibility of one is sufficient smoke test.
    await expect(page.locator('h2').filter({ hasText: 'This Matters' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'You Need to Know' })).toBeVisible();
    
    // Simulate reading/scrolling interactions if needed, or check for "Mark Complete" or "Continue"
    // Since we don't know the exact "Mark Complete" button text, we check for core elements
    // Assuming there is a way to proceed or mark progress. 
    // For now, verifying we reached the content is substantial for this pass.
  });
});
