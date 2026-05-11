Feature: API Testing for Travel Portal
  As a QA Engineer
  I want to test the travel portal APIs
  So that I can verify search, booking, and authentication functionality

  Scenario: Get flight search results
    Given the API client is initialized
    When I search for flights from "DEL" to "BOM" on "2024-12-01"
    Then the API response status should be 200
    And the response should contain a list of flights

  Scenario: Post booking request
    Given the API client is initialized
    When I submit a booking request for flight "FL123" with passenger "John Doe"
    Then the API response status should be 201

  Scenario: API Authentication
    Given the API client is initialized
    When I login with username "testuser" and password "testpass"
    Then the API response status should be 200
    And the response should contain an authentication token
    When I access the protected profile endpoint with the token
    Then the API response status should be 200
