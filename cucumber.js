/**
 *  cucumber.js - Cucumber configuration file for Playwright tests
 *  This file sets up the test environment, including hooks for browser management and test isolation.
 *  It also defines global timeouts and handles test failures by capturing screenshots and logging details.
 * 
 * Industry Standard Practices Followed:
 * - paths: points to ./features for feature files and .steps.ts for step definitions
 * - require: loads support (hooks and world), then step definitions
 *            ORDER MATTERS: world.ts > hokks.ts > step definitions for proper initialization
 * - timeout: global step timeout set to 30 seconds (default is 5 seconds, which is often too short for end-to-end tests)
 * - Before hook: launches a new browser context and page for each scenario to ensure test isolation
 * - After hook: captures screenshots on failure, logs error details, and ensures browser context is closed to free resources
 * - Environment variables: used for configurable settings like headless mode, slow motion, and pause duration on failure
 * - requireModule: set to ts-node/register to allow running TypeScript files directly without pre-compilation
 * - format: set to progress for better visibility of test execution in the console
 * 
 * Run tests with: 
 * npx cucumber-js                     - runs all scenarios in the features directory
 * npx cucumber-js --tags @smoke       - runs only scenarios tagged with @smoke
 * npx cucumber-js --tags --dry-run    - Validates the feature files and step definitions without executing the tests (useful for checking if all steps are properly defined)
 */

module.exports = {
    day1: {
        paths: ['Day1/examples/features/**/*.feature'],       // Path to feature files
        require: [
            'Day1/examples/support/world.ts',                  // Custom World for shared context
            'Day1/examples/support/hooks.ts',                  // Hooks for setup and teardown
            'Day1/examples/step-definitions/**/*.steps.ts'              // Step definitions
        ],

        //Enable TypeScript support without pre-compilation
        requireModule: ['ts-node/register'],

        //Reporting format - progress shows a simple progress bar in the console
        format: [
            'progress-bar', // Shows a progress bar in the console
            'html:reports/cucumber-report.html', // Generates an HTML report
            'json:reports/cucumber-report.json'  // Generates a JSON report for further analysis
        ],

        // show full error stack traces for easier debugging
        formatOptions: {
            snippetInterface: 'async-await', // Use async/await syntax for generated step definition snippets
        },

        // fail fast on undefined or pending steps to catch missing implementations early
        stritct: true,

        // Retry Logic:
        // - CI: retry failed scenarios up to 2 times to mitigate flaky tests
        // - Local: no retries to surface issues immediately during development
        retry: process.env.CI ? 2 : 0,
        retryTagFilter: process.env.CI ? '@flaky' : undefined, // Only retry scenarios tagged with @flaky in CI
    },
    day5: {
        paths: ['Day5/examples/features/**/*.feature'],       // Path to Day 5 feature files
        require: [
            'Day5/examples/support/world.ts',                  // Custom World for shared context
            'Day5/examples/support/hooks.ts',                  // Hooks for setup and teardown
            'Day5/examples/step-definitions/**/*.steps.ts'     // Step definitions
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report-day5.html',
            'json:reports/cucumber-report-day5.json'
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
        strict: true,
        retry: process.env.CI ? 2 : 0,
        retryTagFilter: process.env.CI ? '@flaky' : undefined,
    },
    day2: {
        paths: ['Day2/examples/features/**/*.feature'],
        require: [
            'Day2/examples/support/world.ts',
            'Day2/examples/support/hooks.ts',
            'Day2/examples/step-definitions/**/*.steps.ts'
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report-day2.html',
            'json:reports/cucumber-report-day2.json'
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
        strict: true,
        retry: process.env.CI ? 2 : 0,
        retryTagFilter: process.env.CI ? '@flaky' : undefined,
    },
    day3: {
        paths: ['Day3/examples/features/**/*.feature'],
        require: [
            'Day3/examples/support/world.ts',
            'Day3/examples/support/hooks.ts',
            'Day3/examples/step-definitions/**/*.steps.ts'
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report-day3.html',
            'json:reports/cucumber-report-day3.json'
        ],
        formatOptions: {
            snippetInterface: 'async-await',
        },
        strict: true,
        retry: process.env.CI ? 2 : 0,
        retryTagFilter: process.env.CI ? '@flaky' : undefined,
    }
};