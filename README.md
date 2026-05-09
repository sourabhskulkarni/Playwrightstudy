# Playwright and TypeScript Training Course - Complete Framework

## Course Overview
This comprehensive training course teaches Playwright and TypeScript from scratch, focusing on real-world testing scenarios using MakeMyTrip.com. The course covers UI testing, API testing, Performance testing, and Database testing with **BDD (Behavior Driven Development)**, **Page Object Model patterns**, and **Corporate-Grade Hooks Framework**.

## 🆕 What's New: Hooks Framework

We've implemented a **production-grade hooks system** with:
- ✅ Centralized fixture management
- ✅ Lazy-loaded test data (on-demand only)
- ✅ Automatic browser lifecycle management
- ✅ Global and per-test lifecycle hooks
- ✅ Auto-screenshot on failure
- ✅ Structured logging throughout
- ✅ Zero code redundancy

**Learn more:** [Day 2 Hooks Guide](Day2/examples/steps/HOOKS_REFACTORING_GUIDE.md)

## Target Audience
- Functional testers looking to transition to automation
- Developers wanting to learn test automation
- QA engineers with basic programming knowledge
- SDET aspirants preparing for senior roles

## Prerequisites
- Basic programming concepts
- Understanding of web applications
- Familiarity with HTML/CSS/JavaScript (helpful but not required)

## Course Structure

### Day 1: Introduction to TypeScript and Playwright Basics
- TypeScript fundamentals (types, interfaces, classes)
- Playwright setup and configuration
- Basic UI testing concepts
- Locators and actions
- Testing UI elements: Input boxes, buttons, labels, logos, images
- Real-time example: MakeMyTrip navigation

### Day 2: Advanced UI Testing, Page Object Model, and Hooks Framework ⭐
- Page Object Model (POM) pattern
- **[NEW] Hooks Framework** - Corporate-grade fixture system
- Advanced UI elements: Dropdowns, radio buttons, checkboxes
- Handling alerts, popups, and scrollers
- Introduction to BDD
- Lazy-loaded test data patterns
- Real-time example: MakeMyTrip booking flow

### Day 3: API Testing and Performance Testing
- API testing with Playwright
- REST API concepts and authentication
- Performance testing basics
- Measuring page load times and Core Web Vitals
- Real-time example: MakeMyTrip API and performance testing

### Day 4: Database Testing and Framework Creation
- Database testing concepts
- SQL operations in tests
- Setting up test databases
- Integrating BDD, POM, API, and DB testing
- Creating complete test frameworks
- Real-time example: End-to-end MakeMyTrip framework

### Day 5: Interview Preparation & CI/CD
- Common Playwright SDET interview questions
- Framework architecture discussions
- Real-world scenario solutions
- CI/CD pipeline integration
- Leadership and mentoring tips

## Technologies Covered
- **Playwright**: End-to-end testing framework
- **TypeScript**: Type-safe JavaScript
- **BDD**: Behavior Driven Development with Gherkin
- **Cucumber-JS**: BDD test runner
- **Hooks Framework**: Centralized fixture management (NEW)
- **Page Object Model**: UI abstraction pattern
- **API Testing**: REST API validation
- **Database Testing**: SQL and NoSQL validation
- **Performance Testing**: Load time and resource monitoring
- **K6 & JMeter**: Load testing tools

## Project Setup

### Installation
```bash
npm install
npx playwright install
```

### Configure Environment
```bash
# Copy and configure .env
cp .env.example .env
```

### Running Tests

**Using Cucumber (BDD - Recommended):**
```bash
npx cucumber-js                    # Run all features
npx cucumber-js --tags @smoke      # Run specific tags
npx cucumber-js --dry-run          # Validate without executing
```

**Using Playwright:**
```bash
npm test                           # Run all tests
npm run test:day1                  # Day 1 tests
npm run test:day2                  # Day 2 tests
npm run test:ui                    # Interactive UI mode
npm run report                     # View test report
```

