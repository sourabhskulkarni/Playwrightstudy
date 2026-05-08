# Playwright & TypeScript Training - Complete Beginner's Guide

## Welcome! 👋

This guide is designed for people **completely new to Playwright and TypeScript**. We'll explain everything step-by-step.

---

## Part 1: What is Playwright?

### Simple Definition:
**Playwright** is a tool that allows a computer program to:
- Open a web browser (Chrome, Firefox, Safari)
- Click on buttons automatically
- Type text in forms
- Read information from web pages
- Take screenshots
- Test if web pages work correctly

### Why Do We Need It?
Imagine you need to test a website with 100 different scenarios. Testing manually would take hours. Playwright does this automatically in minutes!

**Real Example with MakeMyTrip:**
```
Manual Testing (Time: 2 hours):
1. Open makemytrip.com
2. Type "Delhi" in From field
3. Type "Mumbai" in To field
4. Select a date
5. Click Search
6. Check if results appear
... (repeat 99 more times)

Playwright Testing (Time: 5 minutes):
Run the script once, and it performs all 100 tests automatically!
```

---

## Part 2: What is TypeScript?

### Simple Definition:
**TypeScript** is an improved version of JavaScript that helps you write safer code.

### JavaScript vs TypeScript Analogy:
```
JavaScript = Writing in pen (mistakes are discovered when running)
TypeScript = Writing with spell-check (mistakes caught before running)
```

### Key Benefits of TypeScript:

#### 1. **Types** - Declaring what kind of data you have
```typescript
// Without TypeScript (JavaScript) - Confusing!
function add(a, b) {
  return a + b;
}
add(5, 10);        // Returns 15 ✓
add("5", "10");    // Returns "510" (not what we wanted!) ✗

// With TypeScript - Clear and Safe!
function add(a: number, b: number): number {
  return a + b;
}
add(5, 10);        // Returns 15 ✓
add("5", "10");    // Error! TypeScript catches this before running ✓
```

#### 2. **Intellisense** - Auto-suggestions in your editor
```
When you type: page.
Your editor shows all possible things you can do with "page":
- page.goto()
- page.click()
- page.fill()
- page.locator()
...and explains what each does
```

#### 3. **Error Detection** - Catch mistakes before running
```typescript
// TypeScript catches this immediately:
const name: string = "John";
name = 123;  // Error: Type 'number' is not assignable to type 'string'
```

---

## Part 3: Setting Up Your First Test

### Step 1: What Gets Installed?

When we ran `npm init playwright@latest`, it installed:

```
@playwright/test          → The main Playwright testing framework
@types/node              → Typescript information about Node.js
typescript               → The TypeScript compiler
```

**What does each do?**
- **@playwright/test**: Allows you to write and run browser tests
- **@types/node**: Tells TypeScript about built-in Node.js features
- **typescript**: Converts TypeScript code to JavaScript (computers understand JavaScript)

### Step 2: Project Structure

```
PlaywrightStudy/
├── Day1/
│   └── examples/
│       └── mmt-basic.spec.ts    ← TypeScript test file
├── Day2/
│   └── examples/
│       ├── pages/
│       │   ├── HomePage.ts
│       │   └── BookingPage.ts
│       └── mmt-booking.spec.ts
├── playwright.config.ts         ← Configuration file
├── package.json                 ← List of installed packages
└── tsconfig.json               ← TypeScript settings
```

**What does each file do?**

| File | Purpose |
|------|---------|
| `.spec.ts` | Test files (the `.spec` part means "specification") |
| `playwright.config.ts` | Settings for how Playwright should run |
| `package.json` | List of all tools/packages you installed |
| `tsconfig.json` | Settings for how TypeScript should work |

---

## Part 4: Understanding a Simple Test

Let's break down [Day1/examples/mmt-basic.spec.ts](Day1/examples/mmt-basic.spec.ts):

