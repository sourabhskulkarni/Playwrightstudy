Feature: Performance Testing for Travel Portal
  As a Performance Engineer
  I want to measure page loads and resource loads
  So that I can ensure the web app meets performance thresholds

  Scenario: Measure page load performance
    Given the performance testing environment is ready
    When I navigate to the MakeMyTrip homepage
    Then the DOM content should load in less than 3000ms
    And the page should be fully loaded in less than 10000ms

  Scenario: Resource loading performance
    Given the performance testing environment is ready
    When I record resource loads on the MakeMyTrip homepage
    Then the number of loaded images should be less than 50
    And the number of loaded JS files should be less than 20
    And the number of loaded CSS files should be less than 10

  Scenario: Core Web Vitals approximation
    Given the performance testing environment is ready
    When I measure the Largest Contentful Paint (LCP)
    Then the LCP should be less than 2500ms
