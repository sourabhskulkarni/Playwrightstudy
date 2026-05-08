# 🎓 Playwright Fundamentals for Corporate Training

## Essential Concepts - MUST READ FIRST

This guide covers the **foundational Playwright concepts** that you need to understand before using any framework.

---

## 1. The Three Core Components: Browser → Context → Page

### Visual Flow
```
┌─────────────────────────────────────────────────────────────────┐
│ BROWSER (The application, like Chrome or Firefox)              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ CONTEXT #1 (Isolated environment - Private window)        │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ PAGE #1 (Actual webpage - tab 1)                   │ │ │
│  │  │ URL: https://www.makemytrip.com/                  │ │ │
│  │  │ Contains: HTML, JS, CSS                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ PAGE #2 (Actual webpage - tab 2)                   │ │ │
│  │  │ URL: https://www.makemytrip.com/flights            │ │ │
│  │  │ Contains: HTML, JS, CSS                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ CONTEXT #2 (Isolated environment - Private window)        │ │
│  │ (For second user, different cookies, storage, etc)       │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ PAGE #1                                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Understanding Each Component

### 🔵 Browser
**What it is:**
- The automation of Chrome, Firefox, or Safari
- Controls the entire browser application
- Manages resources (memory, processes)

**Real World Analogy:**
- Like installing an application on your computer
- Just the app, empty, no windows open

**In Code:**
```typescript
import { chromium } from '@playwright/test';

// Browser object - the application
const browser = await chromium.launch();

// Use browser...

// Close the application
await browser.close();
```

**When to use browser level:**
- Launch/close browser
- Create multiple isolated contexts
- Set browser properties

---

### 🟢 Context
**What it is:**
- An isolated browser session (like "Private/Incognito window")
- Has its own cookies, localStorage, sessionStorage
- Can have multiple pages (tabs) inside it
- Different user session in the same browser

**Real World Analogy:**
- Like opening Private window in Chrome
- Someone else using your computer logged in as different user
- Their cookies don't mix with yours

**In Code:**
```typescript
// Context object - isolated session/private window
const context = await browser.createContext();

// Each context is ISOLATED
const context2 = await browser.createContext();
// context and context2 don't share cookies!

// Use context...

// Close context
await context.close();
```

**When to use context:**
- Simulate different users
- Isolate test data (cookies/storage)
- Test multi-user scenarios
- Run tests in parallel

---

### 🟡 Page
**What it is:**
- A single webpage (like one tab in a browser)
- The actual interface you interact with via code
- Where selectors live, elements exist
- What you navigate to with `page.goto()`

**Real World Analogy:**
- The actual webpage visible in a tab
- What you see when you open a website
- Multiple pages = multiple tabs in same context

**In Code:**
```typescript
// Page object - actual webpage/tab
const page = await context.newPage();

// Navigate to a website
await page.goto('https://www.makemytrip.com/');

// Interact with page - THIS IS WHERE YOU WRITE TESTS!
await page.locator('button').click();
await page.fill('input[name="email"]', 'test@example.com');

// Close page
await page.close();
```

**When to use page:**
- Click elements
- Fill forms
- Navigate websites
- Extract information
- Wait for elements

---

## 3. Method Types in Playwright

### 📋 TypeScript/JavaScript Function Types

#### A. Synchronous Methods (Blocking)
```typescript
// Runs immediately, returns result right away
// Others must wait for it to finish

const count = array.length;  // Instant
const name = string.charAt(0);  // Instant
const max = Math.max(1, 2, 3);  // Instant
```

**Problem with non-async Playwright:**
```typescript
// ❌ This WON'T work in Playwright
const element = page.locator('button');  // Browser might not be ready!
element.click();  // Might fail - element not loaded yet!
```

---

#### B. Asynchronous Methods (Non-blocking)
```typescript
// Takes time, returns Promise
// Returns immediately but result comes later
// Must wait for it with await

async function getFlights() {
  const flights = await page.locator('.flight').all();
  return flights;  // Returns array when ready
}

// Usage - MUST use await
const allFlights = await getFlights();  // Waits for result
console.log(allFlights);  // Has data now
```

**When to use async/await in Playwright:**
```typescript
// ❌ WRONG - doesn't wait
const element = page.locator('button').click();  // Missing await!