### The Code:
```typescript
import { test, expect } from '@playwright/test';

test.describe('MakeMyTrip Basic Navigation', () => {
  test('Navigate to MakeMyTrip and check basic elements', async ({ page }) => {
    // Navigate to MakeMyTrip
    await page.goto('https://www.makemytrip.com/');

    // Check if logo is visible
    const logo = page.locator('img[alt*="MakeMyTrip"]');
    await expect(logo).toBeVisible();
    
    // ... more code
  });
});
```

### Line-by-Line Explanation:

#### Line 1: Importing Tools
```typescript
import { test, expect } from '@playwright/test';
```
**Translation:** "Hey TypeScript, I need the tools `test` and `expect` from the Playwright library"

**What are `test` and `expect`?**
- `test`: Used to define what you want to test
- `expect`: Used to verify that something is true

#### Line 3: Describing Your Test Group
```typescript
test.describe('MakeMyTrip Basic Navigation', () => {
  // multiple tests go here
});
```
**Translation:** "I'm creating a group of tests called 'MakeMyTrip Basic Navigation'"

**Why group tests?** Makes it organized and easier to read reports. It's like organizing clothes:
```
Folder: "MakeMyTrip Basic Navigation"
  - Test 1: Check logo
  - Test 2: Check form fields
  - Test 3: Check buttons
```

#### Line 4: Defining a Single Test
```typescript
test('Navigate to MakeMyTrip and check basic elements', async ({ page }) => {
```

**Breaking it down:**

- `test(...)` - Creates one test
- `'Navigate to MakeMyTrip...'` - The test's name (describes what it does)
- `async` - Magic word meaning "this code might need to wait"
- `({ page })` - The browser page object that Playwright provides to us
- `=>` - Arrow function syntax (code inside the curly braces runs when test starts)

**Why `async`?** 
Because opening a browser, clicking buttons, and waiting for elements takes time!
```typescript
// Without async - Would try to continue before elements load ✗
test('bad test', ({ page }) => {
  page.goto('https://...');           // Starting to load...
  page.click('button');                // Might not exist yet! ERROR!
});

// With async - Waits for each step to complete ✓
test('good test', async ({ page }) => {
  await page.goto('https://...');      // Wait until page loads
  await page.click('button');          // Now find and click
});
```

#### Line 6: Navigating to Website
```typescript
await page.goto('https://www.makemytrip.com/');
```

**What it does:**
1. Opens a browser
2. Navigates to the URL
3. Waits (`await`) for the page to load
4. Then continues to next line

**Translation:** "Browser, go to makemytrip.com and wait until it's loaded"

**What is `await`?**
```typescript
// Without await - Code continues immediately (wrong!)
page.goto('url');
page.click('button');  // Button might not exist yet!

// With await - Waits for previous line to finish
await page.goto('url');  // Waits for page to load
await page.click('button');  // Now button definitely exists
```

#### Line 9-10: Finding and Checking Elements
```typescript
const logo = page.locator('img[alt*="MakeMyTrip"]');
await expect(logo).toBeVisible();
```

**Breaking it down:**

1. **`page.locator(...)`** - Finds an element on the page
   - `img` - We're looking for an image
   - `[alt*="MakeMyTrip"]` - With "MakeMyTrip" in its alt text
   - **Metaphor:** Like saying "Find the image that has 'MakeMyTrip' in its description"

2. **`const logo =`** - Storing the result in a variable called "logo"
   - `const` means this variable won't change
   - It's like labeling a box: "I found the logo element, let me save it"

3. **`await expect(logo).toBeVisible()`** - Checking if the logo exists and is visible
   - `expect()` - "I expect something to be true"
   - `.toBeVisible()` - "The logo should be visible"
   - `await` - "Wait until we confirm this"
   - **Result:** Test passes ✓ if logo is visible, fails ✗ if not

**Real-life analogy:**
```typescript
// Finding a person in an office
const manager = office.locator('person[name*="John"]');
// Checking if they're present and working
await expect(manager).toBeVisible();
```

---

## Part 5: TypeScript Concepts You Need to Know