## Framework Features
- ✅ **Hooks Framework** - Centralized fixture & lifecycle management
- ✅ TypeScript support - Full type safety
- ✅ Page Object Model - Scalable UI abstraction
- ✅ BDD with Cucumber - Readable scenario definitions
- ✅ Lazy-Loaded Fixtures - Data generated only when needed
- ✅ API testing - REST endpoint validation
- ✅ Database testing - SQL operations
- ✅ Performance monitoring - Load time metrics
- ✅ Cross-browser testing - Multiple browser support
- ✅ Parallel execution - Faster test runs
- ✅ HTML reporting - Detailed test reports
- ✅ CI/CD integration - GitHub Actions ready

## Architecture Overview

```
Project Structure
├── Day2/examples/
│   ├── steps/
│   │   ├── hooks.ts                    ⭐ Core hooks system
│   │   ├── HOOKS_REFACTORING_GUIDE.md  ⭐ How to use hooks
│   │   ├── booking.steps.ts            BDD step definitions
│   │   └── home-page/
│   │       └── home-page.steps.ts      Home page tests
│   ├── pages/
│   │   ├── HomePage.ts                 Page object
│   │   └── BookingPage.ts              Page object
│   ├── utils/
│   │   ├── testData.ts                 Test data builder
│   │   └── logger.ts                   Logging utility
│   ├── config/
│   │   └── config.ts                   Configuration
│   ├── features/
│   │   └── home-page.feature           Gherkin scenarios
│   └── README.md                       Examples guide
├── cucumber.js                         Cucumber config
└── playwright.config.ts                Playwright config
```

## Real-World Examples
All examples use MakeMyTrip.com to demonstrate:
- Flight search and booking flows
- Dynamic content handling
- Complex UI interactions
- API integrations
- Performance validation
- Database state management

## Learning Outcomes
By the end of this course, participants will be able to:
- Write maintainable test automation code
- Design scalable test frameworks
- Implement corporate-grade hooks and fixtures
- Handle complex web application testing scenarios
- Integrate multiple testing layers (UI, API, DB)
- Implement BDD practices with Cucumber
- Perform performance testing
- Debug and troubleshoot test failures
- Prepare for SDET interviews

## For Senior Roles
The course includes advanced topics for experienced professionals:
- **Hooks Framework Design** - Fixture management patterns
- **Framework architecture** - Scalable design patterns
- **Team collaboration** - Best practices for teams
- **CI/CD integration** - Pipeline automation
- **Test data management** - Builder pattern strategies
- **Performance optimization** - Load testing techniques
- **Mentoring skills** - Leadership for automation teams

## Corporate Standards Implemented
- ✅ Zero code redundancy with hooks
- ✅ Lazy-loaded fixtures (on-demand only)
- ✅ Proper test isolation and independence
- ✅ Automatic lifecycle management
- ✅ Comprehensive logging at every step
- ✅ Type-safe code throughout
- ✅ Clear separation of concerns
- ✅ Reusable page objects and helpers

## Quick Navigation
- **[Day 1 Guide](Day1/README.md)** - TypeScript and Playwright basics
- **[Day 2 Guide](Day2/README.md)** - POM and Hooks Framework ⭐
- **[Day 2 Hooks Documentation](Day2/examples/steps/HOOKS_REFACTORING_GUIDE.md)** - Complete hooks guide
- **[Day 3 Guide](Day3/README.md)** - API and performance testing
- **[Day 4 Guide](Day4/README.md)** - Database testing and framework
- **[Day 5 Guide](Day5/README.md)** - Interview preparation
- **[Examples Guide](Day2/examples/README.md)** - Running the framework

## Support Resources
- Detailed code examples in each day's folder
- Step-by-step explanations with comments
- Real-time debugging tips
- Best practices and design patterns
- Interview preparation guide
- Complete hooks framework documentation

Happy Testing! 🎭
