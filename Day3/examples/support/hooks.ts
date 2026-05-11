import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { Day4World } from './world';
import { ApiClient } from '../ApiClient';
import { DatabaseHelper } from '../DatabaseHelper';

setDefaultTimeout(60000);

Before(async function (this: Day4World) {
  // Setup browser for UI tests
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // Setup database
  this.dbHelper = new DatabaseHelper(); // Uses in-memory DB by default

  // Setup API Client
  this.apiClient = new ApiClient();
  await this.apiClient.init();
});

After(async function (this: Day4World) {
  await this.page.close();
  await this.context.close();
  await this.browser.close();

  await this.dbHelper.close();
  await this.apiClient.dispose();
});
