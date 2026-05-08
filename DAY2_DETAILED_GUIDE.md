# Day 2: Detailed Trainer Guide - Advanced UI Testing & Page Object Model

## Learning Objectives
By the end of Day 2, your team will understand:
- Why Page Object Model (POM) is important
- How to structure reusable test code
- How to test complex UI elements
- How to handle popups, alerts, and scrolling
- Introduction to BDD approach

---

## Part 1: Page Object Model (POM) - Why Do We Need It?

### The Problem Without POM

Let's say you need to test MakeMyTrip 100 different ways. Without POM:

```typescript
// Test 1
test('book flights delhi to mumbai', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  await page.locator('input[placeholder*="From"]').fill('Delhi');
  await page.locator('input[placeholder*="To"]').fill('Mumbai');
  await page.locator('input[type="date"]').fill('2024-12-01');
  // ... 20 more lines of code
});

// Test 2
test('book flights delhi to bangalore', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  await page.locator('input[placeholder*="From"]').fill('Delhi');  // REPEATED!
  await page.locator('input[placeholder*="To"]').fill('Bangalore');  // REPEATED!
  await page.locator('input[type="date"]').fill('2024-12-02');  // REPEATED!
  // ... 20 more lines of code
});

// Test 3
test('book flights delhi to pune', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  await page.locator('input[placeholder*="From"]').fill('Delhi');  // REPEATED AGAIN!
  // ... and so on
});
```

**Problems:**
- Code is repeated 100 times (3000+ lines of repetitive code!)
- If selector changes, must fix in 100 places
- Hard to read, hard to maintain
- Easy to make mistakes

### The Solution: Page Object Model

```typescript
// pages/HomePage.ts - Define once, use everywhere
export class HomePage {
  constructor(private page: Page) {}

  async fillFromCity(city: string) {
    await this.page.locator('input[placeholder*="From"]').fill(city);
  }

  async fillToCity(city: string) {
    await this.page.locator('input[placeholder*="To"]').fill(city);
  }

  async selectDate(date: string) {
    await this.page.locator('input[type="date"]').fill(date);
  }
}

// Now in tests - Much cleaner!
test('book flights delhi to mumbai', async ({ page }) => {
  const home = new HomePage(page);
  await home.fillFromCity('Delhi');
  await home.fillToCity('Mumbai');
  await home.selectDate('2024-12-01');
});

test('book flights delhi to bangalore', async ({ page }) => {
  const home = new HomePage(page);
  await home.fillFromCity('Delhi');
  await home.fillToCity('Bangalore');
  await home.selectDate('2024-12-02');
});

test('book flights delhi to pune', async ({ page }) => {
  const home = new HomePage(page);
  await home.fillFromCity('Delhi');
  await home.fillToCity('Pune');
  await home.selectDate('2024-12-03');
});
```

**Benefits:**
- Code written once, used 100 times ✓
- Easy to maintain (change selector in 1 place) ✓
- Tests are readable (describes what test does, not how) ✓
- Team can write tests without knowing selectors ✓

---

## Part 2: Understanding Page Object Model

### Concept: Object-Oriented Approach

```typescript
// Think of a Page Object as a "Representative"
// You don't directly interact with website
// You ask the representative to do things

class HomePage {
  // How to find elements (private - others don't need to know)
  private fromCityInput = 'input[name="from_city"]';
  private toCityInput = 'input[name="to_city"]';
  
  // What to do with elements (public - anyone can use)
  async selectFromCity(city: string) {
    await this.page.locator(this.fromCityInput).fill(city);
  }
}

// Using it:
const home = new HomePage(page);
await home.selectFromCity('Delhi');  // Simple and clear!
```

**Analogy:**
```
Without POM (Direct):
You: "What's the CSS for the search button?"
You: "Now I'll write code to click it"

With POM (Through Representative):
You: "Please click search"
HomePage: "Done! (I know where the search button is, I'll click it)"
```

### File Structure

```
src/
├── pages/
│   ├── BasePage.ts          ← Common functionality
│   ├── HomePage.ts          ← Home page object
│   ├── BookingPage.ts       ← Booking page object
│   ├── ResultsPage.ts       ← Results page object
│   └── PaymentPage.ts       ← Payment page object
│
└── tests/
    ├── booking.spec.ts      ← Test that uses page objects
    ├── search.spec.ts
    └── payment.spec.ts
```

**Principle:** One page object per page on your website

---

## Part 3: Creating Page Objects

### Step 1: Identify What You Need to Do

