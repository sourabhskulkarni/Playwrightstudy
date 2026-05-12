import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { Day3World } from './world';

import { setDefaultTimeout } from '@cucumber/cucumber';
setDefaultTimeout(60000);

BeforeAll(async function () {
  // Global setup if needed
});

AfterAll(async function () {
  // Global teardown if needed
});

Before(async function (this: Day3World) {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.apiContext = this.context.request;
});

After(async function (this: Day3World) {
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
