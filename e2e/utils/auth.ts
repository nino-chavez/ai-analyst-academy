import { type Page, expect } from '@playwright/test';

export const generateRandomEmail = () => {
    return `test-${Math.random().toString(36).substring(2, 10)}@example.com`;
};

export const generateTestEmail = (prefix: string) => {
    return `test-${prefix}-${Date.now()}@example.com`;
};

export const registerNewUser = async (page: Page, email?: string) => {
    const userEmail = email || generateRandomEmail();
    const password = 'Password123!';

    await page.goto('/auth/signup');
    await page.fill('#email', userEmail);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.click('button[type="submit"]');

    // Check for error
    try {
        await expect(page.locator('.error-message')).toBeVisible({ timeout: 2000 });
        const error = await page.locator('.error-message').textContent();
        throw new Error(`Signup failed: ${error}`);
    } catch (e: any) {
        // If no error visible, check if we need to login (user already exists)
        if (e.message && e.message.includes('already registered')) {
             await loginUser(page, userEmail);
             return { email: userEmail, password };
        }
        // If no error visible, continue
        if (e.message && e.message.startsWith('Signup failed')) throw e;
    }

    // Wait for redirect to onboarding or dashboard, confirming login success
    await page.waitForURL(/\/onboarding|\/learn/, { timeout: 10000 });
    
    return { email: userEmail, password };
};

export const loginUser = async (page: Page, email: string) => {
    const password = 'Password123!';
    await page.goto('/auth/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/learn|\/onboarding/, { timeout: 10000 });
};
