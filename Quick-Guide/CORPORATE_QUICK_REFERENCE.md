# 🏢 Corporate BDD Framework - Quick Reference Guide

## For Corporate Employees & Trainees

**⭐ START HERE → [PLAYWRIGHT_FUNDAMENTALS.md](Day2/PLAYWRIGHT_FUNDAMENTALS.md)**

This guide assumes you've read the fundamentals. If you're new to Playwright, **read Playwright Fundamentals first** to understand:
- What is Browser, Context, Page
- What methods do what
- How tests execute from start to finish

---

This is your quick reference guide to understanding the production-ready BDD framework created for MakeMyTrip booking automation.

---

## 🎯 Core Concepts (What Makes This "Corporate Standard")

### 1. Configuration Externalization
**Problem:** Hardcoding URLs breaks in different environments
**Solution:** Use `.env` file

```typescript
// ❌ WRONG - Hardcoded
await page.goto('https://www.makemytrip.com/');

// ✅ RIGHT - From environment
import { config } from './config/config';
await page.goto(config.baseUrl);
```

**Real World:** You can test against Dev, QA, Staging, or Production URLs by just changing `.env`

---

### 2. Page Object Model with Private Locators
**Problem:** Tests break when selectors change, creating brittleness
**Solution:** Encapsulate all locators

```typescript
// ❌ WRONG - Direct locator access
page.locator('button[data-cy="submit"]').click();

// ✅ RIGHT - Through page object
export class HomePage {
  private readonly searchButton: Locator;  // PRIVATE!
  
  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }
}

// Test uses page object, not locator
await homePage.clickSearch();
```

**Real World:** When developers change HTML, only page object needs updating, not 50 tests

---

### 3. Type-Safe Methods
**Problem:** Easy to pass wrong parameters, causes runtime errors
**Solution:** Use TypeScript strict typing

```typescript
// ❌ WRONG - Generic string
async selectTripType(tripType: string) {
  // Wrong value won't be caught until runtime
}

// ✅ RIGHT - Strict typing
async selectTripType(tripType: 'OneWay' | 'RoundTrip'): Promise<void> {
  // IDE prevents wrong values - caught immediately
}
```

**Real World:** Your IDE catches mistakes before code runs

---

### 4. Error Handling in Every Step
**Problem:** Vague test failures are hard to debug
**Solution:** Log and handle every step

```typescript
// ❌ WRONG - No context
async navigate() {
  await this.page.goto('https://www.makemytrip.com/');
}

// ✅ RIGHT - Logging and error handling
async navigate(): Promise<void> {
  try {
    logger.info('Navigating to homepage', { url: config.baseUrl });
    await this.page.goto(config.baseUrl, { waitUntil: 'networkidle' });
    logger.info('Navigation successful');
  } catch (error) {
    logger.error('Navigation failed', error);
    throw error;
  }
}
```

**Real World:** When test fails, logs show exactly what went wrong and where

---

### 5. Test Data Builder Pattern
**Problem:** Test data scattered across tests, hard to reuse
**Solution:** Use builder pattern

```typescript
// ❌ WRONG - Inline data
const name = 'John Doe';
const email = 'john@example.com';
const phone = '9876543210';

// ✅ RIGHT - Builder pattern
const testData = new TestDataBuilder()
  .withPassenger({ name, email, phone })
  .build();

// Pre-built scenarios
const roundTrip = TestDataBuilder.roundTripDelhi();
```

**Real World:** Reuse data across 100s of tests, update once, all tests use new data

---

## 📁 File Structure Explained

