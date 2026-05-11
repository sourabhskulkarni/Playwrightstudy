import { test, expect } from '@playwright/test';

// Note: For Day4, we can either copy HomePage and BookingPage here or use them from Day2
// For now, creating simplified versions to avoid path complexity
class HomePage {
  constructor(private page: any) {}
  async navigate() { await this.page.goto('https://www.makemytrip.com/'); }
  async handlePopup() { try { await this.page.locator('.modalClose').click({ timeout: 5000 }); } catch (e) {} }
  async selectTripType(type: string) { await this.page.locator(`input[value="${type}"]`).check(); }
  async selectFromCity(city: string) { await this.page.locator('input[placeholder*="From"]').fill(city); }
  async selectToCity(city: string) { await this.page.locator('input[placeholder*="To"]').fill(city); }
  async selectDepartureDate() { await this.page.locator('input[placeholder*="Departure"]').click(); await this.page.locator('.DayPicker-Day').first().click(); }
  async selectReturnDate() { await this.page.locator('input[placeholder*="Return"]').click(); await this.page.locator('.DayPicker-Day').nth(5).click(); }
  async selectPassengers(adults: number, children: number) { await this.page.locator('.fsw_inputBox').click(); }
  async selectClass(classType: string) { await this.page.locator('.travelForPopup').click(); }
  async clickSearch() { await this.page.locator('button[data-cy="submit"]').click(); }
}

class BookingPage {
  constructor(private page: any) {}
  async selectFlight() { await this.page.locator('.listingCard').first().locator('button').filter({ hasText: /Book Now/i }).click(); }
  async selectFareType(fareType: string) { await this.page.locator(`[data-cy="${fareType}Fare"]`).click(); }
  async enterTravellerDetails(details: { name: string; email: string; phone: string }) { await this.page.locator('input[placeholder*="Full Name"]').fill(details.name); await this.page.locator('input[type="email"]').fill(details.email); await this.page.locator('input[type="tel"]').fill(details.phone); }
  async selectSeat() { const seatSelection = this.page.locator('.seatSelection'); if (await seatSelection.isVisible()) await seatSelection.locator('.availableSeat').first().click(); }
  async proceedToPayment() { await this.page.locator('button').filter({ hasText: /Continue/i }).click(); }
  async verifyBookingSummary() { const summary = this.page.locator('.bookingSummary'); await expect(summary).toBeVisible(); return await summary.textContent(); }
}

import { ApiClient } from './ApiClient';
import { DatabaseHelper } from './DatabaseHelper';

test.describe('Complete MakeMyTrip E2E Flow', () => {
  let dbHelper: DatabaseHelper;
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    // Initialize database
    dbHelper = new DatabaseHelper();

    // Initialize API client
    apiClient = new ApiClient();
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
    await dbHelper.close();
  });

  test('Complete booking flow with UI, API, and DB validation', async ({ page }) => {
    const homePage = new HomePage(page);
    const bookingPage = new BookingPage(page);

    // Step 1: UI - Navigate and search for flights
    await homePage.navigate();
    await homePage.handlePopup();

    await homePage.selectTripType('roundtrip');
    await homePage.selectFromCity('Delhi');
    await homePage.selectToCity('Mumbai');
    await homePage.selectDepartureDate();
    await homePage.selectReturnDate();
    await homePage.selectPassengers(1, 0);
    await homePage.selectClass('economy');
    await homePage.clickSearch();

    // Step 2: UI - Select flight and proceed to booking
    await bookingPage.selectFlight();
    await bookingPage.selectFareType('regular');

    const travellerDetails = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210'
    };
    await bookingPage.enterTravellerDetails(travellerDetails);
    await bookingPage.selectSeat();
    await bookingPage.proceedToPayment();

    // Step 3: DB - Insert user and booking data
    const userId = await dbHelper.insertUser(travellerDetails);
    const bookingData = {
      user_id: userId as number,
      flight_id: 'FL123',
      from_city: 'Delhi',
      to_city: 'Mumbai',
      departure_date: '2024-12-01',
      return_date: '2024-12-05'
    };
    const bookingId = await dbHelper.insertBooking(bookingData);

    // Step 4: API - Validate booking via API
    const apiBookingResponse = await apiClient.createBooking({
      flightId: 'FL123',
      passengers: [travellerDetails],
      payment: {
        method: 'card',
        amount: 5000
      }
    });

    expect(apiBookingResponse.status()).toBe(201);
    const apiBookingData = await apiBookingResponse.json();
    expect(apiBookingData).toHaveProperty('bookingId');

    // Step 5: DB - Verify data persistence
    const dbUser = await dbHelper.getUserByEmail(travellerDetails.email);
    expect(dbUser).toBeTruthy();
    expect((dbUser as any).name).toBe(travellerDetails.name);

    const dbBookings = await dbHelper.getBookingsByUserId(userId as number);
    expect(dbBookings).toHaveLength(1);
    expect((dbBookings as any[])[0].status).toBe('pending');

    // Step 6: API - Get booking details
    const bookingDetailsResponse = await apiClient.getBookingDetails(apiBookingData.bookingId);
    expect(bookingDetailsResponse.status()).toBe(200);
    const bookingDetails = await bookingDetailsResponse.json();
    expect(bookingDetails.status).toBe('confirmed');

    // Step 7: DB - Update booking status
    await dbHelper.updateBookingStatus(bookingId as number, 'confirmed');

    // Step 8: UI - Verify booking confirmation (assuming redirected to confirmation page)
    const summary = await bookingPage.verifyBookingSummary();
    expect(summary).toContain('confirmed');
  });

  test('API-only booking flow', async () => {
    // Login via API
    const loginResponse = await apiClient.login({
      username: 'testuser',
      password: 'testpass'
    });
    expect(loginResponse.status()).toBe(200);

    // Search flights
    const searchResponse = await apiClient.searchFlights({
      from: 'DEL',
      to: 'BOM',
      date: '2024-12-01',
      adults: 1
    });
    expect(searchResponse.status()).toBe(200);
    const flights = await searchResponse.json();
    expect(flights.flights.length).toBeGreaterThan(0);

    // Create booking
    const bookingResponse = await apiClient.createBooking({
      flightId: flights.flights[0].id,
      passengers: [{
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211'
      }],
      payment: {
        method: 'wallet',
        amount: 4500
      }
    });
    expect(bookingResponse.status()).toBe(201);

    // Get user profile
    const profileResponse = await apiClient.getUserProfile();
    expect(profileResponse.status()).toBe(200);
    const profile = await profileResponse.json();
    expect(profile).toHaveProperty('bookings');
  });
});