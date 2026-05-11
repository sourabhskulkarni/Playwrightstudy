@day5 @prompt-optimization
Feature: Prompt Engineering & Optimization Testing
  As a Gen AI Tester
  I want to compare different prompt strategies
  So that I can identify the most cost-efficient approach for quality responses

  Scenario: Compare prompt strategies for effectiveness
    Given the Prompt Optimizer is initialized
    When I compare strategies for the task "Explain quantum computing to a 5-year-old."
    Then there should be 4 strategy results
    And the results should be sorted by efficiency score descending
    And the best strategy should have a quality score greater than 0

  Scenario: Identify the most cost-efficient prompt strategy
    Given the Prompt Optimizer is initialized
    When I compare strategies for the task "Summarize the benefits of test automation."
    Then the best strategy should be identified
    And the best strategy efficiency score should be greater than 0
