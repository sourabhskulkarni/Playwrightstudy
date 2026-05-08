import { test, expect } from '@playwright/test';

test.describe('Day 4 - End-to-End Testing Framework', () => {
  
  test('Demonstrate Complete E2E User Flow', async ({ page }) => {
    // Step 1: Navigate to starting point
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Step 2: Interact with page
    const getStartedLink = page.getByRole('link', { name: 'Get started' });
    
    // Step 3: Verify interaction is possible
    await expect(getStartedLink).toBeVisible();
    
    // Step 4: Verify expected state
    const url = page.url();
    expect(url).toContain('playwright.dev');
  });

  test('Verify Multi-Step User Scenario', async ({ page }) => {
    // Step 1: User lands on homepage
    await page.goto('https://playwright.dev/');
    
    // Step 2: User sees get started option
    const button = page.getByRole('link', { name: 'Get started' });
    await expect(button).toBeVisible();
    
    // Step 3: User clicks get started
    await button.click();
    
    // Step 4: User is redirected
    await page.waitForURL(/.*installation.*/);
    
    // Step 5: Verify Installation page loaded
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('Verify Page Navigation Sequence', async ({ page }) => {
    // Navigation path verification
    const pages = [
      'https://playwright.dev/',
    ];
    
    for (const url of pages) {
      await page.goto(url);
      const response = await page.goto(url);
      expect(response?.ok()).toBe(true);
    }
  });

  test('Verify Element States During Interaction', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Get element
    const link = page.getByRole('link', { name: 'Get started' });
    
    // Verify initial state
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    
    // Verify it has href attribute (proper link)
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('Verify Complex Selectors Work', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Use various selector strategies
    const byRole = page.getByRole('link', { name: 'Get started' });
    const byText = page.getByText('Get started');
    
    // Both should find the element
    await expect(byRole).toBeVisible();
    await expect(byText).toBeVisible();
  });

  test('Verify Page Wait Conditions', async ({ page }) => {
    // Navigate with wait conditions
    await page.goto('https://playwright.dev/', { 
      waitUntil: 'networkidle' 
    });
    
    // Verify page is stable
    const isNetworkIdle = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    
    expect(isNetworkIdle).toBe(true);
  });
});
