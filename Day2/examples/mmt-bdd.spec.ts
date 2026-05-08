import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';

test.describe('MakeMyTrip Booking with BDD approach', () => {
  let homePage: HomePage;
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    bookingPage = new BookingPage(page);
  });

  test('Given user is on MakeMyTrip homepage, When user selects round trip, Then user should see flight results', async ({ page }) => {
    // Given: user is on MakeMyTrip homepage
    await homePage.navigate();
    await homePage.handlePopup();

    // When: user selects round trip option
    await homePage.selectTripType('roundtrip');

    // When: user selects from city Delhi and to city Mumbai
    await homePage.selectFromCity('Delhi');
    await homePage.selectToCity('Mumbai');

    // When: user selects departure and return dates
    await homePage.selectDepartureDate();
    await homePage.selectReturnDate();

    // When: user selects 2 adults and 1 child
    await homePage.selectPassengers(2, 1);

    // When: user selects economy class
    await homePage.selectClass('economy');

    // When: user clicks on search
    await homePage.clickSearch();

    // Then: user should see flight results
    await page.waitForSelector('.listingCard', { timeout: 10000 });
    const resultCount = await page.locator('.listingCard').count();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('When user selects first available flight, Then user should be on booking page', async ({ page }) => {
    // Setup: Navigate to results page
    await homePage.navigate();
    await homePage.handlePopup();
    await homePage.selectTripType('oneway');
    await homePage.selectFromCity('Delhi');
    await homePage.selectToCity('Mumbai');
    await homePage.selectDepartureDate();
    await homePage.selectPassengers(1, 0);
    await homePage.clickSearch();

    // Wait for flights to load
    await page.waitForSelector('.listingCard', { timeout: 10000 });

    // When: user selects first available flight
    await bookingPage.selectFlight();

    // Then: user should be on booking details page
    // (Assuming next page shows booking form)
    const bookingForm = page.locator('input[placeholder*="Full Name"]');
    await expect(bookingForm).toBeVisible({ timeout: 5000 });
  });

  test('When user enters traveller details, Then user should be able to proceed to payment', async ({ page }) => {
    // Setup: Navigate and go to booking page
    await homePage.navigate();
    await homePage.handlePopup();
    await homePage.selectTripType('oneway');
    await homePage.selectFromCity('Delhi');
    await homePage.selectToCity('Mumbai');
    await homePage.selectDepartureDate();
    await homePage.clickSearch();

    await page.waitForSelector('.listingCard');
    await bookingPage.selectFlight();

    // When: user enters traveller details
    const travellerDetails = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210'
    };
    await bookingPage.enterTravellerDetails(travellerDetails);

    // When: user selects a seat if available
    await bookingPage.selectSeat();

    // Then: user should be able to proceed to payment
    const proceedBtn = page.locator('button').filter({ hasText: /Continue|Proceed|Pay/i });
    await expect(proceedBtn).toBeVisible({ timeout: 5000 });
  });
});