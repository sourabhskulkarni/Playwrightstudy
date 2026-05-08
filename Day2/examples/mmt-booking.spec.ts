import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';

test.describe('MakeMyTrip Booking Flow', () => {
  test('Book a round trip flight', async ({ page }) => {
    const homePage = new HomePage(page);
    const bookingPage = new BookingPage(page);

    // Navigate and handle initial popup
    await homePage.navigate();
    await homePage.handlePopup();

    // Select trip type
    await homePage.selectTripType('roundtrip');

    // Select cities
    await homePage.selectFromCity('Delhi');
    await homePage.selectToCity('Mumbai');

    // Select dates
    await homePage.selectDepartureDate();
    await homePage.selectReturnDate();

    // Select passengers
    await homePage.selectPassengers(2, 1);

    // Select class
    await homePage.selectClass('economy');

    // Search
    await homePage.clickSearch();

    // On results page, select flight
    await bookingPage.selectFlight();

    // Select fare
    await bookingPage.selectFareType('regular');

    // Enter traveller details
    await bookingPage.enterTravellerDetails({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210'
    });

    // Select seat if available
    await bookingPage.selectSeat();

    // Proceed to payment
    await bookingPage.proceedToPayment();

    // Verify booking summary
    const summary = await bookingPage.verifyBookingSummary();
    console.log('Booking Summary:', summary);
  });
});