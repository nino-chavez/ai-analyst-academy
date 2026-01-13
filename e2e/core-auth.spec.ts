import { test, expect } from '@playwright/test';

test.describe('Core: Authentication', () => {
  test('Protected Routes Redirect to Login', async ({ page }) => {
    // Try accessing settings without login
    await page.goto('/settings');
    await expect(page).toHaveURL(/.*\/auth\/login/); // or redirect parameter
    
    // Try accessing learning content might be allowed or restricted? 
    // Usually learning platform requires login
    await page.goto('/learn');
    // If it redirects, good. If public, then ignore.
    // Based on user journeys, "Has Account? -> No -> Sign Up".
    // So /learn likely redirects or shows limited view.
  });
});
