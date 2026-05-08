import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://www.makemytrip.com/');
  }

  async selectTripType(tripType: 'oneway' | 'roundtrip') {
    const radio = this.page.locator(`input[value="${tripType}"]`);
    await radio.check();
  }

  async selectFromCity(city: string) {
    const fromInput = this.page.locator('input[placeholder*="From"]');
    await fromInput.fill(city);
    // Select from dropdown
    await this.page.locator('.react-autosuggest__suggestion').first().click();
  }

  async selectToCity(city: string) {
    const toInput = this.page.locator('input[placeholder*="To"]');
    await toInput.fill(city);
    await this.page.locator('.react-autosuggest__suggestion').first().click();
  }

  async selectDepartureDate() {
    const datePicker = this.page.locator('input[placeholder*="Departure"]');
    await datePicker.click();
    // Select a date - assuming calendar is open
    await this.page.locator('.DayPicker-Day').first().click();
  }

  async selectReturnDate() {
    const returnPicker = this.page.locator('input[placeholder*="Return"]');
    await returnPicker.click();
    await this.page.locator('.DayPicker-Day').nth(5).click(); // 5th day
  }

  async selectPassengers(adults: number = 1, children: number = 0) {
    const passengerDropdown = this.page.locator('.fsw_inputBox');
    await passengerDropdown.click();
    // Adjust counts - this might need adjustment based on actual site
    for (let i = 1; i < adults; i++) {
      await this.page.locator('.adult').locator('+ button').click();
    }
    for (let i = 0; i < children; i++) {
      await this.page.locator('.child').locator('+ button').click();
    }
  }

  async selectClass(classType: 'economy' | 'premium' | 'business') {
    const classDropdown = this.page.locator('.travelForPopup');
    await classDropdown.click();
    await this.page.locator(`[data-cy="${classType}"]`).click();
  }

  async clickSearch() {
    const searchBtn = this.page.locator('button[data-cy="submit"]');
    await searchBtn.click();
  }

  async handlePopup() {
    // Handle any popups
    try {
      const popupClose = this.page.locator('.modalClose').or(this.page.locator('[data-cy="closeModal"]'));
      if (await popupClose.isVisible({ timeout: 5000 })) {
        await popupClose.click();
      }
    } catch (e) {
      // No popup
    }
  }
}