### 1. Variables and Types
```typescript
// Without type (dangerous)
let name = "John";
name = 123;  // Works in JavaScript, but wrong!

// With type (safe)
let name: string = "John";
name = 123;  // Error! TypeScript catches this
```

### 2. Common Types
```typescript
const age: number = 25;           // Whole numbers
const height: number = 5.8;       // Decimal numbers
const isStudent: boolean = true;  // true/false
const fullName: string = "John";  // Text

// Multiple possible types
const result: number | string = "John";  // Can be number OR string
```

### 3. Collections - Arrays and Objects
```typescript
// Array of numbers
const scores: number[] = [95, 87, 92];
scores.push(88);  // Add to array

// Object with specific properties
const person: { name: string; age: number } = {
  name: "John",
  age: 25
};
```

### 4. Functions with Types
```typescript
// Function that takes a name (string) and returns a greeting (string)
function greet(name: string): string {
  return "Hello, " + name;
}

// Using the function
const greeting = greet("John");  // Returns: "Hello, John"
greet(123);  // Error! Expected string, got number
```

### 5. Interfaces - Templates for Objects
```typescript
// Define what a User should look like
interface User {
  name: string;
  email: string;
  age: number;
}

// Create a user following this template
const user: User = {
  name: "John",
  email: "john@example.com",
  age: 25
};

// This would cause an error (missing email)
const badUser: User = {
  name: "John",
  age: 25
  // ERROR: Property 'email' is missing
};
```

---

## Part 5.5: Advanced TypeScript - Parameters, Promises & Returns

This section covers three key concepts used heavily in Playwright framework code.

### 1. Parameterised Functions (Functions with Parameters)

**What are Parameters?**
Parameters are values you pass TO a function. They're like function "inputs".

#### Basic Example:
```typescript
// Function WITHOUT parameters (works, but limited)
function greet() {
  return "Hello";
}
greet();  // Always returns "Hello"

// Function WITH parameters (more flexible!)
function greet(name: string): string {
  return "Hello, " + name;
}
greet("John");   // Returns "Hello, John"
greet("Sarah");  // Returns "Hello, Sarah"
```

**Real Analogy:**
```typescript
// Without parameters - Like a vending machine with only one button
pressButton();  // Always gives you Coke

// With parameters - Like a modern vending machine with choices
selectDrink("Coke");      // I want Coke
selectDrink("Sprite");    // I want Sprite
selectDrink("Fanta");     // I want Fanta
```

#### Used in Playwright Framework:

**Example 1: Page Object with Parameters**
```typescript
// In HomePage.ts (Page Object)
class HomePage {
  // This method accepts parameters
  async selectFromCity(cityName: string): Promise<void> {
    const fromInput = this.page.locator('input[placeholder="From"]');
    await fromInput.fill(cityName);
  }

  async selectToCity(cityName: string): Promise<void> {
    const toInput = this.page.locator('input[placeholder="To"]');
    await toInput.fill(cityName);
  }
}

// Using in test with different parameters
const homePage = new HomePage(page);
await homePage.selectFromCity("Delhi");      // Parameter: "Delhi"
await homePage.selectFromCity("Mumbai");     // Parameter: "Mumbai"
await homePage.selectFromCity("Bangalore");  // Parameter: "Bangalore"
```

**Example 2: Function with Multiple Parameters**
```typescript
// Function accepts multiple inputs
async function searchFlight(
  fromCity: string,
  toCity: string,
  date: string,
  passengers: number
): Promise<void> {
  const homePage = new HomePage(page);
  
  await homePage.selectFromCity(fromCity);
  await homePage.selectToCity(toCity);
  await homePage.selectDate(date);
  await homePage.selectPassengers(passengers);
  await homePage.clickSearch();
}

// Calling with different values
await searchFlight("Delhi", "Mumbai", "2025-05-15", 2);
await searchFlight("Delhi", "Goa", "2025-06-20", 4);
await searchFlight("Mumbai", "Bangalore", "2025-07-10", 1);
```

