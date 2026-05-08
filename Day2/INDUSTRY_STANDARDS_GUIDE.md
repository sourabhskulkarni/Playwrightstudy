# Day 2: BDD Framework - Industry Standard Implementation

## Overview

This directory contains a **production-ready BDD (Behavior-Driven Development) framework** designed for corporate environments. It follows industry best practices and standards used in enterprise test automation.

## Project Structure

```
Day2/examples/
├── .env                          # Environment variables (config externalized)
├── config/
│   └── config.ts                 # Configuration management
├── pages/
│   ├── HomePage.ts               # Page Object Model - Homepage
│   └── BookingPage.ts            # Page Object Model - Booking Page
├── steps/
│   └── booking.steps.ts          # BDD Step definitions (actual implementation)
├── features/
│   └── booking.feature           # Gherkin feature file (documentation)
└── utils/
    ├── testData.ts               # Test data builder pattern
    └── logger.ts                 # Structured logging utility
```

## Key Corporate Standards Implemented

### 1. **Configuration Management (12-Factor App)**
- ✅ All URLs and settings externalized to `.env` file
- ✅ Configuration loaded via `config/config.ts`
- ✅ Environment validation with fallback defaults
- ✅ Type-safe configuration interface

**Usage:**
```typescript
// Access configuration without hardcoding URLs
import { config } from '../config/config';
await page.goto(config.baseUrl);
```

### 2. **Page Object Model (POM) Pattern**
The **strictest POM implementation** for corporate environments:

- **ALL locators are PRIVATE** - No direct element access from tests
- **Typed methods** - Every method has clear input/output contracts
- **Error handling** - Comprehensive try-catch with logging
- **No test logic in pages** - Pages contain only UI interactions
- **Declarative, not imperative** - Methods describe what we're doing
- **Chainable? NO** - Tests should read as scenarios

**Example - HomePage.ts:**
```typescript
// ✅ CORRECT - Private locators, public methods
private readonly searchButton: Locator;

async clickSearch(): Promise<void> {
  try {
    logger.info('Clicking search button');
    await this.searchButton.click();
    await this.page.waitForSelector('.flightListing');
    logger.info('Search completed successfully');
  } catch (error) {
    logger.error('Failed to execute search', error);
    throw error;
  }
}

// ❌ WRONG - Exposing locators
page.locator('button[data-cy="submit"]').click();
```

### 3. **Test Data Management**
- ✅ Builder Pattern for test data creation
- ✅ Type-safe test data interfaces
- ✅ Pre-built scenarios for common use cases
- ✅ Externalized from tests and page objects

**Usage:**
```typescript
// Simple data building
const testData = new TestDataBuilder()
  .withSearchCriteria({ fromCity: 'Delhi', toCity: 'Mumbai' })
  .withDefaultPassengers(2)
  .build();

// Pre-built scenarios
const roundTripData = TestDataBuilder.roundTripDelhi();
const oneWayData = TestDataBuilder.oneWayBangalore();
```

### 4. **Structured Logging**
- ✅ Multiple log levels (DEBUG, INFO, WARN, ERROR)
- ✅ Timestamped, structured log output
- ✅ Used at every critical step for debugging
- ✅ Proper error context capture

**Usage:**
```typescript
logger.info('Navigating to homepage', { url: config.baseUrl });
logger.debug('Flight details', { flightInfo });
logger.error('Failed to select fare type', error);
```

### 5. **BDD-Style Tests with Actual Implementation**
- ✅ Tests read like business scenarios (Given-When-Then)
- ✅ Complete step implementations (not stubs/comments)
- ✅ Clear verification points
- ✅ Comprehensive error handling
- ✅ Proper use of TypeScript for type safety

**Example Test Structure:**
```typescript
test('Scenario: Book a round trip flight successfully', async ({ page }) => {
  // Given: User is on MakeMyTrip homepage
  logger.info('STEP: User is on MakeMyTrip homepage');
  await homePage.navigate();
  await homePage.handlePopup();

  // When: User selects round trip option
  logger.info('STEP: User selects round trip option');
  await homePage.selectTripType('RoundTrip');

  // Then: Operation succeeds
  const summary = await bookingPage.getBookingSummary();
  expect(summary).toBeTruthy();
});
```

### 6. **Type Safety**
- ✅ TypeScript interfaces for all data structures
- ✅ Strict typing in page objects
- ✅ Type-safe locator usage
- ✅ Explicit return types on all methods

**Key Interfaces:**
```typescript
interface Passenger {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

interface FlightSearchCriteria {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  tripType: 'OneWay' | 'RoundTrip';
}
```

### 7. **Error Handling & Logging**
Every method includes:
1. **Log what we're about to do** - INFO level
2. **Execute the action** - With proper waits
3. **Catch and log errors** - ERROR level with context
4. **Throw with meaningful message**

