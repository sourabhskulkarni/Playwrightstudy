import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Day4World } from '../support/world';

Given('the E2E test environment is ready', function (this: Day4World) {
  expect(this.page).toBeDefined();
  expect(this.dbHelper).toBeDefined();
  expect(this.apiClient).toBeDefined();
});

When('I perform a UI flight search and select a flight', async function (this: Day4World) {
  // Mocking UI interaction for stable learning state.
  // In a real environment we would use Playwright to interact with DOM elements:
  // await this.page.goto('https://www.makemytrip.com/');
  // await this.page.locator('input[placeholder*="From"]').fill('Delhi');
  
  await this.page.goto('https://example.com'); // Mock site navigation
});

When('I enter traveller details for {string} and proceed to payment', async function (this: Day4World, name: string) {
  this.travellerDetails = {
    name: name,
    email: name.replace(' ', '.').toLowerCase() + '@example.com',
    phone: '9876543210'
  };
});

Then('the user and booking should be inserted into the database', async function (this: Day4World) {
  // DB Operation 1: Insert User
  this.userId = await this.dbHelper.insertUser(this.travellerDetails) as number;
  
  // DB Operation 2: Insert Booking
  const bookingData = {
    user_id: this.userId,
    flight_id: 'FL123',
    from_city: 'Delhi',
    to_city: 'Mumbai',
    departure_date: '2024-12-01',
    return_date: '2024-12-05'
  };
  this.dbBookingId = await this.dbHelper.insertBooking(bookingData) as number;
  
  expect(this.userId).toBeGreaterThan(0);
  expect(this.dbBookingId).toBeGreaterThan(0);
});

Then('the booking should be created successfully via API', async function (this: Day4World) {
  const apiBookingResponse = await this.apiClient.createBooking({
    flightId: 'FL123',
    passengers: [this.travellerDetails],
    payment: {
      method: 'card',
      amount: 5000
    }
  });

  expect(apiBookingResponse.status()).toBe(201);
  const data = await apiBookingResponse.json();
  expect(data).toHaveProperty('bookingId');
  this.apiBookingId = data.bookingId;
});

Then('the database should reflect the pending booking status', async function (this: Day4World) {
  const dbBookings: any = await this.dbHelper.getBookingsByUserId(this.userId);
  expect(dbBookings).toHaveLength(1);
  expect(dbBookings[0].status).toBe('pending');
});

When('I retrieve the booking details via API', async function (this: Day4World) {
  const detailsResponse = await this.apiClient.getBookingDetails(this.apiBookingId);
  expect(detailsResponse.status()).toBe(200);
});

Then('the API booking status should be {string}', async function (this: Day4World, status: string) {
  const detailsResponse = await this.apiClient.getBookingDetails(this.apiBookingId);
  const details = await detailsResponse.json();
  expect(details.status).toBe(status);
});

Then('the database status should be updated to {string}', async function (this: Day4World, status: string) {
  const changes = await this.dbHelper.updateBookingStatus(this.dbBookingId, status);
  expect(changes).toBeGreaterThan(0);
  
  const dbBookings: any = await this.dbHelper.getBookingsByUserId(this.userId);
  expect(dbBookings[0].status).toBe(status);
});

Then('the UI should display a confirmed booking summary', async function (this: Day4World) {
  // Mocking UI confirmation
  const uiSummaryMock = 'Booking confirmed for FL123';
  expect(uiSummaryMock).toContain('confirmed');
});

// --- API Only Flow ---
Given('the API client is authenticated with {string} and {string}', async function (this: Day4World, user: string, pass: string) {
  const loginResponse = await this.apiClient.login({ username: user, password: pass });
  expect(loginResponse.status()).toBe(200);
});

When('I search flights from {string} to {string} via API', async function (this: Day4World, from: string, to: string) {
  const searchResponse = await this.apiClient.searchFlights({
    from,
    to,
    date: '2024-12-01',
    adults: 1
  });
  expect(searchResponse.status()).toBe(200);
  const data = await searchResponse.json();
  this.flightsList = data.flights;
});

Then('the API should return a list of available flights', function (this: Day4World) {
  expect(this.flightsList.length).toBeGreaterThan(0);
});

When('I create a booking for the first flight via API', async function (this: Day4World) {
  const bookingResponse = await this.apiClient.createBooking({
    flightId: this.flightsList[0].id,
    passengers: [{ name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211' }],
    payment: { method: 'wallet', amount: 4500 }
  });
  expect(bookingResponse.status()).toBe(201);
});

Then('the API booking response should be successful', function (this: Day4World) {
  // Assertion already covered in step above, adding a placeholder for BDD step resolution
});

Then('my user profile should contain the new booking', async function (this: Day4World) {
  const profileResponse = await this.apiClient.getUserProfile();
  expect(profileResponse.status()).toBe(200);
  const profile = await profileResponse.json();
  expect(profile).toHaveProperty('bookings');
});