```
Day2/examples/
└── .env                          # Configuration (URLs, timeouts, etc.)
    ├── BASE_URL=https://...      # Where tests run
    ├── HEADLESS=true             # Browser visibility
    └── DEFAULT_TIMEOUT=30000     # How long to wait

├── config/
│   └── config.ts                 # Loads and validates .env
    └── Provides: config.baseUrl, config.timeout, etc.

├── pages/
│   ├── HomePage.ts               # Homepage interactions
│   │   └── Private: searchButton, fromCityInput
│   │   └── Public: navigate(), selectFromCity(), clickSearch()
│   │
│   └── BookingPage.ts            # Booking interactions
│       └── Private: nameInput, emailInput, phoneInput
│       └── Public: enterTravellerDetails(), selectSeat(), proceedToPayment()

├── steps/
│   └── booking.steps.ts          # BDD test scenarios
│       ├── Scenario 1: Book round trip flight
│       ├── Scenario 2: Book one-way flight
│       └── Scenario 3: Verify passenger details

├── utils/
│   ├── testData.ts               # Builder pattern for test data
│   │   └── TestDataBuilder.roundTripDelhi()
│   │   └── TestDataBuilder.oneWayBangalore()
│   │
│   └── logger.ts                 # Structured logging
│       └── logger.info(), logger.error(), etc.

└── features/
    └── booking.feature           # Gherkin format (documentation only)
```

---

## 🔄 How a Test Works (Step by Step)

### Example: Book a Flight

```
1. Load Configuration (.env)
   ↓
2. Initialize Page Objects
   - new HomePage(page)
   - new BookingPage(page)
   ↓
3. Get Test Data
   - TestDataBuilder.roundTripDelhi()
   ↓
4. Execute Test Scenario
   
   // Given: User on homepage
   logger.info('Navigate to MakeMyTrip')
   await homePage.navigate()
   // navigate() uses config.baseUrl, not hardcoded!
   
   // When: Select options
   logger.info('Select round trip')
   await homePage.selectTripType('RoundTrip')
   // type 'RoundTrip' is enforced by TypeScript!
   
   // Then: Verify results
   logger.info('Check flights displayed')
   expect(flightsAvailable).toBeTruthy()
   
   ↓
5. Log Output
   [INFO] Navigate to MakeMyTrip
   [INFO] Successfully navigated to homepage
   [INFO] Select round trip
   [INFO] Round trip selected successfully
   [INFO] Check flights displayed
   [PASS] Test completed
```

---

## 💡 Real-World Corporate Scenarios

### Scenario 1: Adding a New Test
**Requirement:** Test booking with 3 passengers

```typescript
// Create custom test data
const customTestData = new TestDataBuilder()
  .withSearchCriteria({ fromCity: 'Delhi', toCity: 'Mumbai' })
  .withDefaultPassengers(3)  // 3 passengers instead of 2
  .build();

// Write test using page objects
test('Book flight for 3 passengers', async ({ page }) => {
  const homePage = new HomePage(page);
  const bookingPage = new BookingPage(page);
  
  await homePage.navigate();
  await homePage.selectPassengers(3);  // Type-safe!
  await homePage.clickSearch();
  
  await bookingPage.enterMultipleTravellerDetails(
    customTestData.passengers
  );
  
  expect(await bookingPage.isBookingSummaryVisible()).toBeTruthy();
});
```

### Scenario 2: Changing Test Environment
**Requirement:** Run tests on Staging instead of Production

```bash
# Before: Would need to edit 50 test files
# After: Just edit .env
BASE_URL=https://staging.makemytrip.com/

npm run test:day2
# Tests automatically use staging URL!
```

### Scenario 3: Debugging a Failed Test
**Requirement:** Test failed, need to understand why

```bash
# Run with logs
npm run test:day2

# Output shows:
[INFO] Navigating to homepage
[INFO] Successfully navigated
[INFO] Selecting round trip
[INFO] Round trip selected
[INFO] Searching for flights
[ERROR] Search failed - element not clickable
  Details: search button hidden, popup blocking it

# Exactly what went wrong and where!
```

---

## 🎓 Standards Checklist (Learn These!)

### Configuration
- [ ] Understand `.env` file concept
- [ ] Know how `config.ts` loads `.env`
- [ ] Can change BASE_URL without touching code

### Page Objects
- [ ] All locators are PRIVATE
- [ ] Methods have type-safe parameters
- [ ] Every method has error handling
- [ ] Every method logs actions

### Tests
- [ ] Follow Given-When-Then structure
- [ ] Use page objects (never direct locators)
- [ ] Use test data builder for data
- [ ] Check logs when debugging

