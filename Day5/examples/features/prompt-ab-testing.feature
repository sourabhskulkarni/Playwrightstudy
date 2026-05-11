@day5 @prompt-ab
Feature: Prompt A/B Testing
  As a Gen AI Tester
  I want to compare two prompt variants using statistical A/B testing
  So that I can identify the best performing prompt with confidence

  Scenario: A/B test identifies a clear winner
    Given the Prompt A/B Harness is initialized
    When I run an A/B test comparing prompt A "Explain testing" and prompt B "You are an expert. Explain testing in detail with examples" over 5 iterations
    Then a winner should be declared
    And both variants should have mean scores greater than 0

  Scenario: A/B test with identical prompts shows no significant difference
    Given the Prompt A/B Harness is initialized
    When I run an A/B test comparing prompt A "What is Playwright?" and prompt B "What is Playwright?" over 5 iterations
    Then both variants should have similar scores
