/**
 * Cucumber Hooks - Browser life cycle management and test setup/teardown
 * 
 * Industry best practices for hooks:
 * - Before hook: Initialize browser context, set up test data, and log test start
 * - After hook: Capture screenshots on failure, clean up test data, and log test end
 * - BeforeAll: Set up global test environment (e.g., database connections, test data seeding)
 * - AfterAll: Tear down global test environment (e.g., close database connections, clean up test data)
 * 
 * why not use playwright's test.beforeEach and afterEach directly in test files?
 * Those belong to playwright's test runner and are great for unit tests, but for BDD scenarios we want to abstract away the test framework specifics from the step definitions. By using Cucumber hooks, we can keep our step definitions clean and focused on business logic, while the hooks handle all the technical setup and teardown. This also allows us to easily switch out the underlying test runner in the future if needed, without having to change our step definitions.
 * This file demonstrates a production-ready implementation of Cucumber hooks
 * using Playwright's test runner and custom fixtures for context management
 */

import { 
    Before, 
    After, 
    BeforeAll, 
    AfterAll, 
    Status, 
    ITestCaseHookParameter,
    setDefaultTimeout } from '@cucumber/cucumber';
    import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
    import { logger } from '../utils/logger';
    import { config } from '../config/config';
    import { customWorld } from '../support/world';
import { timingSafeEqual } from 'crypto';
import { parse } from 'dotenv';

    // global step timeout 
    setDefaultTimeout(30000); // 30 seconds cucmber's default is 5000ms

    // one-time global setup
    BeforeAll(async function () {
        logger.info('=== Test suit starting ===');
        // e.g., connect to test database, seed data, etc.
    });

    // one-time global teardown
    AfterAll(async function () {
        logger.info('=== Test suit completed ===');
        // e.g., disconnect from test database, clean up data, etc.
    });

    // Per scenario setup
    /**
     * Launch a fresh browser context and page for each scenario
     * This ensures test isolation and prevents state leakage between scenarios
     */
    Before({ timeout: 60000 }, async function (this: customWorld,{pickle, willBeRetried }: ITestCaseHookParameter){
        this.scenarioName = pickle.name;

    //will be retried is a boolean that indicates if the current scenario is being retried after a failure. This can be useful for logging and debugging purposes, as it allows you to track how many times a scenario has been attempted and whether it eventually passed or failed after retries.
    if (willBeRetried) {
        logger.warn(`Retrying scenario: ${this.scenarioName}`);
    } else {
        logger.info(`Starting scenario: ${this.scenarioName}`);
    }
    //Launch bowser and create new context and page for the scenario via environment variables or config file
    this.browser = await chromium.launch({ 
        headless: config.headless, 
        slowMo: config.slowMo,
    });

    // new conetxt per scenario for test isolation (cookies, local storage, etc.)
    this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(config.timeout);
    this.page.setDefaultNavigationTimeout(config.navigationTimeout);
    logger.info('Browser context and page initialized for scenario');  
});

// Per scenario teardown
/** 
 * on failure, capture screenshot and log error details
 * then close browser context to clean up resources regardless of test outcome
 */
After({ timeout: 30000 }, async function (this: customWorld, { result, pickle, willBeRetried }: ITestCaseHookParameter) {
    const status = result?.status;
 
    if (status === Status.FAILED) {
        if(willBeRetried) {
            logger.warn(`Scenario failed but will be retried: ${pickle.name}`);
        } else {
            logger.error(`Scenario failed: ${pickle.name}`);
        }

        if (this.page) {
            const screenshot = await this.page.screenshot({ fullPage: true });
            await this.attach(screenshot, 'image/png');
            const screenshotPath = `screenshots/${pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath });
            logger.info(`Screenshot captured: ${screenshotPath}`);
        
        //keep the browser open on final failure only (not on retries) for debugging purposes
        const pauseMs = parseInt(process.env.PAUSE_ON_FAILURE_MS || '3000', 10);
        if (!config.headless && pauseMs > 0 && !willBeRetried) {
            logger.info(`Pausing for ${pauseMs}ms to allow for debugging...`);
            await new Promise(resolve => setTimeout(resolve, pauseMs));
        }
    }
} else {
    logger.info(`Scenario completed with status: ${pickle.name} - ${status}`);
}

// alwaays close browser context to clean up resources in reverse order of creation
await this.page?.close();
await this.context?.close();
await this.browser?.close();
logger.info('Browser context and page closed for scenario');

});

