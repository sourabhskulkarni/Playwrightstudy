import { test, expect } from '@playwright/test';

test.describe('Day 3 - API Testing & Performance Concepts', () => {
  
  test('Demonstrate API Response Validation Concept', async ({ page }) => {
    // Navigate to a page
    await page.goto('https://playwright.dev/');
    
    // Simulate API response handling by checking page response
    // In real API testing, you'd use page.request
    const response = await page.goto('https://playwright.dev/');
    
    // Verify successful response
    expect(response?.status()).toBe(200);
  });

  test('Verify Page Load Performance', async ({ page }) => {
    // Start measuring performance
    const startTime = Date.now();
    
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Wait for key content
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads in reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });

  test('Verify Network Requests Are Made', async ({ page }) => {
    let requestCount = 0;
    
    // Monitor requests
    page.on('request', () => {
      requestCount++;
    });
    
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Verify requests were made
    expect(requestCount).toBeGreaterThan(0);
  });

  test('Verify Successful Page Response', async ({ page }) => {
    // Navigate and capture response
    const response = await page.goto('https://playwright.dev/');
    
    // Verify response
    expect(response?.ok()).toBe(true);
    expect(response?.status()).toEqual(200);
  });

  test('Demonstrate Async Operation Handling', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Wait for specific element to appear (async operation)
    await page.waitForSelector('text=/Get started/', { timeout: 5000 });
    
    // Verify element exists
    const element = page.getByRole('link', { name: 'Get started' });
    await expect(element).toBeVisible();
  });
});