**Why Parameters Matter in Testing:**
```typescript
// ❌ BAD - Code repeated, hard to maintain
async function testBooking1() {
  await page.fill('input[name="from"]', "Delhi");
  await page.fill('input[name="to"]', "Mumbai");
}
async function testBooking2() {
  await page.fill('input[name="from"]', "Delhi");
  await page.fill('input[name="to"]', "Goa");
}
// ... copy-paste nightmare!

// ✓ GOOD - Reusable function with parameters
async function fillFlightDetails(from: string, to: string) {
  await page.fill('input[name="from"]', from);
  await page.fill('input[name="to"]', to);
}
await fillFlightDetails("Delhi", "Mumbai");   // Test 1
await fillFlightDetails("Delhi", "Goa");      // Test 2
```

---

### 2. Return Types (Functions Returning Values)

**What is a Return Type?**
A return type describes what value the function will give back to you.

#### Basic Example:
```typescript
// Function that returns a string
function getGreeting(): string {
  return "Hello!";
}
const result = getGreeting();  // result is now "Hello!"

// Function that returns a number
function calculateTotal(price1: number, price2: number): number {
  return price1 + price2;
}
const total = calculateTotal(100, 50);  // total is 150

// Function that returns nothing (void)
function printMessage(): void {
  console.log("This function doesn't return anything");
}
```

**Syntax Explanation:**
```typescript
function functionName(params): ReturnType {
  return value;
}

// Examples:
function add(a: number, b: number): number {
  return a + b;  // Must return a NUMBER
}

function greet(name: string): string {
  return "Hello, " + name;  // Must return a STRING
}

function checkVisibility(element): boolean {
  return element.isVisible();  // Must return true/false
}

function doSomething(): void {
  console.log("Done");
  // Returns NOTHING (void means "no return value")
}
```

#### Used in Playwright Framework:

**Example 1: Page Object Methods with Returns**
```typescript
// In HomePage.ts
class HomePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Returns a Locator (the element found)
  getFromCityInput(): Locator {
    return this.page.locator('input[placeholder="From"]');
  }

  // Returns a string (the text content)
  async getPageTitle(): Promise<string> {
    return await this.page.locator('h1').innerText();
  }

  // Returns a boolean (true/false)
  async isSearchButtonVisible(): Promise<boolean> {
    return await this.page.locator('button:has-text("Search")').isVisible();
  }

  // Returns nothing (void)
  async clickSearch(): Promise<void> {
    await this.page.locator('button:has-text("Search")').click();
  }
}

// Using these methods:
const homePage = new HomePage(page);

// Gets a Locator back
const fromInput = homePage.getFromCityInput();
await fromInput.fill("Delhi");

// Gets a string back
const title = await homePage.getPageTitle();
console.log(title);  // Prints the page title

// Gets a boolean back
const isVisible = await homePage.isSearchButtonVisible();
if (isVisible) {
  console.log("Search button is visible!");
}

// Returns nothing
await homePage.clickSearch();  // Just performs action
```

**Example 2: API Client with Return Types**
```typescript
// In ApiClient.ts
class ApiClient {
  async searchFlights(from: string, to: string): Promise<Flight[]> {
    // Returns an array of Flight objects
    const response = await apiRequest.get('/search', {
      params: { from, to }
    });
    return response.flights;
  }

  async getFlightPrice(flightId: string): Promise<number> {
    // Returns a single number (the price)
    const response = await apiRequest.get(`/flights/${flightId}`);
    return response.price;
  }

  async bookFlight(flightId: string): Promise<Booking> {
    // Returns a Booking object with confirmation details
    const response = await apiRequest.post('/bookings', {
      flightId
    });
    return response.booking;
  }
}

// Using these methods:
const apiClient = new ApiClient();

// Gets an array back
const flights = await apiClient.searchFlights("Delhi", "Mumbai");
flights.forEach(flight => console.log(flight.name));

// Gets a number back
const price = await apiClient.getFlightPrice("FL123");
console.log(`Price: ₹${price}`);

// Gets a Booking object back
const booking = await apiClient.bookFlight("FL123");
console.log(booking.confirmationCode);
```

