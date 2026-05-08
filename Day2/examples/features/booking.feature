Feature: Flight Booking on MakeMyTrip

  Scenario: Book a round trip flight
    Given user is on MakeMyTrip homepage
    When user selects round trip option
    And user selects from city "Delhi" and to city "Mumbai"
    And user selects departure and return dates
    And user selects 2 adults and 1 child
    And user selects economy class
    And user clicks on search
    Then user should see flight results
    When user selects first available flight
    And user selects regular fare
    And user enters traveller details
    Then user should be able to proceed to payment