**On MakeMyTrip Home Page, user can:**
- Select trip type (one-way, round-trip)
- Enter from city
- Enter to city
- Select departure date
- Select return date (if round-trip)
- Select number of passengers
- Select travel class
- Click search

### Step 2: Create Methods for Each Action

```typescript
import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  // Method 1: Select trip type
  async selectTripType(type: 'oneway' | 'roundtrip') {
    // Find the radio button and check it
    await this.page.locator(`input[value="${type}"]`).check();
  }

  // Method 2: Enter from city
  async selectFromCity(city: string) {
    // Find input, clear it, type city
    await this.page.locator('input[name="fromCity"]').fill(city);
  }

  // Method 3: Enter to city
  async selectToCity(city: string) {
    await this.page.locator('input[name="toCity"]').fill(city);
  }

  // Method 4: Select date
  async selectDepartureDate() {
    await this.page.locator('input[placeholder*="Departure"]').click();
    // Choose first available date
    await this.page.locator('.DayPicker-Day').first().click();
  }

  // Method 5: Search
  async clickSearch() {
    await this.page.locator('button[data-cy="submit"]').click();
  }
}
```

### Key Principle: Encapsulation

```typescript
// ❌ DON'T expose selectors in tests
test('search', async ({ page }) => {
  await page.locator('input[name="fromCity"]').fill('Delhi');  // Bad! Selector exposed
});

// ✓ DO hide selectors in page object
test('search', async ({ page }) => {
  const home = new HomePage(page);
  await home.selectFromCity('Delhi');  // Good! Selector hidden
});
```

**Why?** If selector changes, only HomePage needs updating, not 100 tests!

---

## Part 4: Complex UI Elements

### 1. Dropdowns

#### HTML Structure:
```html
<select name="passengers">
  <option value="1">1 Passenger</option>
  <option value="2">2 Passengers</option>
  <option value="3">3 Passengers</option>
</select>
```

#### Page Object Method:
```typescript
async selectPassengers(count: number) {
  // Find select and choose option by value
  await this.page.locator('select[name="passengers"]').selectOption(count.toString());
}
```

#### Test Usage:
```typescript
test('select passengers', async ({ page }) => {
  const home = new HomePage(page);
  await home.selectPassengers(2);  // Simple!
});
```

### 2. Radio Buttons

#### HTML Structure:
```html
<input type="radio" name="tripType" value="oneway"> One Way
<input type="radio" name="tripType" value="roundtrip"> Round Trip
```

#### Page Object Method:
```typescript
async selectTripType(type: string) {
  // Find radio button and check it
  await this.page.locator(`input[type="radio"][value="${type}"]`).check();
}
```

### 3. Checkboxes

#### HTML Structure:
```html
<input type="checkbox" name="preferences" value="refundable"> Refundable
<input type="checkbox" name="preferences" value="direct"> Direct Flights
```

#### Page Object Method:
```typescript
async selectPreference(preference: string) {
  // Check the checkbox
  await this.page.locator(`input[type="checkbox"][value="${preference}"]`).check();
}

async deselectPreference(preference: string) {
  // Uncheck the checkbox
  await this.page.locator(`input[type="checkbox"][value="${preference}"]`).uncheck();
}
```

### 4. Date Pickers

#### HTML Structure:
```html
<input type="date" name="departure">
<div class="calendar">
  <button class="day">1</button>
  <button class="day">2</button>
  ...
</div>
```

#### Page Object Method:
```typescript
async selectDate(day: number) {
  // Click on date input to open calendar
  await this.page.locator('input[type="date"]').click();
  
  // Wait for calendar to appear
  await this.page.waitForSelector('.calendar');
  
  // Click the specific day
  await this.page.locator(`.calendar button.day:has-text("${day}")`).click();
}
```

### 5. Multi-select Dropdowns

```typescript
async selectMultipleOptions(options: string[]) {
  const select = this.page.locator('select[multiple]');
  
  // Select multiple values
  for (const option of options) {
    await select.selectOption(option);
  }
}
```

---

## Part 5: Handling Popups and Alerts

### 1. Modal Popups

#### HTML Structure:
```html
<div class="modal" style="display: block;">
  <div class="modal-content">
    <button class="close">×</button>
    <p>Welcome to MakeMyTrip!</p>
  </div>
</div>
```

#### Page Object Method:
```typescript
async handleWelcomePopup() {
  // Check if popup exists
  const closeBtn = this.page.locator('.modal .close');
  
  // If visible, close it
  if (await closeBtn.isVisible({ timeout: 5000 })) {
    await closeBtn.click();
  }
}
```

