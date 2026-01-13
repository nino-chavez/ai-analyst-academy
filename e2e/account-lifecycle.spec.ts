import { test, expect } from '@playwright/test';
import { registerNewUser, loginUser } from './utils/auth';

test.describe('Account Lifecycle: Creation and Deletion', () => {
    
    test('User can register, update profile, and then delete their account (data reset)', async ({ page }) => {
        // 1. Register a new user
        const { email, password } = await registerNewUser(page);
        
        // 2. Update Profile to ensure we have custom data to lose
        await page.goto('/settings');
        await expect(page).toHaveURL('/settings');

        // Wait for initial data to load to avoid race with hydration
        const profileNameInput = page.locator('#userName');
        await expect(profileNameInput).not.toBeEmpty();

        const uniqueName = `User ${Date.now()}`;
        await profileNameInput.fill(uniqueName);
        await page.click('button:has-text("Save Profile")');
        
        // Verify success message or simple check that value persisted (by reloading or checking UI)
        await expect(page.locator('.success-message')).toBeVisible();
        await expect(page.locator('#userName')).toHaveValue(uniqueName);

        // 3. Delete Account
        const deleteButton = page.locator('button', { hasText: 'Delete Account' });
        await deleteButton.click();

        const modal = page.locator('.modal');
        await expect(modal).toBeVisible();

        const confirmButton = modal.locator('button', { hasText: 'Yes, Delete My Account' });
        await confirmButton.click();

        // 4. Verify redirection to home page
        await page.waitForURL('/');
        await expect(page).toHaveURL('/');

        // 5. Verify account data is reset by logging in again
        // Since we can't fully delete the auth user without admin API, we verify the profile data is gone.
        await loginUser(page, email);

        // We should be redirected to onboarding or learn
        // Check settings again to see if name is reset
        await page.goto('/settings');
        
        // The name should NOT be the unique name we set
        // Default might be 'Learner' or derived from email
        const nameInput = page.locator('#userName');
        await expect(nameInput).not.toHaveValue(uniqueName);
    });
});
