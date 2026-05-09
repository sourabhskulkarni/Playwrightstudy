/**
 * CustomWorld - Cucumber World Class
 * 
 * Industy Standard:
 * - World is the shared context object that is passed to all step definitions and hooks in Cucumber. It allows you to store and share data across steps within the same scenario.
 * - Browser, context, and page are initialized in the Before hook and made available on the World instance for use in step definitions.
 * - Page objects can be stored on the World instance for easy access across steps.
 * - never initialize browser or page in the constructor of the World class, always do it in the Before hook to ensure proper test isolation and lifecycle management.
 */

import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

export class customWorld extends World {
    // playwright browser stack - initialized in Before hook
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    // page objects can be stored here for easy access across steps
    homePage!: HomePage;

    //shared scenario data can also be stored here
    scenarioName: string = '';

    constructor(options: IWorldOptions) {
        super(options);
    }
}

// Register our custom world so Cucumber injects as 'this' in step definitions and hooks
setWorldConstructor(customWorld);