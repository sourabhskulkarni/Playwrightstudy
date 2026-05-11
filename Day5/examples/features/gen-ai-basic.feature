Feature: Basic Generative AI Testing
  As a Gen AI Tester
  I want to test basic responses from the AI
  So that I can ensure it meets the required quality and consistency thresholds

  Scenario: Basic response quality meets threshold
    Given the Generative AI framework is initialized
    When I send the prompt "What is the purpose of automated testing?"
    Then the response should pass the quality evaluation with an expected score of 0.8
    And the cost should be calculated

  Scenario: Response consistency is stable across multiple generations
    Given the Generative AI framework is initialized
    When I test response consistency for the prompt "List 3 benefits of Playwright" over 3 iterations
    Then the response consistency should be greater than 0.6