// ✅ RIGHT - waits for action
await page.locator('button').click();  // Waits for click to complete
```

---

### 🎯 Playwright-Specific Method Categories

#### 1. Navigation Methods (Changing URLs)
```typescript
// Go to a website
await page.goto('https://www.makemytrip.com/');

// Go back (like back button)
await page.goBack();

// Go forward
await page.goForward();

// Refresh
await page.reload();
```

---

#### 2. Locator Methods (Finding Elements)
```typescript
// Find element(s) on page
const button = page.locator('button');  // Returns Locator object
const buttons = page.locator('button').all();  // Gets all buttons

// Different ways to find
page.locator('button')              // CSS selector
page.locator('text=Click Me')       // By text
page.getByRole('button', { name: 'Search' })  // By role
page.getByTestId('search-btn')      // By test ID
page.getByLabel('Email')            // By label
page.getByPlaceholder('Enter email') // By placeholder
```

---

#### 3. Interaction Methods (Doing Things)
```typescript
// Click
await page.locator('button').click();

// Type text
await page.locator('input').fill('hello');

// Select option from dropdown
await page.locator('select').selectOption('option1');

// Check checkbox
await page.locator('input[type="checkbox"]').check();

// Uncheck checkbox
await page.locator('input[type="checkbox"]').uncheck();

// Select radio button
await page.locator('input[type="radio"]').check();

// Press key
await page.locator('input').press('Enter');
```

---

#### 4. Wait Methods (Synchronization)
```typescript
// Wait for element to appear
await page.waitForSelector('button');

// Wait for element to be hidden
await page.waitForSelector('button', { state: 'hidden' });

// Wait for navigation
await page.waitForNavigation();

// Wait for element to be visible? Use waitForSelector or visibility check
await page.locator('button').waitFor({ state: 'visible' });

// Wait for function to be true
await page.waitForFunction(() => document.readyState === 'complete');

// Simple delay (NOT recommended in tests)
await page.waitForTimeout(1000);  // Wait 1 second
```

---

#### 5. Assertion Methods (Verification)
```typescript
import { expect } from '@playwright/test';

// Check element exists and is visible
await expect(page.locator('button')).toBeVisible();

// Check element is not visible
await expect(page.locator('button')).toBeHidden();

// Check element has certain text
await expect(page.locator('button')).toHaveText('Click Me');

// Check URL
await expect(page).toHaveURL('https://www.makemytrip.com/');

// Check page title
await expect(page).toHaveTitle('MakeMyTrip');

// Check attribute value
await expect(page.locator('input')).toHaveAttribute('type', 'email');

// Count elements
await expect(page.locator('.flight')).toHaveCount(5);
```

---

#### 6. Extraction Methods (Getting Information)
```typescript
// Get element text
const text = await page.locator('button').textContent();

// Get HTML
const html = await page.locator('div').innerHTML();

// Get attribute value
const href = await page.locator('a').getAttribute('href');

// Get input value
const value = await page.locator('input').inputValue();

// Count elements
const count = await page.locator('.item').count();

// Get all matching elements
const elements = await page.locator('button').all();
```

---

## 4. Complete Test Execution Flow

### Step-by-Step: From Start to Finish

```
┌─ TEST STARTS ─────────────────────────────────────────────────────┐
│                                                                    │
│ 1. LAUNCH BROWSER                                                │
│    └─ Browser application starts (Chrome/Firefox/Safari)        │
│       Code: const browser = await chromium.launch()             │
│                                                                    │
│ 2. CREATE CONTEXT (Optional but recommended)                    │
│    └─ Create isolated session (like private window)             │
│       Code: const context = await browser.createContext()      │
│                                                                    │
│ 3. CREATE PAGE                                                   │
│    └─ Create tab/webpage to interact with                       │
│       Code: const page = await context.newPage()              │
│                                                                    │
│ 4. GIVEN: Navigate to Website                                   │
│    └─ Open the website                                          │
│       Code: await page.goto('https://www.makemytrip.com/')    │
│       Result: Website loads, page fully rendered                │
│                                                                    │
│ 5. WHEN: Perform Actions                                        │
│    └─ Fill form, click buttons                                  │
│       Code:                                                      │
│         await page.locator('input[name="from"]').fill('Delhi')│
│         await page.locator('button[aria-label="Search"]').click()│
│       Result: Actions performed, page updates                   │
│                                                                    │
│ 6. WAIT FOR RESULTS                                             │
│    └─ Playwright waits for page to finish loading               │
│       Code: await page.waitForSelector('.flightResults')       │
│       Result: Results are visible                               │
│                                                                    │
│ 7. THEN: Verify Results                                         │
│    └─ Check if what we expected happened                        │
│       Code:                                                      │
│         const flightCount = await page.locator('.flight').count()│
│         expect(flightCount).toBeGreaterThan(0)                 │
│       Result: ✅ PASS or ❌ FAIL                                │
│                                                                    │
│ 8. CLEANUP                                                       │
│    └─ Close everything in reverse order                         │
│       Code:                                                      │
│         await page.close()                                     │
│         await context.close()                                  │
│         await browser.close()                                  │
│       Result: All connections closed                            │
│                                                                    │
└─ TEST ENDS ──────────────────────────────────────────────────────┘
```

---

## 5. Code Example: Complete Test Execution

### Without Playwright Test Framework (Manual)
```typescript
import { chromium, Browser, BrowserContext, Page } from 'playwright';

