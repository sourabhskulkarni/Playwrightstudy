/**
 * BDD Step Definitions - Flight Booking
 * 
 * CORPORATE STANDARD:
 * - Complete implementation of all steps (not just comments)
 * - Proper use of Playwright fixtures and context
 * - Error handling and logging at each step
 * - Test data management externalized
 * - Page objects used consistently
 * 
 * This demonstrates a production-ready BDD setup using Playwright
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BookingPage } from '../pages/BookingPage';
import { TestDataBuilder, BookingDetails } from '../utils/testData';
import { logger } from '../utils/logger';

// BDD Style Test Suite
test.describe('MakeMyTrip Flight Booking - BDD Suite', () => {
  let homePage: HomePage;
  let bookingPage: BookingPage;
  let testData: BookingDetails;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    bookingPage = new BookingPage(page);

    // Prepare test data
    testData = TestDataBuilder.roundTripDelhi();

    // Log test initialization
    logger.info('Test setup completed', {
      tripType: testData.flightSearchCriteria.tripType,
      passengers: testData.passengers.length,
    });
  });

  test('Scenario: Book a round trip flight successfully', async ({ page }) => {
    // Given: User is on MakeMyTrip homepage
    logger.info('STEP: User is on MakeMyTrip homepage');
    await homePage.navigate();
    await homePage.handlePopup();

    // When: User selects round trip option
    logger.info('STEP: User selects round trip option');
    const tripType = testData.flightSearchCriteria.tripType as 'OneWay' | 'RoundTrip';
    await homePage.selectTripType(tripType);

    // And: User selects from city "Delhi" and to city "Mumbai"
    logger.info('STEP: User selects from and to cities');
    await homePage.selectFromCity(testData.flightSearchCriteria.fromCity);
    await homePage.selectToCity(testData.flightSearchCriteria.toCity);

    // And: User selects departure and return dates
    logger.info('STEP: User selects dates');
    await homePage.selectDepartureDate(testData.flightSearchCriteria.departureDate);
    if (testData.flightSearchCriteria.returnDate) {
      await homePage.selectReturnDate(testData.flightSearchCriteria.returnDate);
    }

    // And: User selects 2 adults and 1 child
    logger.info('STEP: User selects passengers');
    await homePage.selectPassengers(
      testData.flightSearchCriteria.adults,
      testData.flightSearchCriteria.children
    );

    // And: User selects economy class
    logger.info('STEP: User selects cabin class');
    await homePage.selectCabinClass(testData.flightSearchCriteria.cabinClass);

    // And: User clicks on search
    logger.info('STEP: User clicks search');
    await homePage.clickSearch();

    // Then: User should see flight results
    logger.info('THEN: Verify flight results are displayed');
    const flightsAvailable = await bookingPage.areFlightsAvailable();
    expect(flightsAvailable).toBeTruthy();

    const flightCount = await bookingPage.getFlightCount();
    logger.info(`Flight count: ${flightCount}`, { count: flightCount });
    expect(flightCount).toBeGreaterThan(0);

    // When: User selects first available flight
    logger.info('STEP: User selects first available flight');
    await bookingPage.selectFirstFlight();

    // And: User selects regular fare
    logger.info('STEP: User selects regular fare');
    await bookingPage.selectFareType('Regular');

    // Verify fare details are displayed
    const fareDetails = await bookingPage.getFareDetails();
    logger.info('Fare details retrieved', { fareDetails });

    // And: User enters traveller details
    logger.info('STEP: User enters traveller details');
    await bookingPage.enterMultipleTravellerDetails(testData.passengers);

    // Verify details were entered correctly
    const enteredDetails = await bookingPage.getTravellerDetails(0);
    expect(enteredDetails?.name).toBe(testData.passengers[0].name);
    expect(enteredDetails?.email).toBe(testData.passengers[0].email);

    // And: User selects seat (if available)
    logger.info('STEP: User selects seat if available');
    const seatSelected = await bookingPage.selectSeat();
    logger.info('Seat selection', { seatSelected });

    // Then: User should be able to proceed to payment
    logger.info('THEN: Verify booking summary and proceed to payment');
    const isSummaryVisible = await bookingPage.isBookingSummaryVisible();
    expect(isSummaryVisible).toBeTruthy();

    const summary = await bookingPage.getBookingSummary();
    expect(summary).toBeTruthy();
    logger.info('Booking summary verified successfully');

    // Final verification
    logger.info('TEST PASSED: Complete booking flow successful');
  });

  test('Scenario: Book one-way flight from Bangalore to Goa', async ({ page }) => {
    // Test for one-way trip
    const oneWayTestData = TestDataBuilder.oneWayBangalore();

    // Given: User is on MakeMyTrip homepage
    logger.info('STEP: User is on MakeMyTrip homepage');
    await homePage.navigate();
    await homePage.handlePopup();

    // When: User selects one-way option
    logger.info('STEP: User selects one-way option');
    await homePage.selectTripType('OneWay');

    // And: User selects from and to cities
    logger.info('STEP: User selects Bangalore to Goa');
    await homePage.selectFromCity(oneWayTestData.flightSearchCriteria.fromCity);
    await homePage.selectToCity(oneWayTestData.flightSearchCriteria.toCity);

    // And: User selects departure date
    logger.info('STEP: User selects departure date');
    await homePage.selectDepartureDate(oneWayTestData.flightSearchCriteria.departureDate);

    // And: User selects passengers
    logger.info('STEP: User selects 1 adult');
    await homePage.selectPassengers(oneWayTestData.flightSearchCriteria.adults);

    // And: User clicks search
    logger.info('STEP: User searches for flights');
    await homePage.clickSearch();

    // Then: Flight results should be displayed
    logger.info('THEN: Verify flight results');
    const flightsAvailable = await bookingPage.areFlightsAvailable();
    expect(flightsAvailable).toBeTruthy();

    logger.info('TEST PASSED: One-way booking flow successful');
  });

  test('Scenario: Verify passenger details capture', async ({ page }) => {
    // Test for accurate passenger data capture
    const customTestData = new TestDataBuilder()
      .withSearchCriteria({
        fromCity: 'Delhi',
        toCity: 'Mumbai',
        tripType: 'OneWay',
        adults: 1,
      })
      .withPassenger({
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@corporate.com',
        phone: '9876543210',
        gender: 'Male',
      })
      .build();

    logger.info('STEP: Setup complete with custom test data');
    await homePage.navigate();
    await homePage.handlePopup();

    logger.info('STEP: Execute search');
    await homePage.selectTripType('OneWay');
    await homePage.selectFromCity(customTestData.flightSearchCriteria.fromCity);
    await homePage.selectToCity(customTestData.flightSearchCriteria.toCity);
    await homePage.selectDepartureDate(customTestData.flightSearchCriteria.departureDate);
    await homePage.selectPassengers(1);
    await homePage.clickSearch();

    // Verify flight results
    expect(await bookingPage.areFlightsAvailable()).toBeTruthy();

    logger.info('STEP: Select flight and enter passenger details');
    await bookingPage.selectFirstFlight();
    await bookingPage.selectFareType('Regular');
    await bookingPage.enterTravellerDetails(customTestData.passengers[0]);

    // Verify passenger details were saved correctly
    logger.info('THEN: Verify passenger details accuracy');
    const savedDetails = await bookingPage.getTravellerDetails();
    expect(savedDetails?.name).toBe('Rajesh Kumar');
    expect(savedDetails?.email).toBe('rajesh.kumar@corporate.com');
    expect(savedDetails?.phone).toBe('9876543210');

    logger.info('TEST PASSED: Passenger details captured accurately');
  });
});