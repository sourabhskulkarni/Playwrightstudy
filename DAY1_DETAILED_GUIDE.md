# Day 1: Detailed Trainer Guide - TypeScript & Playwright Basics

## Learning Objectives
By the end of Day 1, your team will understand:
- What TypeScript is and why it's important
- How to set up a Playwright project
- How to write your first test
- How to locate and interact with web elements

---

## Lecture 1: Introduction to TypeScript

### What is TypeScript? (15 minutes)

#### Problem it Solves:
```javascript
// JavaScript code - can be confusing!
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
];

// Later in code...
for (let i = 0; i < users.length; i++) {
  console.log(users[i].email);  // ERROR! No email property!
}
```

**The problem:** We didn't know what properties `users[i]` has. We found out too late!

#### TypeScript Solution:
```typescript
// TypeScript - Crystal clear!
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
];

for (let i = 0; i < users.length; i++) {
  console.log(users[i].email);  // ERROR immediately! TypeScript catches it
}
```

**The benefit:** TypeScript catches mistakes before you run the code!

### Why TypeScript for Testing?

| Benefit | Example |
|---------|---------|
| **Prevents typos** | `page.llocator()` → Error caught before test runs |
| **Auto-completion** | Type `page.` → See all available methods |
| **Catches logic errors** | Assignment of wrong types detected |
| **Better documentation** | Code clearly shows what types are expected |
| **Refactoring safety** | Change code, TypeScript tells what breaks |

### Installing TypeScript

We already did this! When we ran:
```bash
npm init playwright@latest
```

It installed:
- TypeScript compiler
- Type definitions for Playwright
- Type definitions for Node.js

---

## Lecture 2: Playwright Fundamentals

### What is Playwright? (15 minutes)

**Screenshot Analogy:**
```
Manual Testing:
1. Open browser
2. Click button (take screenshot)
3. Type text (take screenshot)
4. Verify (take screenshot)
Time: 30 minutes

Playwright:
1. Write code describing steps
2. Run code once
3. Playwright performs all steps automatically
4. Shows report of what happened
Time: 1 minute (after writing test)
```

### The Playwright Architecture

```
Your Computer
    │
    ├─ Playwright (controls browser)
    │   │
    │   ├─ Chrome Browser
    │   ├─ Firefox Browser
    │   └─ Safari Browser
    │
    └─ Website (tested)
        └─ makemytrip.com
```

### Key Concepts

#### 1. **Page Object**
```typescript
// The page object represents the browser tab
test('something', async ({ page }) => {
  // 'page' is the browser tab you're controlling
  await page.goto('https://example.com');
});
```

**What can you do with page?**
- Navigate to URLs
- Click elements
- Fill forms
- Read information
- Take screenshots
- Wait for things

#### 2. **Locators** - Finding Elements
```typescript
// Think of locators as "Finding instructions"
const button = page.locator('button#submit');

// Translation: "Find a button element with id='submit'"
```

**Types of selectors:**
```typescript
// By CSS selector (what you know from HTML)
page.locator('button')                    // All buttons
page.locator('.submit-btn')               // Elements with class "submit-btn"
page.locator('#login-button')             // Element with id "login-button"
page.locator('input[name="email"]')       // Input with name attribute "email"

// By text (what you see on page)
page.locator('text=Login')                // Element containing text "Login"

// By role (most accessible)
page.locator('button:has-text("Login")')  // Button with text "Login"

// Multiple criteria
page.locator('input[type="email"][required]')  // Email input that's required
```

#### 3. **Actions** - Doing Things
```typescript
// Click something
await page.locator('button').click();

// Type in a field  
await page.locator('input').fill('John Doe');

// Select from dropdown
await page.locator('select').selectOption('option1');

// Check checkbox
await page.locator('input[type="checkbox"]').check();

// Get information
const text = await page.locator('h1').textContent();
```

#### 4. **Assertions** - Verifying Things
```typescript
// Check if visible
await expect(page.locator('button')).toBeVisible();

// Check if exists
await expect(page.locator('button')).toBeTruthy();

// Check text content
await expect(page.locator('h1')).toContainText('Welcome');

// Check URL
await expect(page).toHaveURL(/.*search/);
```

