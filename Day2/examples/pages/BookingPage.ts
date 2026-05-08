/**
 * BookingPage - Page Object Model
 * 
 * Encapsulates all interactions with the flight booking page
 * Following corporate standard Page Object Model pattern
 * - All locators are private
 * - All methods return actionable results
 * - Comprehensive error handling and logging
 * - No test logic, only navigation and element interaction
 */

import { Page, Locator, expect } from '@playwright/test';
import { Passenger, FareDetails } from '../utils/testData';
import { logger } from '../utils/logger';

export class BookingPage {
  private page: Page;

  // Locator definitions - private to prevent direct access
  private readonly firstFlightOption: Locator;
  private readonly flightListingContainer: Locator;
  private readonly fareTypeSelector: Locator;
  private readonly regularFareOption: Locator;
  private readonly specialFareOption: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly seatSelectionContainer: Locator;
  private readonly availableSeats: Locator;
  private readonly continueButton: Locator;
  private readonly bookingSummary: Locator;
  private readonly proceedToPaymentButton: Locator;
  private readonly fareBreakdown: Locator;
  private readonly addPassengerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust selectors
    this.flightListingContainer = page.locator('.flightListing, [data-cy="flightResults"]');
    this.firstFlightOption = this.flightListingContainer.locator('.listingCard, [data-cy="flightCard"]').first();
    this.fareTypeSelector = page.locator('.fareTypeSelector, [data-cy="fareType"]');
    this.regularFareOption = page.locator('[data-cy="regularFare"]');
    this.specialFareOption = page.locator('[data-cy="specialFare"]');
    this.nameInput = page.locator('input[placeholder*="Full Name"], input[data-cy="passengerName"]');
    this.emailInput = page.locator('input[type="email"], input[data-cy="passengerEmail"]');
    this.phoneInput = page.locator('input[type="tel"], input[data-cy="passengerPhone"]');
    this.seatSelectionContainer = page.locator('.seatSelection, [data-cy="seatMap"]');
    this.availableSeats = this.seatSelectionContainer.locator('.availableSeat, [data-cy="seat"]:not([disabled])');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.bookingSummary = page.locator('.bookingSummary, [data-cy="bookingSummary"]');
    this.proceedToPaymentButton = page.locator('button:has-text("Proceed to Payment")');
    this.fareBreakdown = page.locator('.fareBreakdown, [data-cy="fareDetails"]');
    this.addPassengerButton = page.locator('button:has-text("Add Passenger")');
  }

  /**
   * Check if flight listings are visible
   * @returns boolean indicating if flights are available
   */
  async areFlightsAvailable(): Promise<boolean> {
    try {
      return await this.flightListingContainer.isVisible({ timeout: 5000 });
    } catch {
      logger.debug('No flights visible on page');
      return false;
    }
  }

  /**
   * Select the first available flight
   * @throws Error if no flights are available
   */
  async selectFirstFlight(): Promise<void> {
    try {
      logger.info('Selecting first available flight');
      const isAvailable = await this.areFlightsAvailable();
      if (!isAvailable) {
        throw new Error('No flights available to select');
      }

      const flightInfo = await this.firstFlightOption.locator('.flightInfo, [data-cy="flightInfo"]').textContent();
      logger.debug('Flight details', { flightInfo });

      await this.firstFlightOption.click();
      logger.info('First flight selected successfully');
    } catch (error) {
      logger.error('Failed to select first flight', error);
      throw error;
    }
  }

  /**
   * Get count of available flights
   * @returns Number of flights displayed
   */
  async getFlightCount(): Promise<number> {
    try {
      const count = await this.flightListingContainer
        .locator('.listingCard, [data-cy="flightCard"]')
        .count();
      logger.debug('Flight count retrieved', { count });
      return count;
    } catch (error) {
      logger.warn('Failed to get flight count', error);
      return 0;
    }
  }

  /**
   * Select fare type for the chosen flight
   * @param fareType Type of fare - 'Regular' or 'Special'
   */
  async selectFareType(fareType: 'Regular' | 'Special'): Promise<void> {
    try {
      logger.info('Selecting fare type', { fareType });
      const fareOption = fareType === 'Regular' ? this.regularFareOption : this.specialFareOption;
      await fareOption.click();
      await expect(fareOption).toBeChecked();
      logger.info(`Fare type '${fareType}' selected successfully`);
    } catch (error) {
      logger.error(`Failed to select fare type: ${fareType}`, error);
      throw error;
    }
  }

  /**
   * Get fare details from the page
   * @returns Fare breakdown information
   */
  async getFareDetails(): Promise<any> {
    try {
      logger.debug('Retrieving fare details');
      const fareText = await this.fareBreakdown.textContent();
      logger.info('Fare details retrieved', { fareText });
      return fareText;
    } catch (error) {
      logger.warn('Failed to get fare details', error);
      return null;
    }
  }

  /**
   * Enter traveller details for booking
   * @param passenger Passenger information
   * @param passengerIndex Index of passenger if multiple
   */
  async enterTravellerDetails(passenger: Passenger, passengerIndex: number = 0): Promise<void> {
    try {
      logger.info('Entering traveller details', { passengerIndex, name: passenger.name });

      // Use nth() if there are multiple passenger forms
      const nameField = passengerIndex > 0 ? this.nameInput.nth(passengerIndex) : this.nameInput;
      const emailField = passengerIndex > 0 ? this.emailInput.nth(passengerIndex) : this.emailInput;
      const phoneField = passengerIndex > 0 ? this.phoneInput.nth(passengerIndex) : this.phoneInput;

      await nameField.fill(passenger.name);
      await emailField.fill(passenger.email);
      await phoneField.fill(passenger.phone);

      logger.info(`Traveller details entered successfully for ${passenger.name}`);
    } catch (error) {
      logger.error(`Failed to enter traveller details for ${passenger.name}`, error);
      throw error;
    }
  }

  /**
   * Enter details for multiple travellers
   * @param passengers Array of passenger information
   */
  async enterMultipleTravellerDetails(passengers: Passenger[]): Promise<void> {
    try {
      logger.info('Entering details for multiple travellers', { count: passengers.length });

      for (let i = 0; i < passengers.length; i++) {
        if (i > 0) {
          await this.addPassengerButton.click();
          await this.page.waitForTimeout(500);
        }
        await this.enterTravellerDetails(passengers[i], i);
      }

      logger.info('All traveller details entered successfully');
    } catch (error) {
      logger.error('Failed to enter multiple traveller details', error);
      throw error;
    }
  }

  /**
   * Select a seat for the traveller
   * @returns boolean indicating if seat was successfully selected
   */
  async selectSeat(): Promise<boolean> {
    try {
      logger.debug('Attempting to select seat');
      const isVisible = await this.seatSelectionContainer.isVisible({ timeout: 3000 }).catch(() => false);

      if (!isVisible) {
        logger.debug('Seat selection not available');
        return false;
      }

      const seatCount = await this.availableSeats.count();
      if (seatCount === 0) {
        logger.warn('No available seats found');
        return false;
      }

      await this.availableSeats.first().click();
      logger.info('Seat selected successfully');
      return true;
    } catch (error) {
      logger.warn('Error selecting seat', error);
      return false;
    }
  }

  /**
   * Proceed to payment by clicking continue button
   */
  async proceedToPayment(): Promise<void> {
    try {
      logger.info('Proceeding to payment');
      await this.proceedToPaymentButton.click();
      // Wait for payment page to load
      await this.page.waitForLoadState('networkidle');
      logger.info('Successfully proceeded to payment');
    } catch (error) {
      logger.error('Failed to proceed to payment', error);
      throw error;
    }
  }

  /**
   * Verify booking summary is displayed
   * @returns boolean indicating if summary is visible
   */
  async isBookingSummaryVisible(): Promise<boolean> {
    try {
      const isVisible = await this.bookingSummary.isVisible({ timeout: 5000 });
      logger.info('Booking summary visibility checked', { isVisible });
      return isVisible;
    } catch (error) {
      logger.warn('Failed to check booking summary', error);
      return false;
    }
  }

  /**
   * Get booking summary content
   * @returns Text content of booking summary
   */
  async getBookingSummary(): Promise<string | null> {
    try {
      logger.debug('Retrieving booking summary');
      const isVisible = await this.isBookingSummaryVisible();
      if (!isVisible) {
        logger.warn('Booking summary not visible');
        return null;
      }
      const summary = await this.bookingSummary.textContent();
      logger.info('Booking summary retrieved successfully');
      return summary;
    } catch (error) {
      logger.error('Failed to get booking summary', error);
      return null;
    }
  }

  /**
   * Get traveller details from form (for verification)
   * @param passengerIndex Index of passenger form
   * @returns Object containing entered traveller details
   */
  async getTravellerDetails(passengerIndex: number = 0): Promise<Partial<Passenger> | null> {
    try {
      const nameField = passengerIndex > 0 ? this.nameInput.nth(passengerIndex) : this.nameInput;
      const emailField = passengerIndex > 0 ? this.emailInput.nth(passengerIndex) : this.emailInput;
      const phoneField = passengerIndex > 0 ? this.phoneInput.nth(passengerIndex) : this.phoneInput;

      const name = await nameField.inputValue();
      const email = await emailField.inputValue();
      const phone = await phoneField.inputValue();

      logger.debug('Traveller details retrieved', { name, email, phone });
      return { name, email, phone };
    } catch (error) {
      logger.error('Failed to get traveller details', error);
      return null;
    }
  }
}