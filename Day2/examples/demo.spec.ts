import { test, expect } from '@playwright/test';

test.describe('Day 2 - Page Object Model & BDD Demo', () => {
  
  test('Demonstrate Page Object Pattern Concepts', async ({ page }) => {
    // Navigate to a test site
    await page.goto('https://playwright.dev/');
    
    // Simulating Page Object pattern - grouping related actions
    const navigateTo = async (url: string) => {
      await page.goto(url);
    };
    
    const getPageTitle = async (): Promise<string | null> => {
      return await page.title();
    };
    
    // Use the "page object methods"
    await navigateTo('https://playwright.dev/');
    const title = await getPageTitle();
    
    expect(title).toContain('Playwright');
  });

  test('Verify UI Element Interaction', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Click get started link
    const getStartedLink = page.getByRole('link', { name: 'Get started' });
    await getStartedLink.click();
    
    // Verify navigation happened
    await expect(page).toHaveTitle(/Installation/);
  });

  test('Verify Multiple Elements Exist', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Verify multiple elements are present
    const docs = page.getByRole('link', { name: 'Docs' });
    const community = page.getByRole('link', { name: 'Community' });
    
    await expect(docs).toBeVisible();
    await expect(community).toBeVisible();
  });

  test('Verify Page Layout Integrity', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev/');
    
    // Verify page is fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get main content area
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});
