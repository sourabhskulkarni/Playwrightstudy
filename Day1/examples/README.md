# Day 2 Examples - Production-Ready BDD Framework with Hooks

## Overview

This directory contains a **complete, industry-standard BDD (Behavior-Driven Development) framework** for flight booking test automation. Features an advanced hooks system with:
- ✅ Centralized fixture management
- ✅ Lazy-loaded test data (on-demand only)
- ✅ Automatic browser lifecycle management
- ✅ Global and per-test lifecycle hooks
- ✅ Built for corporate team standards

Every file follows corporate best practices and is suitable for enterprise projects.

## Quick Start

### 1. Install Dependencies
```bash
cd ../../  # Go to root
npm install
npx playwright install
```

### 2. Configure Environment
The `.env` file is pre-configured:
```env
BASE_URL=https://www.makemytrip.com/
BROWSER=chromium
HEADLESS=true
DEFAULT_TIMEOUT=30000
```

### 3. Run Tests

**Using Cucumber (BDD - Recommended):**
```bash
npx cucumber-js                    # Run all features
npx cucumber-js --tags @smoke      # Run specific tags
npx cucumber-js --dry-run          # Validate without executing
```

**Using Playwright:**
```bash
npm run test:day2
npx playwright test --reporter=html
```

## Framework Architecture

### Hooks System (`steps/hooks.ts`) ⭐ NEW

**Purpose:** Centralized setup, teardown, and fixture management for all tests.

#### What the Hooks System Provides:
1. **Browser Lifecycle Management**
   - Automatic browser launch/cleanup
   - Context isolation per test
   - Page objects initialization

2. **Custom Fixtures (Lazy-Loaded)**
   ```typescript
   // Only pageObjects - no test data
   test('Scenario', async ({ pageObjects }) => {
     const { homePage, bookingPage } = pageObjects;
   });
   
   // pageObjects + test data
   test('Scenario', async ({ pageObjects, testData }) => {
     const { homePage } = pageObjects;
     // testData only generated if test requests it
   });
   ```

3. **Global Lifecycle Hooks**
   - `beforeAll()` - Suite setup (once)
   - `afterAll()` - Suite teardown (once)
   - `beforeEach()` - Test setup (every test)
   - `afterEach()` - Test teardown with auto-screenshot on failure

4. **Test Data Helper Class**
   ```typescript
   // Pre-built scenarios
   const data = TestSetupHelper.generateTestData('roundTripDelhi');
   
   // Custom data with builder
   const custom = TestSetupHelper.generateCustomTestData(builder =>
     builder.withSearchCriteria({ fromCity: 'Delhi' })
   );
   ```

#### Why This Matters:
- **Zero Redundancy**: No beforeEach/afterEach in every test file
- **Lazy Loading**: Test data only created when test requests it
- **Automatic Cleanup**: Screenshots and logs on failure
- **Better Isolation**: Each test runs independently
- **Scalable**: Easy to add new tests

**Learn More:** See [HOOKS_REFACTORING_GUIDE.md](steps/HOOKS_REFACTORING_GUIDE.md)

### Configuration Layer (`config/config.ts`)
```typescript
// ✅ Externalized configuration
import { config } from './config/config';

// Access environment-based configuration
const baseUrl = config.baseUrl;              // From .env
const timeout = config.timeout;             // From .env
const shouldTakeScreenshotOnFailure = config.screenshotOnFailure;
```

**Why this matters for corporate environments:**
- Different configuration for Dev/QA/Prod
- No hardcoded values in code
- Easy CI/CD integration
- Secure credential management

### Page Object Model (`pages/`)

#### HomePage.ts - Homepage Interactions
```typescript
export class HomePage {
  // ✅ ALL locators PRIVATE - Encapsulation
  private readonly searchButton: Locator;
  private readonly fromCityInput: Locator;
  
  // ✅ PUBLIC methods with clear signatures
  async navigate(): Promise<void>
  async selectTripType(tripType: 'OneWay' | 'RoundTrip'): Promise<void>
  async selectFromCity(city: string): Promise<void>
  // ... more methods
}
```

**Key Points:**
- ✅ No test logic in page objects
- ✅ All locators private (prevents brittle tests)
- ✅ Error handling and logging in every method
- ✅ Type-safe method parameters
- ✅ Comprehensive documentation

#### BookingPage.ts - Booking Page Interactions
```typescript
export class BookingPage {
  // ✅ Methods for passenger management
  async enterTravellerDetails(passenger: Passenger, index?: number): Promise<void>
  async enterMultipleTravellerDetails(passengers: Passenger[]): Promise<void>
  
  // ✅ Seat selection
  async selectSeat(): Promise<boolean>
  
  // ✅ Payment flow
  async proceedToPayment(): Promise<void>
  
  // ✅ Verification
  async getBookingSummary(): Promise<string | null>
}
```

### Test Data Management (`utils/testData.ts`)

#### Builder Pattern for Flexible Data
```typescript
// Via hooks fixture (recommended)
test('Scenario', async ({ pageObjects, testData }) => {
  // testData = TestDataBuilder.roundTripDelhi() by default
  // Only created if test requests it
});

// Pre-built scenarios via helper
const roundTrip = TestSetupHelper.generateTestData('roundTripDelhi');
const oneWay = TestSetupHelper.generateTestData('oneWayBangalore');

// Custom data
const custom = TestSetupHelper.generateCustomTestData(builder =>
  builder
    .withSearchCriteria({ fromCity: 'Bangalore', adults: 3 })
    .withDefaultPassengers(3)
)
  .withDefaultPassengers(3)
  .build();

// Type-safe interfaces
interface Passenger {
  name: string;
  email: string;
  phone: string;
}
```