---

### 3. Promises (Handling Async Operations)

**What is a Promise?**
A Promise is a way to handle operations that take time (like network requests or page loads).

#### Simple Explanation:
```typescript
// Think of a Promise like ordering food at a restaurant:

// WITHOUT Promise (doesn't work in real life)
function orderFood() {
  const food = kitchen.prepare();  // Takes 30 minutes!
  console.log("Got food!");        // Prints immediately (wrong!)
}

// WITH Promise (real life)
function orderFood(): Promise<Food> {
  return new Promise((resolve) => {
    // Kitchen takes 30 minutes to prepare
    kitchen.prepare((food) => {
      resolve(food);  // When done, give customer the food
    });
  });
}

// Using it correctly
const food = await orderFood();  // Wait 30 minutes
console.log("Got food!");        // Print after food is ready
```

#### Promise States:
```typescript
// Promise can be in 3 states:

// 1. PENDING - Still waiting
const promise = new Promise((resolve) => {
  setTimeout(() => resolve("Done!"), 2000);  // Will wait 2 seconds
});
// Promise is PENDING for now...

// 2. RESOLVED - Success! Got the value
const promise = new Promise((resolve) => {
  resolve("Success!");
});
// Promise is RESOLVED

// 3. REJECTED - Error! Something went wrong
const promise = new Promise((_, reject) => {
  reject("Failed!");
});
// Promise is REJECTED
```

#### Syntax:
```typescript
// Promise that returns a value
Promise<string>          // Will eventually give you a string
Promise<number>          // Will eventually give you a number
Promise<boolean>         // Will eventually give you true/false
Promise<User[]>          // Will eventually give you array of Users
Promise<void>            // Will eventually complete (no return value)

// Using async/await with promises
async function doSomething(): Promise<string> {
  const result = await someAsyncFunction();
  return result;
}
```

#### Used in Playwright Framework:

**Example 1: Basic Playwright Methods (All Return Promises)**
```typescript
// All of these return Promises!

// This promise resolves when page loads
await page.goto('https://makemytrip.com');

// This promise resolves when element is clicked
await page.click('button');

// This promise resolves when text is returned
const text = await page.innerText('h1');

// This promise resolves when assertion passes
await expect(page.locator('button')).toBeVisible();
```

**Why we need `await`:**
```typescript
// WITHOUT await - doesn't wait for promise to complete
page.goto('url');
page.click('button');  // ❌ Page might not be loaded yet!

// WITH await - waits for each promise
await page.goto('url');     // Wait for page to load ✓
await page.click('button');  // Now click (page is ready) ✓
```

**Example 2: Page Object Methods Returning Promises**
```typescript
// In HomePage.ts - All async methods return Promises
class HomePage {
  async fillSearchForm(from: string, to: string): Promise<void> {
    // Promise<void> means: this takes time, then completes (no return value)
    await this.page.fill('input[placeholder="From"]', from);
    await this.page.fill('input[placeholder="To"]', to);
  }

  async clickSearch(): Promise<void> {
    // Promise<void>
    await this.page.click('button:has-text("Search")');
  }

  async getFlightCount(): Promise<number> {
    // Promise<number> means: this takes time, then returns a number
    const count = await this.page.locator('[data-testid="flight"]').count();
    return count;
  }

  async isFlightAvailable(flightName: string): Promise<boolean> {
    // Promise<boolean> means: this takes time, then returns true/false
    const element = await this.page.locator(`text=${flightName}`);
    return element.isVisible();
  }
}

// Using with await:
const homePage = new HomePage(page);

// Waiting for method to complete
await homePage.fillSearchForm("Delhi", "Mumbai");

// Waiting and getting a number back
const count = await homePage.getFlightCount();
console.log(`Found ${count} flights`);

// Waiting and getting a boolean back
const available = await homePage.isFlightAvailable("Air India");
if (available) {
  console.log("Flight is available!");
}
```

