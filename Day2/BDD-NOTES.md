# Day 2: BDD Integration Notes

## BDD with Playwright

This folder contains examples of Behavior Driven Development (BDD) with Playwright.

### Two Approaches Shown:

#### 1. **BDD-Style Test Format** (mmt-bdd.spec.ts)
This is the recommended approach for most teams. It uses standard Playwright tests but structures them with BDD naming conventions:
- Write test names using Given/When/Then format
- Easy to read and understand
- Executes with: `npm run test:day2`

#### 2. **Gherkin Feature Files** (booking.feature + booking.steps.ts)
This approach uses traditional Cucumber/Gherkin syntax:
- Feature files with .feature extension
- Step definition files
- Requires playwright-bdd integration
- More complex setup but familiar to BDD practitioners

### For This Course:
We recommend using the **BDD-Style Test Format** as it's:
- Simpler to understand
- Doesn't require additional transpilation
- Works directly with Playwright test patterns
- More maintainable for the team

### Recommended Usage:
1. Run BDD-style tests: `npm run test:day2`
2. Use mmt-bdd.spec.ts as the pattern for your tests
3. Keep feature files as documentation only (optional)

### Key BDD Concepts:
- **Given**: Setup state
- **When**: Perform action
- **Then**: Verify outcome

These are reflected in the test structure even in Playwright's standard format.