### Structured Logging (`utils/logger.ts`)

```typescript
import { logger } from './utils/logger';

logger.debug('Field value', { value });    // Detailed info
logger.info('Action executed', { action }); // Important events
logger.warn('Warning message', context);    // Non-critical issues
logger.error('Error occurred', error);      // Critical errors
```

Output:
```
[2024-01-15T10:30:45.123Z] [INFO] Navigating to base URL {"url":"https://www.makemytrip.com/"}
[2024-01-15T10:30:52.456Z] [INFO] Successfully navigated to homepage
```

### BDD Tests (`steps/booking.steps.ts`)

#### Scenario 1: Round Trip Booking
```typescript
test('Scenario: Book a round trip flight successfully', async ({ page }) => {
  // Given: User is on MakeMyTrip homepage
  logger.info('STEP: User is on MakeMyTrip homepage');
  await homePage.navigate();
  await homePage.handlePopup();

  // When: User selects options and searches
  logger.info('STEP: User selects round trip option');
  await homePage.selectTripType('RoundTrip');
  // ... more steps

  // Then: Verify results
  logger.info('THEN: Verify flight results are displayed');
  const flightsAvailable = await bookingPage.areFlightsAvailable();
  expect(flightsAvailable).toBeTruthy();
});
```

## File structure & Purpose

| File | Purpose | Standards |
|------|---------|-----------|
| `.env` | Environment variables | 12-Factor App |
| `config/config.ts` | Configuration management | Type-safe, validated |
| `pages/HomePage.ts` | Homepage POM | Private locators, error handling |
| `pages/BookingPage.ts` | Booking POM | Complete method signatures |
| `steps/booking.steps.ts` | BDD test scenarios | Full implementation, Given-When-Then |
| `features/booking.feature` | Gherkin documentation | Human-readable specs |
| `utils/testData.ts` | Test data management | Builder pattern, type-safe |
| `utils/logger.ts` | Structured logging | Multiple log levels, context |

## Running Tests

### All Tests
```bash
npm run test:day2
```

### Specific Scenario
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --grep "Book a round trip"
```

### With Browser Visible
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --headed
```

### Debug Mode
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --debug
```

### Generate HTML Report
```bash
npm run report
```

## Industry Standards Implemented

### ✅ Configuration Management
- Externalized to `.env`
- Type-safe configuration interface
- Environment validation
- Fallback defaults

### ✅ Page Object Model
- ALL locators PRIVATE
- Type-safe method signatures
- Comprehensive error handling
- Structured logging
- No test logic in pages

### ✅ Test Data Management
- Builder pattern
- Type-safe interfaces
- Pre-built scenarios
- Data separation from tests

### ✅ BDD Style
- Given-When-Then structure
- Human-readable test names
- Complete implementations
- Feature files for documentation

### ✅ Logging & Debugging
- Multiple log levels
- Timestamped output
- Context-aware messages
- Easy log aggregation

### ✅ Type Safety
- TypeScript throughout
- Typed interfaces
- Strict typing
- IDE autocomplete support

## Common Tasks

### Add a New Test Scenario
1. Create test in `steps/booking.steps.ts`
2. Use existing page objects
3. Extend test data builder if needed
4. Follow Given-When-Then structure

### Add New Page Interactions
1. Add locator in page class (private)
2. Create public method with clear name
3. Add error handling and logging
4. Update type interfaces if needed

### Use Custom Test Data
```typescript
const custom = new TestDataBuilder()
  .withSearchCriteria({
    fromCity: 'Pune',
    toCity: 'Goa',
    tripType: 'OneWay',
    adults: 2,
    cabin: 'Business'
  })
  .withPassenger({
    name: 'John Doe',
    email: 'john@corporate.com',
    phone: '9876543210'
  })
  .build();
```

### Debug a Failed Test
```bash
# Run with detailed logging
npx playwright test Day2/examples/steps/booking.steps.ts --debug

# Or check generated logs
npm run report
```

## Key Principles

### 1. Encapsulation
- All locators PRIVATE
- Only public methods exposed
- Clear interface contracts

### 2. Maintainability
- Single responsibility
- Easy to update selectors
- No selector coupling with tests

### 3. Readability
- Descriptive method names
- Clear Given-When-Then flow
- Comprehensive documentation

### 4. Reliability
- Proper wait strategies
- Error handling at every step
- Comprehensive logging

### 5. Scalability
- Builder pattern for test data
- Reusable page objects
- Configuration externalization

## Troubleshooting

### Tests Timing Out
Check `.env` timeout settings:
```env
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000
```

### Selectors Not Found
1. Check browser has loaded
2. Verify element visibility
3. Check `.feature` file for correct locators
4. Use debug mode to inspect selectors

### Configuration Issues
```bash
# Verify .env file exists
ls -la .env

# Check configuration loads
npx playwright test --debug
```

## Next Steps for Advanced Usage

1. **Integration with CI/CD** - Add to GitHub Actions/Jenkins
2. **Remote Execution** - Use Playwright Cloud
3. **Visual Regression** - Add screenshot comparison
4. **Performance Testing** - Monitor load times
5. **API Testing** - Combine with API automation

---

**This framework is production-ready and follows all enterprise best practices.**

For complete documentation, see [INDUSTRY_STANDARDS_GUIDE.md](../INDUSTRY_STANDARDS_GUIDE.md)
