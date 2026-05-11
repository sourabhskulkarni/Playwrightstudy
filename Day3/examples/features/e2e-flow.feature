Feature: Complete E2E Flow with DB and API Validation
  As an automation engineer
  I want to test the entire booking flow across UI, API, and DB
  So that I ensure data consistency and full system integration

  Scenario: Complete booking flow with UI, API, and DB validation
    Given the E2E test environment is ready
    When I perform a UI flight search and select a flight
    And I enter traveller details for "John Doe" and proceed to payment
    Then the user and booking should be inserted into the database
    And the booking should be created successfully via API
    And the database should reflect the pending booking status
    When I retrieve the booking details via API
    Then the API booking status should be "confirmed"
    And the database status should be updated to "confirmed"
    And the UI should display a confirmed booking summary

  Scenario: API-only booking flow
    Given the API client is authenticated with "testuser" and "testpass"
    When I search flights from "DEL" to "BOM" via API
    Then the API should return a list of available flights
    When I create a booking for the first flight via API
    Then the API booking response should be successful
    And my user profile should contain the new booking