---

## Lecture 3: Setting Up Your First Test

### Project Structure Explained

```
PlaywrightStudy/                          ← Your project folder
├── Day1/                                  ← Day 1 materials
│   ├── README.md                          ← Day 1 guide
│   └── examples/
│       └── mmt-basic.spec.ts             ← Day 1 test file
│
├── node_modules/                          ← All installed packages (DON'T EDIT)
│
├── playwright.config.ts                   ← Playwright settings
│   └── Tells Playwright: what browsers to use, where to find tests, etc.
│
├── package.json                           ← List of installed packages
│   └── Like a recipe of what your project needs to run
│
└── tsconfig.json                          ← TypeScript settings
    └── Tells TypeScript how strict to be, what features to allow
```

### File: playwright.config.ts

**Purpose:** Configuration file that tells Playwright how to run

```typescript
export default defineConfig({
  testDir: './Day1/examples',    // Where to find tests
  fullyParallel: true,           // Run tests at same time
  workers: 1,                     // Number of parallel workers
  reporter: 'html',              // Generate HTML report
  use: {
    trace: 'on-first-retry',     // Record trace if test fails
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Key Settings Explained:**
- `testDir`: Where Playwright looks for test files
- `fullyParallel`: Run multiple tests simultaneously (faster!)
- `reporter`: Format of test report (html = web page)
- `projects`: Which browsers to test in

### File: package.json

**Purpose:** Lists what your project depends on

```json
{
  "name": "playwrightstudy",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",           // Run all tests
    "test:day1": "playwright test Day1", // Run Day 1 tests
    "test:ui": "playwright test --ui",   // Interactive mode
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",       // Playwright framework
    "@types/node": "^25.6.1",            // Type info for Node.js
    "typescript": "^5.0.0"               // TypeScript compiler
  }
}
```

**What is `devDependencies`?**
- Packages needed during development (for testing)
- Not needed when software runs in production
- Examples: Testing tools, build tools

---

## Lecture 4: Understanding the First Test

### Code Walkthrough: [Day1/examples/mmt-basic.spec.ts](Day1/examples/mmt-basic.spec.ts)

```typescript
import { test, expect } from '@playwright/test';
```

**What's happening:**
- Importing `test` function → Used to define tests
- Importing `expect` function → Used to verify assertions

**Real-world analogy:**
```
import { test, expect } from '@playwright/test';

Like saying: "I need testing tools from the Playwright library"
Test tool = ability to create and run tests
Expect tool = ability to verify if something is true
```

### The Test Structure

```typescript
test.describe('MakeMyTrip Basic Navigation', () => {
  // This is a test group
  // Multiple related tests go here
  
  test('specific test name', async ({ page }) => {
    // This is a single test
    // Code inside here runs when test executes
  });
});
```

**Why use `test.describe()`?**
```
Without grouping:
- Test 1: Navigate and check logo
- Test 2: Check form fields  
- Test 3: Check buttons

With grouping:
- MakeMyTrip Basic Navigation
  - Navigate and check logo
  - Check form fields
  - Check buttons
