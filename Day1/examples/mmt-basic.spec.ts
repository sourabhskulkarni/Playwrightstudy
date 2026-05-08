import { test, expect } from '@playwright/test';

test.describe('MakeMyTrip Basic Navigation', () => {
  test('Navigate to MakeMyTrip and check basic elements', async ({ page }) => {
    // Navigate to MakeMyTrip
    await page.goto('https://www.makemytrip.com/');

    // Check if logo is visible
    const logo = page.locator('img[alt*="MakeMyTrip"]');
    await expect(logo).toBeVisible();

    // Check input box for 'From' city
    const fromInput = page.locator('input[placeholder*="From"]');
    await expect(fromInput).toBeVisible();
    await fromInput.fill('Delhi');

    // Check label or text
    const header = page.locator('h1').or(page.locator('[class*="header"]'));
    if (await header.isVisible()) {
      console.log('Header text:', await header.textContent());
    }

    // Click on a button (e.g., search or something)
    const searchButton = page.locator('button').filter({ hasText: /Search/i });
    if (await searchButton.isVisible()) {
      await searchButton.click();
    }

    // Wait for page load
    await page.waitForLoadState('networkidle');
  });
});