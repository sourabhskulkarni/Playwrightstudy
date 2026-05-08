import { test, expect } from '@playwright/test';

test.describe('Day 1 - Basic Playwright Tests', () => {
  
  test('Verify Playwright Documentation Opens', async ({ page }) => {
    // Navigate to Playwright documentation
    await page.goto('https://playwright.dev/');
    
    // Verify page title contains Playwright
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('Verify Page Elements Exist', async ({ page }) => {
    // Navigate to website
    await page.goto('https://playwright.dev/');
    
    // Verify navigation link exists
    const getStartedLink = page.getByRole('link', { name: 'Get started' });
    await expect(getStartedLink).toBeVisible();
  });

  test('Verify Basic Navigation', async ({ page }) => {
    // Navigate to URL
    await page.goto('https://playwright.dev/');
    
    // Get page URL
    const url = page.url();
    expect(url).toContain('playwright.dev');
  });

  test('Verify Element Text Content', async ({ page }) => {
    // Navigate to Playwright docs
    await page.goto('https://playwright.dev/');
    
    // Find heading
    const heading = page.getByRole('heading', { level: 1 });
    
    // Verify it has text
    const headingText = await heading.textContent();
    expect(headingText).toBeTruthy();
  });
});