```

Much more organized!

### Step-by-Step: What Happens When Test Runs

```typescript
test('Navigate to MakeMyTrip and check basic elements', async ({ page }) => {
```

**1. Test starts** → Creates a fresh browser context
**2. Receives `page` object** → Browser tab ready to use
**3. Execute code inside** → line by line

---

#### Step 1: Navigate to Website
```typescript
await page.goto('https://www.makemytrip.com/');
```

**What happens internally:**
```
1. Browser opens
2. Types URL in address bar
3. Presses Enter
4. Waits for page to load
5. Continues to next line
```

**Why `await`?**
```
Without await (❌ wrong):
page.goto('url');        // Start loading...
page.click('button');    // Button not loaded yet! FAIL!

With await (✓ correct):
await page.goto('url');  // Wait until fully loaded
page.click('button');    // Now button definitely exists
```

---

#### Step 2: Find an Element
```typescript
const logo = page.locator('img[alt*="MakeMyTrip"]');
```

**Breaking down the selector:**
```
img[alt*="MakeMyTrip"]
│   │   │
│   │   └─ Contains "MakeMyTrip" (partial match)
│   └───── alt attribute
└───────── Image element
```

**Meaning:** "Find an image whose alt text contains 'MakeMyTrip'"

**What is `const logo =`?**
- Storing the element location/reference
- Not the actual element yet, just instructions to find it
- Like writing down: "When you need the logo, find it using this selector"

---

#### Step 3: Verify It Exists and Is Visible
```typescript
await expect(logo).toBeVisible();
```

**Breaking it down:**
- `expect(logo)` → "I expect the logo to..."
- `.toBeVisible()` → "...be visible on the page"
- `await` → "Wait and check this condition"

**What happens:**
```
1. Playwright searches for element matching selector
2. Checks if element exists in HTML
3. Checks if element is visible (not hidden/off-screen)
4. If both true → Test passes ✓
5. If either false → Test fails ✗
```

**Common Assertions:**
```typescript
await expect(element).toBeVisible();         // Visible on page
await expect(element).toBeEnabled();         // Not disabled
await expect(element).toHaveText('text');    // Has specific text
await expect(page).toHaveURL('url');         // Page at specific URL
await expect(element).toContainText('part'); // Contains part of text
```

---

## Lecture 5: Types in Day 1 Tests

### TypeScript Types You See in Tests

#### 1. **The page Type**
```typescript
test('example', async ({ page }) => {
  // page is of type Page from @playwright/test
  // TypeScript knows what methods are available:
  page.goto(...)
  page.click(...)
  page.locator(...)
  // If you type wrong, TypeScript catches it:
  page.ggo(...)  // Error! Did you mean page.goto?
});
```

#### 2. **Locator Type**
```typescript
const button = page.locator('button');
// button is a Locator
// Can do: click, fill, check, hover, etc.

const text = await button.textContent();
// text is string | null (might not exist)
```

#### 3. **Async/Await Pattern**
```typescript
// async = this function might wait
test('example', async ({ page }) => {
  // Can use await inside async function
  await page.goto('url');
});

// Without async = cannot use await
test('example', ({ page }) => {
  page.goto('url');  // Error: Cannot use await without async
});
```

---

## Lecture 6: Running Your First Test

### Command Line Navigation

**Opening Terminal in VS Code:**
```
Keyboard: Ctrl + `
Menu: View → Terminal
```

### Running Tests

```bash
# Run all tests
npm test

# Run Day 1 tests specifically
npm run test:day1

# Run single test file
npm test Day1/examples/mmt-basic.spec.ts

# Run in debug mode (slow, can pause)
npm run test:debug

# Run with UI (interactive, visual)
npm run test:ui
```

### Understanding Test Output

```
Running 3 tests using 3 workers

✓ [chromium] › Day1\mmt-basic.spec.ts › Navigate...
✓ [firefox] › Day1\mmt-basic.spec.ts › Navigate...
✓ [webkit] › Day1\mmt-basic.spec.ts › Navigate...

  3 passed (15.2s)

HTML test report generated: file:///D:\PlaywrightStudy\playwright-report/index.html
```

**Explanation:**
- `✓` = Test passed
- `3 tests using 3 workers` = Tests ran in parallel
- `15.2s` = Total time taken
- Three browsers tested (chromium, firefox, webkit)

### Viewing Test Report

```bash
npm run report
```

Opens web page showing:
- Which tests passed/failed
- Time taken for each test
- Screenshots and videos (if enabled)
- Error messages

---

## Lecture 7: How Selectors Work

### Understanding CSS Selectors

```html
<!-- HTML on website -->
<form>
  <input type="text" placeholder="From" name="from_city">
  <input type="text" placeholder="To" name="to_city">
  <button id="search-btn" class="blue-btn">Search</button>
</form>
```

**Finding elements with Playwright:**

```typescript
// By HTML name attribute
page.locator('input[name="from_city"]')

// By type
page.locator('input[type="text"]')

// By placeholder text
page.locator('input[placeholder*="From"]')  // Partial match

// By ID
page.locator('#search-btn')

// By class
page.locator('.blue-btn')

// By element and attribute combination
page.locator('input[name="from_city"][type="text"]')

// By text (what user sees)
page.locator('text=Search')
```

### Debugging Selectors

**How to find the right selector:**

1. **Open Developer Tools** (F12 in browser)
2. **Inspect the element** (Right-click → Inspect)
3. **Look at the HTML** to understand structure
4. **Create selector** based on unique attributes

**Example - Finding the Search button:**
```html
<!-- In DevTools, you see: -->
<button id="search-btn" class="blue-btn primary">Search</button>

<!-- Create selector: -->
page.locator('#search-btn')          ← By ID (most stable)
page.locator('button:has-text("Search")')  ← By visible text
```

---

## Lecture 8: Common Patterns in Day 1

### Pattern 1: Navigate and Check
```typescript
// Common workflow
test('user sees logo', async ({ page }) => {
  // 1. Navigate
  await page.goto('https://www.makemytrip.com/');
  
  // 2. Find element
  const logo = page.locator('img.logo');
  
  // 3. Verify
  await expect(logo).toBeVisible();
});
```

### Pattern 2: Interact and Verify
```typescript
test('user can type in form', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  
  // 1. Fill form field
  const input = page.locator('input[name="city"]');
  await input.fill('Delhi');
  
  // 2. Verify value was entered
  await expect(input).toHaveValue('Delhi');
});
```

### Pattern 3: Click and Wait
```typescript
test('user can search', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  
  // 1. Click button
  const searchBtn = page.locator('button#search');
  await searchBtn.click();
  
  // 2. Wait for results
  await page.waitForSelector('.flight-results');
  
  // 3. Verify results appeared
  const results = page.locator('.flight-results');
  await expect(results).toBeVisible();
});
```

---

## Exercises for Day 1

### Exercise 1: Understand the Code
- Read [Day1/examples/mmt-basic.spec.ts](Day1/examples/mmt-basic.spec.ts)
- Explain each line to a colleague
- Make sure you understand `await`, `locator()`, and `expect()`

### Exercise 2: Run Your First Test
```bash
npm run test:day1
```
- Observe the terminal output
- Understand what passed/failed
- View the HTML report: `npm run report`

### Exercise 3: Create a Simple Test
Create a file: `Day1/examples/mmt-simple.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('check page title', async ({ page }) => {
  await page.goto('https://www.example.com/');
  const title = await page.title();
  console.log('Page title:', title);
});
```

Run it:
```bash
npm test Day1/examples/mmt-simple.spec.ts
```

### Exercise 4: Modify a Selector
- Copy Day1 test
- Change the selector for logo to something else
- See if test still passes or fails
- Understand why

---

## Common Questions & Answers

### Q: What does `async ({ page })` mean?
**A:** 
- `async` = This function might pause/wait
- `({ page })` = Playwright gives us a `page` object to use
- It's parameter destructuring in JavaScript

### Q: Why do we write `.spec.ts`?
**A:** 
- `.spec` = "specification" - this file specifies what should happen
- `.ts` = TypeScript file
- Playwright recognizes this pattern and treats it as a test file

### Q: What does `await` do exactly?
**A:** 
- Pauses execution until the operation completes
- Without `await`, code runs immediately (likely to fail)
- Essential for operations that take time (loading page, finding elements)

### Q: Can I run tests without Playwright server?
**A:** 
- Yes! Playwright runs tests directly
- No external server needed
- Each test starts fresh browser instance

### Q: How do I know what selectors work?
**A:** 
- Open website in browser
- Right-click → Inspect Element
- Look at HTML structure
- Test selector in DevTools console

---

## Summary

**Day 1 Covers:**
1. TypeScript basics and why we use it
2. Playwright fundamentals and architecture
3. Writing your first test
4. Finding elements with selectors
5. Verifying elements and conditions
6. Running tests and viewing reports

**Key Takeaways:**
- TypeScript makes code safer and clearer
- Playwright automates browser interactions
- Selectors find elements on page
- Assertions verify things are correct
- Tests are code that runs automatically

**Next: Day 2 - Advanced UI Testing & Page Object Model**