Feature: Home Page Test for MakeMyTrip

# Background runs before each scenario in this feature file
# It is the common setup for all scenarios, ensuring the user starts from the homepage
Background:
    Given user is on MakeMyTrip homepage

Scenario: Verify MakeMyTrip homepage
    Then user should be able to see login pop-up
    When user close the pop-up
    Then user should see the Login or Create Account button
   