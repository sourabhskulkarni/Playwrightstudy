# Day 2: Advanced UI Testing and Page Object Model (POM)

## Agenda
- Page Object Model (POM) Pattern
- Advanced UI Elements: Dropdowns, Radio Buttons, Checkboxes
- Handling Alerts, Popups, and Scrollers
- Introduction to BDD (Behavior Driven Development)
- Real-time Example: Booking Flow on MakeMyTrip

## Page Object Model (POM)
POM is a design pattern to create an object repository for web UI elements.

### Benefits:
- Reusable code
- Easy maintenance
- Separation of concerns

### Example Structure:
```
pages/
  HomePage.ts
  BookingPage.ts
tests/
  mmt-booking.spec.ts
  mmt-bdd.spec.ts
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

#### Approach 1: BDD-Style Test Format (Recommended)
Using standard Playwright tests with BDD naming conventions (see mmt-bdd.spec.ts):
```typescript
test('Given user is on MakeMyTrip, When user searches flights, Then results should display', async ({ page }) => {
  // Given
  await homePage.navigate();
  
  // When
  await homePage.searchFlights('Delhi', 'Mumbai');
  
  // Then
  expect(resultsVisible).toBe(true);
});
```

#### Approach 2: Gherkin Feature Files (Optional)
Traditional BDD with .feature files and step definitions (see booking.feature and booking.steps.ts).

## Real-time Examples

### Files in this directory:
- **pages/**: HomePage and BookingPage classes (POM pattern)
- **mmt-booking.spec.ts**: Traditional Playwright test using POM
- **mmt-bdd.spec.ts**: BDD-style tests (Recommended approach)
- **features/**: Gherkin feature files (optional documentation)
- **steps/**: Step definitions for Gherkin format

Run tests:
```bash
npm run test:day2
```

See BDD-NOTES.md for more information on BDD approaches.