#### Better: Try-Catch Pattern:
```typescript
async handleWelcomePopup() {
  try {
    // Try to close popup
    await this.page.locator('.modal .close').click({ timeout: 3000 });
  } catch (e) {
    // Popup didn't exist, that's fine
    console.log('No popup to close');
  }
}
```

### 2. JavaScript Alerts

```typescript
// Handle browser alert
test('handle alert', async ({ page }) => {
  // Listen for alert
  page.on('dialog', async (dialog) => {
    console.log('Alert text:', dialog.message());
    await dialog.accept();  // Click OK
  });

  // Code that triggers alert
  await page.locator('button').click();
});
```

### 3. Confirmation Dialogs

```typescript
test('handle confirmation', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'confirm') {
      await dialog.accept();  // Click OK
      // or
      await dialog.dismiss();  // Click Cancel
    }
  });
});
```

### 4. Dismissing Native Browser Popups

```typescript
// Add to page object navigate method
async navigate() {
  await this.page.goto('https://www.makemytrip.com/');
  
  // Handle any popups that might appear
  try {
    await this.page.locator('[class*="close-button"]').click({ timeout: 2000 });
  } catch (e) {
    // No popup, continue
  }
}
```

---

## Part 6: Handling Scrolling and Visibility

### Issue: Element Not Visible

Many elements on a page might exist in HTML but not be visible (hidden or scrolled off screen).

#### Solution 1: Scroll into view before interacting

```typescript
async selectSeat(seatNumber: string) {
  const seat = this.page.locator(`[data-seat="${seatNumber}"]`);
  
  // Scroll element into view
  await seat.scrollIntoViewIfNeeded();
  
  // Now interact with it
  await seat.click();
}
```

#### Solution 2: Check if in viewport

```typescript
async selectElement(selector: string) {
  const element = this.page.locator(selector);
  
  // Scroll if needed
  const isInViewport = await element.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
  
  if (!isInViewport) {
    await element.scrollIntoViewIfNeeded();
  }
  
  await element.click();
}
```

#### Solution 3: Page scrolling

```typescript
async scrollToBottom() {
  // Scroll to bottom of page
  await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

async scrollToTop() {
  // Scroll to top
  await this.page.evaluate(() => window.scrollTo(0, 0));
}
```

---

## Part 7: Introduction to BDD

### What is BDD?

**BDD = Behavior Driven Development**

It's about writing tests in a way that describes **what the software should do**, not **how it does it**.

### BDD vs Traditional Testing

**Traditional (How focused):**
```typescript
test('test 1', async ({ page }) => {
  await page.locator('.button1').click();
  await page.locator('input[type="text"]').fill('text');
  const result = await page.locator('.result').textContent();
  expect(result).toContain('expected');
});
```

**BDD (What focused):**
```typescript
test('user can search and see results', async ({ page }) => {
  const home = new HomePage(page);
  
  // Given: user is on homepage
  await home.navigate();
  
  // When: user searches for a flight
  await home.selectFromCity('Delhi');
  await home.selectToCity('Mumbai');
  await home.clickSearch();
  
  // Then: results should appear
  const results = new ResultsPage(page);
  await expect.soft(results.getResultCount()).toBeGreaterThan(0);
});
```

### Why BDD Matters

1. **Business understands it**: Non-technical people can read tests
2. **Documentation**: Test names explain what software should do
3. **Clarity**: Clear what's being tested and why
4. **Maintenance**: Easy to understand for future developers

### BDD Test Structure

```typescript
test('Given-When-Then format', async ({ page }) => {
  // ===== GIVEN =====
  // Setup: Create initial conditions
  const home = new HomePage(page);
  await home.navigate();
  
  // ===== WHEN =====
  // Action: Do something
  await home.selectTripType('roundtrip');
  await home.selectFromCity('Delhi');
  await home.selectToCity('Mumbai');
  await home.clickSearch();
  
  // ===== THEN =====
  // Verification: Check results
  const results = new ResultsPage(page);
  await expect(results.flightsList()).toBeVisible();
  const count = await results.getFlightCount();
  expect(count).toBeGreaterThan(0);
});
```

### BDD with Gherkin (Optional)

Some teams use Gherkin syntax (natural language):

```gherkin
Feature: Flight Booking

  Scenario: User searches for round trip flight
    Given user is on MakeMyTrip homepage
    When user selects round trip option
    And user selects Delhi to Mumbai
    And user searches
    Then flight results should be displayed
```

Then implement steps:
```typescript
Given('user is on MakeMyTrip homepage', async function() {
  this.home = new HomePage(this.page);
  await this.home.navigate();
});

When('user selects Delhi to Mumbai', async function() {
  await this.home.selectFromCity('Delhi');
  await this.home.selectToCity('Mumbai');
});
```

