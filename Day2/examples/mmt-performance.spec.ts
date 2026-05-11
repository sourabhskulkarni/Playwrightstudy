import { test, expect } from '@playwright/test';

test.describe('MakeMyTrip Performance Testing', () => {
  test('Measure page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('https://www.makemytrip.com/', { waitUntil: 'domcontentloaded' });
    const domContentLoadedTime = Date.now() - startTime;

    await page.waitForLoadState('networkidle');
    const fullyLoadedTime = Date.now() - startTime;

    console.log(`DOM Content Loaded: ${domContentLoadedTime}ms`);
    console.log(`Fully Loaded: ${fullyLoadedTime}ms`);

    // Assert performance thresholds
    expect(domContentLoadedTime).toBeLessThan(3000); // 3 seconds
    expect(fullyLoadedTime).toBeLessThan(10000); // 10 seconds
  });

  test('Measure search performance', async ({ page }) => {
    await page.goto('https://www.makemytrip.com/');

    // Handle popup
    try {
      await page.locator('.modalClose').click({ timeout: 5000 });
    } catch (e) {}

    const startTime = Date.now();

    // Perform search
    await page.locator('input[placeholder*="From"]').fill('Delhi');
    await page.locator('.react-autosuggest__suggestion').first().click();

    await page.locator('input[placeholder*="To"]').fill('Mumbai');
    await page.locator('.react-autosuggest__suggestion').first().click();

    // Select date
    await page.locator('input[placeholder*="Departure"]').click();
    await page.locator('.DayPicker-Day').first().click();

    // Click search
    await page.locator('button[data-cy="submit"]').click();

    // Wait for results
    await page.waitForSelector('.listingCard', { timeout: 30000 });

    const searchTime = Date.now() - startTime;
    console.log(`Search completed in: ${searchTime}ms`);

    expect(searchTime).toBeLessThan(15000); // 15 seconds
  });

  test('Resource loading performance', async ({ page }) => {
    const resources: string[] = [];

    page.on('response', response => {
      resources.push(response.url());
    });

    await page.goto('https://www.makemytrip.com/', { waitUntil: 'networkidle' });

    const imageResources = resources.filter(url => url.match(/\.(jpg|jpeg|png|gif|webp)/i));
    const jsResources = resources.filter(url => url.includes('.js'));
    const cssResources = resources.filter(url => url.includes('.css'));

    console.log(`Images loaded: ${imageResources.length}`);
    console.log(`JS files loaded: ${jsResources.length}`);
    console.log(`CSS files loaded: ${cssResources.length}`);

    // Assert reasonable resource counts
    expect(imageResources.length).toBeLessThan(50);
    expect(jsResources.length).toBeLessThan(20);
    expect(cssResources.length).toBeLessThan(10);
  });

  test('Core Web Vitals approximation', async ({ page }) => {
    await page.goto('https://www.makemytrip.com/');

    // Measure LCP (Largest Contentful Paint) approximation
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Fallback after 10 seconds
        setTimeout(() => resolve(10000), 10000);
      });
    });

    console.log(`LCP: ${lcp}ms`);
    expect(lcp).toBeLessThan(2500); // Good LCP is < 2.5s
  });
});