### Code Quality
- [ ] No hardcoded URLs
- [ ] No generic string parameters
- [ ] Proper error handling everywhere
- [ ] Clear method names and documentation

---

## 🚀 Running Tests (Commands You'll Use)

```bash
# Run all Day2 tests
npm run test:day2

# Run specific test
npx playwright test Day2/examples/steps/booking.steps.ts --grep "round trip"

# Run with visible browser
npx playwright test Day2/examples/steps/booking.steps.ts --headed

# Debug mode (step through)
npx playwright test Day2/examples/steps/booking.steps.ts --debug

# View HTML report
npm run report
```

---

## ✅ Industry Standards (Why This Matters)

| Standard | Purpose | Your Benefit |
|----------|---------|--------------|
| **12-Factor App** | Config from environment | Change settings without code changes |
| **POM Pattern** | Maintainable tests | Update selectors in one place |
| **Type Safety** | Fewer bugs | IDE catches mistakes early |
| **Error Handling** | Clear failures | Understand what went wrong |
| **Logging** | Debugging | Find root cause quickly |
| **Test Data Builder** | Code reuse | Write tests faster |
| **BDD Structure** | Business readability | Non-technical people understand tests |

---

## 📝 Example: Complete Working Test

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BookingPage } from '../pages/BookingPage';
import { TestDataBuilder } from '../utils/testData';
import { logger } from '../utils/logger';

test('Book a round trip flight', async ({ page }) => {
  // Setup
  const homePage = new HomePage(page);
  const bookingPage = new BookingPage(page);
  const testData = TestDataBuilder.roundTripDelhi();

  // Given: User on homepage
  logger.info('Step 1: Navigate to homepage');
  await homePage.navigate();
  
  // When: Search for flights
  logger.info('Step 2: Search for flights');
  await homePage.selectTripType('RoundTrip');
  await homePage.selectFromCity(testData.flightSearchCriteria.fromCity);
  await homePage.selectToCity(testData.flightSearchCriteria.toCity);
  await homePage.clickSearch();
  
  // Then: Verify results
  logger.info('Step 3: Verify flights displayed');
  expect(await bookingPage.areFlightsAvailable()).toBeTruthy();
  
  // And: Book the flight
  logger.info('Step 4: Book flight and enter details');
  await bookingPage.selectFirstFlight();
  await bookingPage.enterMultipleTravellerDetails(
    testData.passengers
  );
  
  // Verify booking summary
  logger.info('Step 5: Verify booking summary');
  const summary = await bookingPage.getBookingSummary();
  expect(summary).toBeTruthy();
  
  logger.info('Test passed successfully!');
});
```

---

## 🎯 Next Steps for Corporate Training

### Week 1: Understanding
- [ ] Read this quick reference
- [ ] Study INDUSTRY_STANDARDS_GUIDE.md
- [ ] Review code in pages/HomePage.ts

### Week 2: Implementation
- [ ] Add new test scenario
- [ ] Extend page object with new method
- [ ] Create custom test data

### Week 3: Mastery
- [ ] Debug a failing test
- [ ] Change configuration and re-run tests
- [ ] Document your own test scenario

---

## 🆘 Common Questions

### Q: Where do I put the website URL?
**A:** In `.env` file as `BASE_URL=...`, then use `config.baseUrl` in code

### Q: How do I add a new test step?
**A:** Add method to page object (private locators, public method) with error handling

### Q: My test files changed but code didn't - why?
**A:** Page objects encapsulate locators. Update only the page object file, not tests.

### Q: How do I pass data to tests?
**A:** Use TestDataBuilder in utils/testData.ts

### Q: Test failed, how do I debug?
**A:** Check logs, use `--debug` flag, check console output

---

## 📚 Documentation to Read

1. **INDUSTRY_STANDARDS_GUIDE.md** - Complete reference (30 min read)
2. **examples/README.md** - Quick start guide (10 min read)
3. **This file** - Quick reference (5 min read)
4. **Code comments** - JSDoc in each file (as needed)

---

**Remember: This is production-ready code. Follow these standards in your own projects!**

---

*Last Updated: 2024*
*For: Corporate Employees in Test Automation Training*
