import { Page, expect } from '@playwright/test';

export class BookingPage {
  constructor(private page: Page) {}

  async selectFlight() {
    // Select first available flight
    const firstFlight = this.page.locator('.listingCard').first();
    await firstFlight.locator('button').filter({ hasText: /Book Now/i }).click();
  }

  async selectFareType(fareType: 'regular' | 'special') {
    const fareOption = this.page.locator(`[data-cy="${fareType}Fare"]`);
    await fareOption.click();
  }

  async enterTravellerDetails(details: { name: string; email: string; phone: string }) {
    await this.page.locator('input[placeholder*="Full Name"]').fill(details.name);
    await this.page.locator('input[type="email"]').fill(details.email);
    await this.page.locator('input[type="tel"]').fill(details.phone);
  }

  async selectSeat() {
    // If seat selection is available
    const seatSelection = this.page.locator('.seatSelection');
    if (await seatSelection.isVisible()) {
      await seatSelection.locator('.availableSeat').first().click();
    }
  }

  async proceedToPayment() {
    const continueBtn = this.page.locator('button').filter({ hasText: /Continue/i });
    await continueBtn.click();
  }

  async verifyBookingSummary() {
    const summary = this.page.locator('.bookingSummary');
    await expect(summary).toBeVisible();
    return await summary.textContent();
  }
}