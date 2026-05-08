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
  private page: Page;

  // Locator definitions - private and isolated
  private readonly oneWayRadio: Locator;
  private readonly roundTripRadio: Locator;
  private readonly fromCityInput: Locator;
  private readonly toCityInput: Locator;
  private readonly departureDateInput: Locator;
  private readonly returnDateInput: Locator;
  private readonly adultsInput: Locator;
  private readonly childrenInput: Locator;
  private readonly infantsInput: Locator;
  private readonly cabinClassDropdown: Locator;
  private readonly searchButton: Locator;
  private readonly popupCloseButton: Locator;
  private readonly citySuggestion: Locator;
  private readonly datePicker: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust selectors
    this.oneWayRadio = page.locator('input[value="oneway"]');
    this.roundTripRadio = page.locator('input[value="roundtrip"]');
    this.fromCityInput = page.locator('input[placeholder*="From"]').first();
    this.toCityInput = page.locator('input[placeholder*="To"]').first();
    this.departureDateInput = page.locator('input[placeholder*="Departure"]').first();
    this.returnDateInput = page.locator('input[placeholder*="Return"]').first();
    this.adultsInput = page.locator('[data-cy="adultUser"]');
    this.childrenInput = page.locator('[data-cy="childUser"]');
    this.infantsInput = page.locator('[data-cy="infantUser"]');
    this.cabinClassDropdown = page.locator('.cabin-class-selector, [data-cy="cabinClass"]');
    this.searchButton = page.locator('button[data-cy="submit"]');
    this.popupCloseButton = page
      .locator('.modalClose, [data-cy="closeModal"], button[aria-label*="Close"]')
      .first();
    this.citySuggestion = page.locator('.react-autosuggest__suggestion').first();
    this.datePicker = page.locator('.DayPicker');
  }

  /**
   * Navigate to the MakeMyTrip homepage
   * @throws Error if navigation fails
   */
  async navigate(): Promise<void> {
    try {
      logger.info('Navigating to base URL', { url: config.baseUrl });
      await this.page.goto(config.baseUrl, { waitUntil: 'networkidle' });
      logger.info('Successfully navigated to homepage');
    } catch (error) {
      logger.error('Navigation failed', error);
      throw new Error(`Failed to navigate to ${config.baseUrl}: ${error}`);
    }
  }

  /**
   * Handle any popups that may appear on the homepage
   * Waits for popup to appear and closes it
   */
  async handlePopup(): Promise<void> {
    try {
      logger.debug('Attempting to close popup');
      const isVisible = await this.popupCloseButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (isVisible) {
        await this.popupCloseButton.click();
        logger.info('Popup closed successfully');
      } else {
        logger.debug('No popup found');
      }
    } catch (error) {
      logger.warn('Error handling popup', error);
      // Non-critical - continue execution
    }
  }

  /**
   * Select trip type
   * @param tripType Type of trip - 'OneWay' or 'RoundTrip'
   */
  async selectTripType(tripType: 'OneWay' | 'RoundTrip'): Promise<void> {
    try {
      logger.info('Selecting trip type', { tripType });
      const radioButton = tripType === 'OneWay' ? this.oneWayRadio : this.roundTripRadio;
      await radioButton.check();
      await expect(radioButton).toBeChecked();
      logger.info(`Trip type '${tripType}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select trip type: ${tripType}`, error);
      throw error;
    }
  }

  /**
   * Select departure city with dropdown handling
   * @param city City name to select
   */
  async selectFromCity(city: string): Promise<void> {
    try {
      logger.info('Selecting from city', { city });
      await this.fromCityInput.click();
      await this.fromCityInput.fill(city);
      await this.page.waitForTimeout(500); // Allow suggestions to load
      await this.citySuggestion.click();
      logger.info(`From city '${city}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select from city: ${city}`, error);
      throw error;
    }
  }

  /**
   * Select destination city with dropdown handling
   * @param city City name to select
   */
  async selectToCity(city: string): Promise<void> {
    try {
      logger.info('Selecting to city', { city });
      await this.toCityInput.click();
      await this.toCityInput.fill(city);
      await this.page.waitForTimeout(500);
      await this.citySuggestion.click();
      logger.info(`To city '${city}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select to city: ${city}`, error);
      throw error;
    }
  }

  /**
   * Select departure date
   * @param date Date string in YYYY-MM-DD format
   */
  async selectDepartureDate(date: string): Promise<void> {
    try {
      logger.info('Selecting departure date', { date });
      await this.departureDateInput.click();
      await this.page.waitForSelector('.DayPicker', { timeout: 5000 });
      // Select date logic - adjust based on actual calendar structure
      const dayButton = this.page.locator('.DayPicker-Day', { hasText: date.split('-')[2] });
      await dayButton.first().click();
      logger.info(`Departure date '${date}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select departure date: ${date}`, error);
      throw error;
    }
  }

  /**
   * Select return date (for round trip)
   * @param date Date string in YYYY-MM-DD format
   */
  async selectReturnDate(date: string): Promise<void> {
    try {
      logger.info('Selecting return date', { date });
      await this.returnDateInput.click();
      await this.page.waitForSelector('.DayPicker', { timeout: 5000 });
      const dayButton = this.page.locator('.DayPicker-Day', { hasText: date.split('-')[2] });
      await dayButton.nth(1).click(); // Select from remaining options
      logger.info(`Return date '${date}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select return date: ${date}`, error);
      throw error;
    }
  }

  /**
   * Select number of passengers
   * @param adults Number of adults
   * @param children Number of children
   * @param infants Number of infants
   */
  async selectPassengers(adults: number = 1, children: number = 0, infants: number = 0): Promise<void> {
    try {
      logger.info('Selecting passengers', { adults, children, infants });

      // Click on passenger selector to open dropdown
      const passengerSelector = this.page.locator('[data-cy="passengers"]');
      await passengerSelector.click();

      // Set adults
      for (let i = 1; i < adults; i++) {
        const adultIncrement = this.page.locator('[data-cy="adultIncrement"]');
        await adultIncrement.click();
      }

      // Set children
      for (let i = 0; i < children; i++) {
        const childIncrement = this.page.locator('[data-cy="childIncrement"]');
        await childIncrement.click();
      }

      // Set infants
      for (let i = 0; i < infants; i++) {
        const infantIncrement = this.page.locator('[data-cy="infantIncrement"]');
        await infantIncrement.click();
      }

      logger.info('Passengers selected successfully');
    } catch (error) {
      logger.error('Failed to select passengers', error);
      throw error;
    }
  }

  /**
   * Select cabin class
   * @param cabinClass Type of cabin - Economy, Premium Economy, Business, First
   */
  async selectCabinClass(cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First'): Promise<void> {
    try {
      logger.info('Selecting cabin class', { cabinClass });
      await this.cabinClassDropdown.click();
      const classOption = this.page.locator(`[data-cy="${cabinClass.toLowerCase().replace(' ', '-')}"]`);
      await classOption.click();
      logger.info(`Cabin class '${cabinClass}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select cabin class: ${cabinClass}`, error);
      throw error;
    }
  }

  /**
   * Click search button to initiate flight search
   * @returns Promise that resolves when search results are loaded
   */
  async clickSearch(): Promise<void> {
    try {
      logger.info('Clicking search button');
      await this.searchButton.click();
      // Wait for search results to load
      await this.page.waitForSelector('.flightListing, [data-cy="flightResults"]', {
        timeout: config.timeout,
      });
      logger.info('Search completed successfully');
    } catch (error) {
      logger.error('Failed to execute search', error);
      throw error;
    }
  }

  /**
   * Get the value of departure date field
   * @returns Selected departure date
   */
  async getDepartureDate(): Promise<string | null> {
    try {
      return await this.departureDateInput.inputValue();
    } catch (error) {
      logger.warn('Failed to get departure date', error);
      return null;
    }
  }

  /**
   * Get the value of return date field
   * @returns Selected return date
   */
  async getReturnDate(): Promise<string | null> {
    try {
      return await this.returnDateInput.inputValue();
    } catch (error) {
      logger.warn('Failed to get return date', error);
      return null;
    }
  }
}