# Day 2: Advanced UI Testing and Page Object Model (POM)

## 📖 READ IN THIS ORDER

1. **[PLAYWRIGHT_FUNDAMENTALS.md](PLAYWRIGHT_FUNDAMENTALS.md)** ← **START HERE** (30 min)
   - What is Browser, Context, Page
   - Different method types
   - Complete test execution flow
   - How tests run from start to finish

2. **[INDUSTRY_STANDARDS_GUIDE.md](INDUSTRY_STANDARDS_GUIDE.md)** (30 min)
   - Enterprise Page Object Model
   - Configuration management
   - Test data builder pattern
   - Framework architecture

3. **[Day2/examples/README.md](examples/README.md)** (15 min)
   - Quick start guide
   - Running the examples
   - File descriptions

4. **Look at code** (30 min)
   - `examples/pages/HomePage.ts` - See POM in action
   - `examples/pages/BookingPage.ts` - More examples
   - `examples/steps/booking.steps.ts` - Complete tests

---

## ⭐ PRODUCTION-READY FRAMEWORK

**This directory now includes a complete, industry-standard BDD framework** designed for corporate environments. 

**👉 [Start with Fundamentals Guide](PLAYWRIGHT_FUNDAMENTALS.md)** for foundation concepts, then move to [Industry Standards](INDUSTRY_STANDARDS_GUIDE.md).

---

## Agenda
- ✅ **What is Browser, Context, Page** (PLAYWRIGHT_FUNDAMENTALS.md)
- ✅ **Different method types** (PLAYWRIGHT_FUNDAMENTALS.md)
- ✅ **Test execution flow** (PLAYWRIGHT_FUNDAMENTALS.md)
- ✅ **Page Object Model (POM) Pattern** (INDUSTRY_STANDARDS_GUIDE.md)
- ✅ **Advanced UI Elements** (examples/)
- ✅ **Handling Alerts, Popups** (examples/pages/)
- ✅ **Introduction to BDD** (examples/steps/)
- ✅ **Real-time Example: Booking Flow on MakeMyTrip** (examples/)

## Key Improvements in This Release

| Feature | Status | Location |
|---------|--------|----------|
| **Playwright Fundamentals** | ✅ NEW | `PLAYWRIGHT_FUNDAMENTALS.md` |
| **Browser/Context/Page Explanation** | ✅ NEW | `PLAYWRIGHT_FUNDAMENTALS.md` |
| **Method Types Reference** | ✅ NEW | `PLAYWRIGHT_FUNDAMENTALS.md` |
| **Complete Execution Flow** | ✅ NEW | `PLAYWRIGHT_FUNDAMENTALS.md` |
| Environment Configuration (.env) | ✅ | `.env` |
| Configuration Manager | ✅ | `config/config.ts` |
| Enterprise POM Pattern | ✅ | `pages/HomePage.ts`, `pages/BookingPage.ts` |
| Test Data Builder | ✅ | `utils/testData.ts` |
| Structured Logging | ✅ | `utils/logger.ts` |
| BDD Tests (Full Implementation) | ✅ | `steps/booking.steps.ts` |
| Type Safety | ✅ | TypeScript interfaces throughout |

## Page Object Model (POM)
POM is a design pattern to create an object repository for web UI elements.

### Benefits:
- ✅ Reusable code
- ✅ Easy maintenance
- ✅ Separation of concerns
- **NEW**: Complete error handling
- **NEW**: Structured logging at every step
- **NEW**: Type-safe interfaces
- **NEW**: Private locators for encapsulation

### Example Structure:
```
pages/
  HomePage.ts              ← All locators PRIVATE
  BookingPage.ts           ← All methods have clear signatures
config/
  config.ts                ← Environment management
steps/
  booking.steps.ts         ← Actual test implementation
utils/
  testData.ts             ← Test data builder
  logger.ts               ← Structured logging
```

## Advanced UI Elements
- **Dropdown (Single Select)**: page.selectOption(selector, value)
- **Dropdown (Multi Select)**: page.locator(selector).selectOption(values)
- **Radio Button**: page.check(selector)
- **Checkbox**: page.check(selector) or uncheck
- **Alerts**: page.on('dialog', handler)
- **Popups**: Handle modal dialogs
- **Scrollers**: page.locator(selector).scrollIntoViewIfNeeded()

## BDD Introduction
BDD uses natural language to describe test scenarios.

### Two Approaches:

#### Approach 1: BDD-Style Test Format (✅ RECOMMENDED)
Using standard Playwright tests with BDD naming conventions:
```typescript
test('Scenario: Book a round trip flight successfully', async ({ page }) => {
  // Given: User is on MakeMyTrip homepage
  await homePage.navigate();
  
  // When: User searches for flights
  await homePage.selectTripType('RoundTrip');
  await homePage.selectFromCity('Delhi');
  await homePage.clickSearch();
  
  // Then: Results should display
  expect(await bookingPage.areFlightsAvailable()).toBeTruthy();
});
```
[See full implementation →](examples/steps/booking.steps.ts)

#### Approach 2: Gherkin Feature Files (Optional Documentation)
Traditional BDD with .feature files and step definitions.

## Project Structure

```
Day2/
├── PLAYWRIGHT_FUNDAMENTALS.md     ← START HERE
├── INDUSTRY_STANDARDS_GUIDE.md    ← Then here
├── README.md                      ← You are here
├── examples/
│   ├── .env                       # Environment config
│   ├── config/
│   │   └── config.ts              # Configuration manager
│   ├── pages/
│   │   ├── HomePage.ts            # Homepage POM
│   │   └── BookingPage.ts         # Booking POM
│   ├── steps/
│   │   └── booking.steps.ts       # BDD Tests
│   ├── features/
│   │   └── booking.feature        # Gherkin format
│   ├── utils/
│   │   ├── testData.ts            # Test data builder
│   │   └── logger.ts              # Logging utility
│   └── README.md                  # Examples quick start
```

## Running Tests

### All Day 2 Tests
```bash
npm run test:day2
```

### Specific Scenario
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --grep "Book a round trip flight"
```

### Debug Mode
```bash
npx playwright test Day2/examples/steps/booking.steps.ts --debug
```

### View Report
```bash
npm run report
```

## Configuration Management

The framework uses `.env` file for externalized configuration:

```env
BASE_URL=https://www.makemytrip.com/
API_BASE_URL=https://api.makemytrip.com
BROWSER=chromium
HEADLESS=true
DEFAULT_TIMEOUT=30000
```

Access in code:
```typescript
import { config } from './config/config';
await page.goto(config.baseUrl);  // No hardcoded URLs!
```

## Test Data Management

Use the Builder Pattern for flexible test data:

```typescript
import { TestDataBuilder } from './utils/testData';

// Pre-built scenarios
const roundTripData = TestDataBuilder.roundTripDelhi();
const oneWayData = TestDataBuilder.oneWayBangalore();

// Custom data
const customData = new TestDataBuilder()
  .withSearchCriteria({ fromCity: 'Hyderabad', toCity: 'Chennai' })
  .withDefaultPassengers(2)
  .build();
```

## Logging

Complete structured logging for better debugging:

```typescript
import { logger } from './utils/logger';

logger.info('Navigating to homepage', { url: config.baseUrl });
logger.debug('Flight details', { flightInfo });
logger.error('Search failed', error);
```

## Files in This Directory

- **PLAYWRIGHT_FUNDAMENTALS.md**: ⭐ **Start here** - Core Playwright concepts
- **INDUSTRY_STANDARDS_GUIDE.md**: Enterprise patterns and best practices
- **examples/**: Complete working example with industry standards
- **mmt-booking.spec.ts**: Traditional Playwright test using POM (Reference)
- **mmt-bdd.spec.ts**: BDD-style tests (Reference)
- **BDD-NOTES.md**: BDD comparison and notes

## Training Progression

### Hour 1: Fundamentals (MUST DO FIRST)
- Read [PLAYWRIGHT_FUNDAMENTALS.md](PLAYWRIGHT_FUNDAMENTALS.md)
- Understand Browser, Context, Page
- Learn method types
- See execution flow

### Hour 2: Framework Standards
- Read [INDUSTRY_STANDARDS_GUIDE.md](INDUSTRY_STANDARDS_GUIDE.md)
- Understand POM pattern
- Configuration management
- Test data builder

### Hour 3: Code Review
- Look at `examples/pages/HomePage.ts`
- Look at `examples/pages/BookingPage.ts`
- Look at `examples/steps/booking.steps.ts`

### Hour 4: Hands-On
- Run: `npm run test:day2`
- Modify test data and re-run
- Add new scenario

---

**This is production-quality code suitable for corporate training and enterprise projects.**