```typescript
async selectFareType(fareType: 'Regular' | 'Special'): Promise<void> {
  try {
    logger.info('Selecting fare type', { fareType });
    const fareOption = fareType === 'Regular' ? this.regularFareOption : this.specialFareOption;
    await fareOption.click();
    await expect(fareOption).toBeChecked();
    logger.info(`Fare type '${fareType}' selected successfully`);
  } catch (error) {
    logger.error(`Failed to select fare type: ${fareType}`, error);
    throw error; // Propagate for test to fail appropriately
  }
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already created with default values:
```
BASE_URL=https://www.makemytrip.com/
BROWSER=chromium
HEADLESS=true
DEFAULT_TIMEOUT=30000
```

Edit `.env` for your environment if needed.

### 3. Run Tests

**All Day2 tests:**
```bash
npm run test:day2
```

**Specific test scenario:**
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --grep "Book a round trip flight"
```

**With UI:**
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --ui
```

**Headed mode (see browser):**
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --headed
```

## Architecture Decisions

### Why Not Full Cucumber?
⚠️ **Note:** While the `.feature` file exists for documentation, we use **Playwright's native test runner** because:
1. ✅ Better integration with Playwright
2. ✅ Simpler dependency management
3. ✅ Native TypeScript support
4. ✅ Better debugging experience
5. ✅ Industry standard for Playwright projects

### Why Private Locators?
This ensures:
- Tests change when behavior changes, not when locators change
- Page object encapsulation prevents brittle tests
- Easier maintenance and refactoring

### Why Structured Logging?
- ✅ Production-ready debugging
- ✅ Easy log aggregation (ELK, Splunk, etc.)
- ✅ Better CI/CD integration
- ✅ Clear failure root cause analysis

## Use Cases

### 1. **Single Passenger, Round Trip**
```typescript
const data = TestDataBuilder.roundTripDelhi();
// Returns: 2 adults, 1 child, Delhi ↔ Mumbai
```

### 2. **Single Passenger, One Way**
```typescript
const data = TestDataBuilder.oneWayBangalore();
// Returns: 1 adult, Bangalore → Goa
```

### 3. **Custom Data**
```typescript
const customData = new TestDataBuilder()
  .withSearchCriteria({
    fromCity: 'Hyderabad',
    toCity: 'Chennai',
    tripType: 'OneWay',
    adults: 3,
    children: 2,
    cabinClass: 'Business'
  })
  .withPassenger({
    name: 'Custom Passenger',
    email: 'custom@corporate.com',
    phone: '9876543210'
  })
  .build();
```

## Debugging

### Check Logs
Tests output structured logs:
```
[2024-01-15T10:30:45.123Z] [INFO] Navigating to base URL {"url":"https://www.makemytrip.com/"}
[2024-01-15T10:30:52.456Z] [INFO] Successfully navigated to homepage
```

### Debug Mode
```bash
npx playwright test --debug
```

### Inspect Selectors
```bash
npx playwright codegen https://www.makemytrip.com
```

## Corporate Standards Checklist

- [x] Configuration externalized (.env)
- [x] Type-safe configuration management
- [x] Page Object Model with private locators
- [x] Structured logging at every step
- [x] Test data builder pattern
- [x] Type-safe test data interfaces
- [x] Complete error handling
- [x] BDD-style test structure
- [x] Actual step implementations
- [x] Feature file for documentation
- [x] Comprehensive method documentation
- [x] No hardcoded values
- [x] Proper async/await handling
- [x] Environment-based configuration
- [x] Clear separation of concerns

## File Descriptions

| File | Purpose |
|------|---------|
| `.env` | Environment variables and configuration |
| `config/config.ts` | Configuration loader and validator |
| `pages/HomePage.ts` | Homepage interactions (POM) |
| `pages/BookingPage.ts` | Booking page interactions (POM) |
| `steps/booking.steps.ts` | BDD test scenarios with full implementation |
| `features/booking.feature` | Gherkin specifications (documentation) |
| `utils/testData.ts` | Test data builder and interfaces |
| `utils/logger.ts` | Structured logging utility |

## Next Steps (For Students/Trainees)

1. ✅ **Understand POM** - Study `pages/HomePage.ts` - every pattern matters
2. ✅ **Study Test Data** - Review `utils/testData.ts` - builder pattern is critical
3. ✅ **Read Tests** - Check `steps/booking.steps.ts` - see how GWT structure works
4. ✅ **Add Error Scenarios** - Create new scenarios for failure cases
5. ✅ **Extend Page Objects** - Add new methods for uncovered functionality
6. ✅ **Create CI/CD** - Integrate with your CI/CD pipeline

---

**This is production-quality code suitable for corporate training and enterprise projects.**
