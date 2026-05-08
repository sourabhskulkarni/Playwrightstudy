# Day 5: Interview Preparation - Playwright SDET Interview Questions & Answers

## Overview
This section contains common interview questions for a Playwright SDET (Software Development Engineer in Test) role with 9+ years of experience. The questions cover framework architecture, advanced Playwright features, testing strategies, and real-world scenarios.

## Framework Architecture Questions

### Q1: How would you design a scalable test automation framework using Playwright?
**Answer:** A scalable Playwright framework should include:
- **Page Object Model (POM)**: Separate page classes for UI interactions
- **API Testing Layer**: Dedicated API client classes
- **Database Layer**: Helpers for DB validation
- **Test Data Management**: Fixtures, factories, and environment-specific data
- **Configuration Management**: Environment configs, browser configs
- **Reporting**: HTML reports, custom reporters
- **CI/CD Integration**: GitHub Actions, Jenkins pipelines
- **Parallel Execution**: Optimized for speed
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge

### Q2: How do you handle test data management in large-scale projects?
**Answer:**
- Use JSON/YAML files for static data
- Implement data factories for dynamic data generation
- Environment-specific data files
- Database seeding for complex scenarios
- API mocking for external dependencies
- Data cleanup after test execution

## Advanced Playwright Features

### Q3: Explain Playwright's locator strategies and when to use each.
**Answer:**
- **getByRole()**: For ARIA roles (button, link, heading)
- **getByLabel()**: For form controls with labels
- **getByPlaceholder()**: For inputs with placeholders
- **getByText()**: For visible text content
- **getByAltText()**: For images with alt text
- **getByTitle()**: For elements with title attribute
- **CSS/XPath**: When other strategies don't work

### Q4: How do you handle dynamic content and waits in Playwright?
**Answer:**
- **Auto-waiting**: Playwright waits automatically for elements
- **waitForSelector()**: Manual waits for specific selectors
- **waitForFunction()**: Wait for custom conditions
- **waitForLoadState()**: Wait for page load states
- **waitForTimeout()**: Explicit waits (use sparingly)

## API Testing

### Q5: How do you perform API testing in Playwright?
**Answer:**
```typescript
const apiContext = await request.newContext();
const response = await apiContext.get('/api/users');
expect(response.status()).toBe(200);
const data = await response.json();
```

- Use APIRequestContext for REST API testing
- Handle authentication (Bearer tokens, Basic auth)
- Validate response status, headers, and body
- Chain API calls in test flows

## Performance Testing

### Q6: How do you measure and validate performance in Playwright tests?
**Answer:**
- Use `page.evaluate(() => performance.timing)` for load times
- Enable tracing: `trace: 'on-first-retry'`
- Measure Core Web Vitals (LCP, FID, CLS)
- Network monitoring with `page.on('response')`
- Lighthouse integration for comprehensive metrics

## BDD and Test Organization

### Q7: How do you implement BDD with Playwright?
**Answer:**
- Use playwright-bdd or @cucumber/cucumber
- Write .feature files with Gherkin syntax
- Implement step definitions in TypeScript
- Organize features by functionality
- Generate living documentation

## Database Testing

### Q8: How do you integrate database testing with Playwright?
**Answer:**
- Use database client libraries (sqlite3, pg, mysql2)
- Create database helper classes
- Perform CRUD operations in tests
- Validate data consistency across UI/API/DB
- Use transactions for test isolation
- Clean up test data after execution

## Framework Creation for Senior Roles

### Q9: As an SDET architect, how would you structure a framework for a large team?
**Answer:**
- **Modular Architecture**: Separate concerns (UI, API, DB, Utils)
- **Shared Libraries**: Common utilities and helpers
- **Configuration Layers**: Environment and test configs
- **Custom Reporters**: Team-specific reporting needs
- **CI/CD Pipelines**: Automated test execution
- **Documentation**: README, API docs, contribution guides
- **Code Quality**: Linting, type checking, code reviews
- **Scalability**: Support for parallel execution, cross-browser testing

### Q10: How do you ensure framework maintainability?
**Answer:**
- Regular refactoring
- Code reviews and standards
- Documentation updates
- Automated dependency updates
- Performance monitoring
- Regular training sessions
- Backward compatibility considerations

## Real-world Scenarios

### Q11: How do you handle flaky tests?
**Answer:**
- Identify root causes (timing, network, async operations)
- Use stable locators
- Implement retry mechanisms
- Add proper waits
- Isolate flaky tests
- Monitor and fix consistently failing tests

### Q12: How do you test microservices architecture?
**Answer:**
- API contract testing
- Service virtualization
- End-to-end testing with mocked services
- Database state validation
- Message queue testing
- Cross-service data flow validation

### Q13: Explain your approach to test automation ROI.
**Answer:**
- Measure execution time savings
- Calculate bug detection rate
- Assess maintenance costs
- Evaluate CI/CD integration benefits
- Track team productivity improvements
- Report on test coverage metrics

## Technical Deep Dives

### Q14: How does Playwright handle browser contexts and isolation?
**Answer:**
- **BrowserContext**: Isolated session with own cookies/storage
- **Incognito mode**: Fresh context for each test
- **Shared context**: For related tests
- **Context options**: Viewport, permissions, geolocation
- **Parallel execution**: Each worker gets its own context

### Q15: Explain Playwright's architecture and how it differs from Selenium.
**Answer:**
- **Native browser APIs**: Direct communication vs WebDriver protocol
- **Headless by default**: Faster execution
- **Auto-waiting**: Built-in smart waits
- **Multiple browser support**: Chromium, Firefox, WebKit
- **Language bindings**: TypeScript, JavaScript, Python, C#, Java
- **Built-in tools**: Codegen, UI mode, trace viewer

## Leadership and Strategy

### Q16: How do you mentor junior team members in test automation?
**Answer:**
- Pair programming sessions
- Code review feedback
- Knowledge sharing sessions
- Documentation contributions
- Hands-on workshops
- Encourage best practices adoption

### Q17: How do you decide between UI, API, and unit testing?
**Answer:**
- **UI Testing**: User journey validation, visual regressions
- **API Testing**: Business logic, data validation, performance
- **Unit Testing**: Individual function/component testing
- **Integration Testing**: Component interactions
- Cost-benefit analysis for each layer

### Q18: What metrics do you track for test automation success?
**Answer:**
- Test execution time
- Test pass/fail rates
- Test coverage percentage
- Defect detection rate
- Maintenance effort
- CI/CD pipeline success rates
- Time to feedback

## MakeMyTrip Specific Scenarios

### Q19: How would you test the flight booking flow on MakeMyTrip?
**Answer:**
- **Happy path**: Complete booking from search to payment
- **Edge cases**: Sold out flights, payment failures, session timeouts
- **Data validation**: Correct fare calculations, passenger details
- **Performance**: Search response times, booking completion
- **Cross-browser**: Consistent behavior across browsers
- **Mobile responsiveness**: Test on different screen sizes

### Q20: How do you handle dynamic content like flight prices?
**Answer:**
- Use data-testid or stable attributes
- Implement retry mechanisms for price updates
- Validate price ranges instead of exact values
- Mock price APIs for consistent testing
- Use relative selectors for dynamic elements

## Final Tips for Interview
- Demonstrate deep understanding of Playwright internals
- Show experience with framework design and architecture
- Discuss real-world challenges and solutions
- Highlight leadership and mentoring experience
- Prepare examples from past projects
- Be ready to discuss trade-offs and decision-making processes