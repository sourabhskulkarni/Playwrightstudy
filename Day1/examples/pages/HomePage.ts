/**
 * HomePage - Page Object Model
 * 
 * Encapsulates all interactions with the MakeMyTrip homepage
 * Following corporate standard Page Object Model pattern
 * - All locators are private
 * - All methods return actionable results
 * - Comprehensive error handling and logging
 * - No test logic, only navigation and element interaction
 */

import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export class HomePage {
  private readonly page: Page;

  // Locator definitions - private and isolated
  private readonly loginpopup: Locator;
  private readonly closepopup: Locator;
  private readonly LoginorCreateAccountButton: Locator;
  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust selectors
    this.loginpopup = page.getByText('Or Login/Signup With');
    this.closepopup = page.locator('.commonModal__close');
    this.LoginorCreateAccountButton = page.getByRole('listitem').filter({ hasText: 'Login or Create Account' });
  }

  /**
   * Navigate to the MakeMyTrip homepage
   * @throws Error if navigation fails
   */
  async navigate(): Promise<void> {
    await this.page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' })
    logger.info('Navigated to homepage', { url: config.baseUrl });
  }

  async verifyloginpopupvisible(): Promise<void> {
    await expect(this.loginpopup).toBeVisible({ timeout: 10000 });
    logger.info('Login pop-up is visible');
  }

  async closeLoginPopup(): Promise<void> {
    await this.closepopup.click();
    await expect(this.loginpopup).toBeHidden({ timeout: 5000 });
    logger.info('Login pop-up has been closed');
  }

  async verifyLoginOrCreateAccountButtonVisible(): Promise<void> {
    await expect(this.LoginorCreateAccountButton).toBeVisible({ timeout: 5000 });
    logger.info('Login or Create Account button is visible');
  }
}