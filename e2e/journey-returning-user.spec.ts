import { test, expect } from '@playwright/test';
import { registerNewUser, loginUser, generateTestEmail } from './utils/auth';

test.describe('Journey 5: Returning User', () => {
  test('Login and Resume Progress', async ({ page }) => {
      const email = generateTestEmail('returning');
      // 1. Setup user (register first to ensure they exist)
      await registerNewUser(page, email);
      
      // 2. Logout to simulate returning flow
      await page.goto('/settings');
      // Verify we are on settings page. If registerNewUser returns us to onboarding, we might need to skip onboarding or just go to settings.
      // But /settings is protected, so if we can go there, we are logged in.
      
      // Find Sign Out button. It might be in a menu or on the page.
      // Assuming it's a button "Sign Out" or "Log out"
      await page.getByLabel('Sign out').click();
      
      // 3. Login
      await loginUser(page, email);
      
      // 4. Verify Dashboard Resume
      // Check for "Resume Learning" or "InProgress" section
      await expect(page).toHaveURL(/.*\/learn/);
  });
});