**Example 3: API Calls (Complex Promises)**
```typescript
// In ApiClient.ts
class ApiClient {
  // Promise<Flight[]> - Returns array of flights after async operation
  async searchFlights(from: string, to: string): Promise<Flight[]> {
    try {
      const response = await apiContext.get('/api/search', {
        params: { from, to }
      });
      const data = await response.json();
      return data.flights;  // Return the Promise resolution value
    } catch (error) {
      return [];  // Return empty array if error
    }
  }

  // Promise<Booking> - Returns booking confirmation
  async bookFlight(flightId: string, passengerDetails: any): Promise<Booking> {
    const response = await apiContext.post('/api/bookings', {
      data: { flightId, ...passengerDetails }
    });
    return await response.json();  // Return the booking object
  }
}

// Using in test:
const client = new ApiClient();

// Wait for search result
const flights = await client.searchFlights("Delhi", "Mumbai");
console.log(`Found ${flights.length} flights`);

// Wait for booking to complete
const booking = await client.bookFlight("FL123", { name: "John" });
console.log(`Confirmation: ${booking.confirmationCode}`);
```

---

### How They Work Together in Framework:

**Real Example from Day 2 (Page Object Model):**
```typescript
class BookingPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Parameterised function returning a Promise
  async selectSeat(seatNumber: string): Promise<void> {
    const seatLocator = this.page.locator(`[data-seat="${seatNumber}"]`);
    await seatLocator.click();
  }

  // Parameterised function returning a Promise with value
  async getTotalPrice(numberOfPassengers: number): Promise<number> {
    const basePriceElement = this.page.locator('[data-testid="base-price"]');
    const basePrice = parseFloat(await basePriceElement.innerText());
    const totalPrice = basePrice * numberOfPassengers;
    return totalPrice;  // Returning the calculated price
  }

  // Parameterised function with multiple params returning Promise
  async fillPassengerDetails(
    name: string,
    email: string,
    phone: string
  ): Promise<void> {
    await this.page.fill('input[name="name"]', name);
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="phone"]', phone);
  }
}

// Using in test:
const bookingPage = new BookingPage(page);

// Parameterised, returns Promise<void>
await bookingPage.selectSeat("12A");

// Parameterised, returns Promise<number>
const price = await bookingPage.getTotalPrice(2);  // 2 passengers
console.log(`Total: ₹${price}`);

// Multiple parameters, returns Promise<void>
await bookingPage.fillPassengerDetails(
  "John Doe",
  "john@example.com",
  "9876543210"
);
```

---

### Summary Table:

| Concept | Purpose | Framework Example | Syntax |
|---------|---------|-------------------|--------|
| **Parameters** | Pass data TO function | `selectFromCity("Delhi")` | `async function(param: type)` |
| **Return Type** | Function gives back data | `getFlightCount(): Promise<number>` | `: ReturnType` |
| **Promise** | Handle async operations | `await page.goto()` | `Promise<DataType>` |

---

## Part 6: Key Playwright Methods Explained

### Navigation
```typescript
// Go to a website
await page.goto('https://example.com');

// Go back (like browser back button)
await page.goBack();

// Go forward (like browser forward button)
await page.goForward();

// Refresh the page
await page.reload();
```

### Finding Elements (Locators)
```typescript
// By CSS class
page.locator('.button-class')

// By HTML ID
page.locator('#button-id')

// By text content
page.locator('text=Click Me')

// By role (most recommended)
page.locator('button[role="button"]')

// By partial text
page.locator('text=/Click/i')  // Case-insensitive
```

### Interacting with Elements
```typescript
// Click a button
await page.locator('button').click();

// Type in an input field
await page.locator('input').fill('John');

// Check a checkbox
await page.locator('input[type="checkbox"]').check();

// Select from dropdown
await page.locator('select').selectOption('option1');

// Get text content
const text = await page.locator('h1').textContent();

// Get attribute
const alt = await page.locator('img').getAttribute('alt');
```