(async () => {
  // 1. LAUNCH BROWSER
  const browser: Browser = await chromium.launch({
    headless: false  // Show browser
  });
  console.log('✓ Browser launched');

  // 2. CREATE CONTEXT (Isolated session)
  const context: BrowserContext = await browser.createContext();
  console.log('✓ Context created');

  // 3. CREATE PAGE
  const page: Page = await context.newPage();
  console.log('✓ Page created');

  try {
    // 4. GIVEN: Navigate to homepage
    console.log('→ Navigating to MakeMyTrip...');
    await page.goto('https://www.makemytrip.com/', {
      waitUntil: 'networkidle'  // Wait until network is idle
    });
    console.log('✓ Homepage loaded');

    // 5. WHEN: Fill search form
    console.log('→ Filling search form...');
    
    // Find and fill "From" field
    const fromInput = page.locator('input[placeholder*="From"]').first();
    await fromInput.click();
    await fromInput.fill('Delhi');
    await page.waitForTimeout(500);  // Wait for suggestions
    await page.locator('.suggestion').first().click();
    console.log('✓ From city selected: Delhi');

    // Find and fill "To" field
    const toInput = page.locator('input[placeholder*="To"]').first();
    await toInput.click();
    await toInput.fill('Mumbai');
    await page.waitForTimeout(500);
    await page.locator('.suggestion').first().click();
    console.log('✓ To city selected: Mumbai');

    // 6. WHEN: Click search button
    console.log('→ Clicking search...');
    const searchButton = page.locator('button[data-cy="submit"]');
    await searchButton.click();
    console.log('✓ Search button clicked');

    // 7. WAIT FOR RESULTS
    console.log('→ Waiting for flight results...');
    await page.waitForSelector('.flightListing', {
      timeout: 30000
    });
    console.log('✓ Flight results loaded');

    // 8. THEN: Verify results
    console.log('→ Verifying results...');
    const flightCount = await page.locator('.flight').count();
    console.log(`✓ Found ${flightCount} flights`);

    if (flightCount > 0) {
      console.log('✅ TEST PASSED: Flights found!');
    } else {
      console.log('❌ TEST FAILED: No flights found!');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  } finally {
    // 9. CLEANUP
    console.log('→ Cleaning up...');
    await page.close();
    await context.close();
    await browser.close();
    console.log('✓ All connections closed');
  }
})();
```

**Output:**
```
✓ Browser launched
✓ Context created
✓ Page created
→ Navigating to MakeMyTrip...
✓ Homepage loaded
→ Filling search form...
✓ From city selected: Delhi
✓ To city selected: Mumbai
→ Clicking search...
✓ Search button clicked
→ Waiting for flight results...
✓ Flight results loaded
→ Verifying results...
✓ Found 25 flights
✅ TEST PASSED: Flights found!
→ Cleaning up...
✓ All connections closed
```

---

### With Playwright Test Framework (Our Framework)
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestDataBuilder } from '../utils/testData';

test('Search and verify flights', async ({ page, browser, context }) => {
  // Playwright handles 1,2,3,8,9 automatically!
  // Browser already launched ✓
  // Context already created ✓
  // Page already created ✓

  // Initialize page objects
  const homePage = new HomePage(page);
  const testData = TestDataBuilder.roundTripDelhi();

  // 4. GIVEN: Navigate to homepage
  await homePage.navigate();  // Handles navigation

  // 5. WHEN: Fill search form
  await homePage.selectFromCity('Delhi');
  await homePage.selectToCity('Mumbai');

  // 6. WHEN: Click search
  await homePage.clickSearch();  // Handles wait internally

  // 7. THEN: Verify results
  const flightCount = await page.locator('.flight').count();
  
  // 8. Assertion
  expect(flightCount).toBeGreaterThan(0);

  // Cleanup automatically handled! ✓
});
```

**Notice:**
- Much cleaner!
- No manual browser/context/page management
- Framework handles everything
- You focus on test logic only

---

## 6. Understanding Async/Await in Playwright

### Why Everything is Async

```typescript
// ❌ WRONG - This won't work!
const element = page.locator('button');
element.click();  // Element might not be ready!
console.log('Clicked!');  // Runs before click actually happens!

// ✅ RIGHT - Use async/await
const element = page.locator('button');
await element.click();  // Waits for click to complete
console.log('Clicked!');  // Runs AFTER click happens
```

### Why Async?
```
Browser operations are SLOW:
1. Send command to browser
2. Browser processes it
3. Browser sends response back
4. Playwright gets response
5. Next command continues

All of this takes time (milliseconds to seconds)!

So Playwright MUST be async - you need to wait for operations.
```

---

## 7. Putting It All Together in Our Framework

### Our Framework Structure
```
TEST (booking.steps.ts)
  ↓
  Uses: HomePage page object
  Uses: BookingPage page object
  Uses: TestDataBuilder for data
  Uses: Logger for logging
  ↓
HOME PAGE OBJECT (pages/HomePage.ts)
  ├─ Private locators (finding elements)
  ├─ Async methods (interactions)
  ├─ Error handling (try-catch)
  └─ Logging (logger.info, logger.error)
  ↓
Playwright Internal (Browser, Context, Page)
  ├─ Browser: Manage Chrome/Firefox
  ├─ Context: Isolated session
  └─ Page: Actual webpage interaction
  ↓
Real Website
  └─ DOM, CSS, JavaScript
```

### Execution in Our Framework

```typescript
test('Scenario: Book flight', async ({ page, browser, context }) => {
  //                                  ↑ Playwright provides these
  
  // Initialize
  const homePage = new HomePage(page);  // Pass page to page object
  
  // Given
  await homePage.navigate();
  // ├─ Uses config.baseUrl (from .env)
  // ├─ Calls: await page.goto(config.baseUrl)
  // ├─ Logs: logger.info('Navigating...')
  // └─ Returns: Promise<void>
  
  // When
  await homePage.selectTripType('RoundTrip');
  // ├─ Finds: private tripTypeRadio locator
  // ├─ Clicks: await radio.check()
  // ├─ Verifies: await expect(radio).toBeChecked()
  // ├─ Logs: logger.info('Trip type selected')
  // └─ Returns: Promise<void>

  // Then
  const isAvailable = await bookingPage.areFlightsAvailable();
  // ├─ Finds: flights on page
  // ├─ Checks: isVisible with timeout
  // ├─ Logs: logger.debug('Checking flights')
  // └─ Returns: Promise<boolean>
  
  expect(isAvailable).toBeTruthy();
  // ├─ Assertion library (Playwright Test)
  // ├─ Result: ✅ PASS or ❌ FAIL
  // └─ Test status reported
});
```

---

## 8. Where Are These Concepts in Our Code?

### Browser, Context, Page
**File:** `Day2/examples/steps/booking.steps.ts`
```typescript
test('Scenario name', async ({ page, browser, context }) => {
  // ↑ These come from Playwright Test framework
  // page = Actual webpage to interact with
  // browser = Browser instance
  // context = Isolated session
});
```

### Navigation Methods
**File:** `Day2/examples/pages/HomePage.ts`
```typescript
async navigate(): Promise<void> {
  // Uses: page.goto(config.baseUrl)
  // This is a NAVIGATION method
}
```

### Locator & Interaction Methods
**File:** `Day2/examples/pages/HomePage.ts`
```typescript
private readonly searchButton: Locator;

async clickSearch(): Promise<void> {
  // Uses: await this.searchButton.click()
  // This is an INTERACTION method
}
```

### Wait Methods
**File:** `Day2/examples/pages/HomePage.ts`
```typescript
async clickSearch(): Promise<void> {
  await this.searchButton.click();
  await this.page.waitForSelector('.flightListing');
  // ↑ This is a WAIT method
}
```

### Assertion Methods
**File:** `Day2/examples/steps/booking.steps.ts`
```typescript
expect(flightsAvailable).toBeTruthy();
// ↑ This is an ASSERTION method
```

### Extraction Methods
**File:** `Day2/examples/pages/BookingPage.ts`
```typescript
async getBookingSummary(): Promise<string | null> {
  const summary = await this.bookingSummary.textContent();
  // ↑ textContent() is an EXTRACTION method
}
```

---

## 9. Quick Reference: All Method Types

| Category | Method | Example | Returns |
|----------|--------|---------|---------|
| **Navigation** | goto | `await page.goto(url)` | Promise |
| **Navigation** | goBack | `await page.goBack()` | Promise |
| **Navigation** | reload | `await page.reload()` | Promise |
| **Locator** | locator | `page.locator('button')` | Locator |
| **Locator** | getByRole | `page.getByRole('button')` | Locator |
| **Locator** | getByTestId | `page.getByTestId('id')` | Locator |
| **Interaction** | click | `await element.click()` | Promise |
| **Interaction** | fill | `await element.fill('text')` | Promise |
| **Interaction** | check | `await element.check()` | Promise |
| **Interaction** | press | `await element.press('Enter')` | Promise |
| **Wait** | waitForSelector | `await page.waitForSelector()` | Promise |
| **Wait** | waitFor | `await element.waitFor()` | Promise |
| **Wait** | waitForNavigation | `await page.waitForNavigation()` | Promise |
| **Assertion** | expect(...).toBeVisible() | `await expect(el).toBeVisible()` | Promise |
| **Assertion** | expect(...).toHaveText() | `await expect(el).toHaveText('text')` | Promise |
| **Extraction** | textContent | `await element.textContent()` | Promise<string> |
| **Extraction** | getAttribute | `await element.getAttribute('attr')` | Promise<string> |
| **Extraction** | inputValue | `await element.inputValue()` | Promise<string> |
| **Extraction** | count | `await element.count()` | Promise<number> |

---

## 10. Corporate Training Path

### Level 1: Understand Fundamentals (This Document)
- [ ] Browser, Context, Page hierarchy
- [ ] Method types (sync vs async)
- [ ] Navigation, Locator, Interaction, Wait, Assertion methods
- [ ] Complete execution flow

### Level 2: Understand Our Framework
- [ ] Read: `Day2/INDUSTRY_STANDARDS_GUIDE.md`
- [ ] Review: `Day2/examples/pages/HomePage.ts`
- [ ] Review: `Day2/examples/pages/BookingPage.ts`
- [ ] Review: `Day2/examples/steps/booking.steps.ts`

### Level 3: Run Tests
```bash
npm run test:day2                    # Run all tests
npm run test:day2 --headed         # See browser
npm run test:day2 --debug          # Step through
npm run report                      # View detailed report
```

### Level 4: Implement
- [ ] Write new test scenario
- [ ] Add method to page object
- [ ] Create custom test data

---

## Summary

| Concept | What is it | When to use |
|---------|-----------|-------------|
| **Browser** | Application (Chrome/Firefox) | Launch/close, create contexts |
| **Context** | Isolated session (private window) | Multiple users, parallel tests |
| **Page** | Single webpage/tab | Most of your code here! |
| **Navigation** | Go to URL, back, forward | `goto()`, `goBack()` |
| **Locator** | Find elements  | `locator()`, `getByRole()` |
| **Interaction** | Click, type, select | `click()`, `fill()`, `check()` |
| **Wait** | Hold until ready | `waitForSelector()`, `waitFor()` |
| **Assertion** | Verify behavior | `expect()` matchers |
| **Extraction** | Get data | `textContent()`, `getAttribute()` |
| **Async/Await** | Wait for operations | Every Playwright call! |

---

**Now you're ready to understand our production framework!**

Next: Read `INDUSTRY_STANDARDS_GUIDE.md` for the enterprise patterns.