---

## Part 8: Building BookingPage Object

### Identify the Requirements

After selecting flights, user lands on Booking page where they can:
- See flight details
- Select fare type
- Enter passenger details
- Select seat
- Proceed to payment
- Verify booking summary

### Build the BookingPage Class

```typescript
import { Page, expect } from '@playwright/test';

export class BookingPage {
  constructor(private page: Page) {}

  // 1. Select which fare to book
  async selectFareType(fareType: 'regular' | 'special') {
    const fareOption = this.page.locator(`[data-cy="${fareType}Fare"]`);
    await expect(fareOption).toBeVisible();  // Verify exists
    await fareOption.click();
  }

  // 2. Enter passenger information
  async enterPassengerDetails(details: {
    name: string;
    email: string;
    phone: string;
  }) {
    // Enter name
    await this.page.locator('input[placeholder*="Full Name"]')
      .fill(details.name);
    
    // Enter email
    await this.page.locator('input[type="email"]')
      .fill(details.email);
    
    // Enter phone
    await this.page.locator('input[type="tel"]')
      .fill(details.phone);
  }

  // 3. Select seat if available
  async selectSeat() {
    const seatSelection = this.page.locator('.seatSelection');
    
    // Check if seat selection exists
    if (await seatSelection.isVisible()) {
      const firstAvailableSeat = seatSelection.locator('.availableSeat').first();
      await firstAvailableSeat.click();
    }
  }

  // 4. Proceed to payment
  async proceedToPayment() {
    const continueBtn = this.page.locator('button:has-text("Continue")');
    await expect(continueBtn).toBeEnabled();  // Verify button is clickable
    await continueBtn.click();
  }

  // 5. Verify booking summary is shown
  async verifyBookingSummary() {
    const summary = this.page.locator('.bookingSummary');
    await expect(summary).toBeVisible();
    return await summary.textContent();
  }
}
```

### Using BookingPage in Tests

```typescript
test('user completes booking', async ({ page }) => {
  // Arrange
  const home = new HomePage(page);
  const booking = new BookingPage(page);
  
  // Act - Navigate and search
  await home.navigate();
  await home.selectFromCity('Delhi');
  await home.selectToCity('Mumbai');
  await home.selectDepartureDate();
  await home.clickSearch();
  
  // Act - Book
  const results = new ResultsPage(page);
  await results.selectFirstFlight();
  
  // Act - Enter details
  await booking.selectFareType('regular');
  await booking.enterPassengerDetails({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  await booking.selectSeat();
  
  // Act - Complete
  await booking.proceedToPayment();
  
  // Assert
  const summary = await booking.verifyBookingSummary();
  expect(summary).toContain('Confirmation');
});
```

---

## Part 9: Exercise for Day 2

### Exercise 1: Understand Existing Page Objects
1. Read [Day2/examples/pages/HomePage.ts](Day2/examples/pages/HomePage.ts)
2. Read [Day2/examples/pages/BookingPage.ts](Day2/examples/pages/BookingPage.ts)
3. Understand what each method does
4. Map methods to actual website actions

### Exercise 2: Create New Methods
Add these methods to HomePage:

```typescript
// Method 1: Handle popups
async handlePopup() {
  // Implement popup closing logic
}

// Method 2: Select travel class
async selectClass(classType: 'economy' | 'business' | 'premium') {
  // Implement class selection
}

// Method 3: Select number of passengers
async selectPassengers(adults: number, children: number = 0) {
  // Implement passenger selection
}
```

### Exercise 3: Write BDD-Style Tests
Create `Day2/examples/mmt-bdd.spec.ts` (already provided, but study it!)

The test should:
1. Define Given/When/Then structure
2. Use page objects
3. Have clear test names showing behavior

### Exercise 4: Test Execution
```bash
npm run test:day2
```

Observe:
- How long tests take
- Whether they pass or fail
- What the errors mean (if any)

---

## Summary of Day 2

**Key Concepts:**
1. **Page Object Model** - Reusable code, maintainable tests
2. **Encapsulation** - Hide selectors, expose actions
3. **Complex UI Elements** - Dropdowns, checkboxes, date pickers
4. **Popups & Alerts** - Handle disturbances
5. **Scrolling** - Make hidden elements visible
6. **BDD Approach** - Write tests that describe behavior

**Best Practices:**
- One page object per page
- Method names describe actions (not clicks)
- Selectors only in page objects
- Clear test structure (Given/When/Then)
- Use interfaces for test data

Next: Day 3 - API Testing & Performance Testing