### Waiting and Verification
```typescript
// Wait for element to be visible (smart wait)
await expect(page.locator('button')).toBeVisible();

// Wait for element to exist in DOM
await page.waitForSelector('button');

// Wait for page to load completely
await page.waitForLoadState('networkidle');

// Wait for custom condition
await page.waitForFunction(() => document.querySelectorAll('li').length > 5);

// Wait fixed time (use sparingly!)
await page.waitForTimeout(2000);  // Wait 2 seconds
```

---

## Part 7: Running Your First Test

### Step 1: Open Terminal
```
In VS Code: View → Terminal (or Ctrl + `)
```

### Step 2: Run a Simple Test
```bash
npm run test:day1
```

**What happens:**
1. Playwright opens a browser
2. Navigates to the website
3. Performs all the actions
4. Checks if everything passed
5. Shows results in terminal
6. Generates HTML report

### Step 3: View Results
```bash
npm run report
```

This opens an HTML report showing:
- Which tests passed ✓
- Which tests failed ✗
- Screenshots and videos (if enabled)
- Time taken for each test

---

## Part 8: Common Beginner Mistakes

### Mistake 1: Forgetting `await`
```typescript
// ❌ Wrong - Code continues before element loads
page.goto('url');
page.click('button');

// ✓ Correct - Waits for completion
await page.goto('url');
await page.click('button');
```

### Mistake 2: Wrong Selector
```typescript
// ❌ Selector doesn't exist on page
page.locator('input[name="xyz"]')  // This field doesn't exist!

// ✓ Check the actual page to get right selector
page.locator('input[name="from_city"]')  // Correct HTML attribute
```

### Mistake 3: Not Waiting for Elements
```typescript
// ❌ Element might not exist yet
const button = page.locator('button');
await button.click();  // Might fail!

// ✓ Wait for element to exist first
const button = page.locator('button');
await expect(button).toBeVisible();
await button.click();
```

### Mistake 4: Hardcoding Values
```typescript
// ❌ Hard to maintain - what if price changes?
expect(price).toBe('5000');

// ✓ Better - check if it's a reasonable value
expect(price).toMatch(/[0-9]+/);  // Any number is fine
```

---

## Part 9: Test Naming Convention

### Good Test Names
```typescript
// ✓ Clear, describes what is tested
test('should display error when email is invalid', async ({ page }) => {

// ✓ Describes the expected behavior
test('should navigate to results page when user clicks search', async ({ page }) => {

// ✓ Context + Action + Expected result
test('MakeMyTrip: User books a round trip flight from Delhi to Mumbai', async ({ page }) => {
```

### Bad Test Names
```typescript
// ✗ Too vague
test('test1', async ({ page }) => {

// ✗ Doesn't explain what it tests
test('page test', async ({ page }) => {

// ✗ Technical jargon instead of behavior
test('assert DOM element visible', async ({ page }) => {
```

---

## Part 10: Quick Reference Guide

### Project Structure
```
Your Test                What it does
├─ navigate()           Opens a website
├─ locator()            Finds elements on page
├─ click()              Clicks on element
├─ fill()               Types text
├─ expect()             Verifies something is true
└─ waitFor...()         Waits for conditions
```

### Test Execution
```bash
npm run test:day1        # Run Day 1 tests
npm run test:day2        # Run Day 2 tests  
npm run test:ui          # Run with visual UI
npm run test:debug       # Debug mode (pause/step through)
npm run report           # View test report
```

### TypeScript Cheat Sheet
```typescript
// Declare variables with types
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;

// Function with types
async function login(email: string): Promise<boolean> {
  // code here
  return true;
}

// Interface for objects
interface TestData {
  username: string;
  password: string;
}

// Using the interface
const credentials: TestData = {
  username: "user",
  password: "pass"
};
```

---

## Next Steps

1. **Read** this guide completely
2. **Look at** Day1 examples and understand each line
3. **Run** the tests: `npm run test:day1`
4. **Modify** a test slightly to see how it changes
5. **Experiment** - Try changing selectors, adding clicks, etc.

**Don't worry if you don't understand everything immediately. Testing is learned by doing!**

Good luck! 🚀