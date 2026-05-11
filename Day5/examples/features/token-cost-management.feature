@day5 @token-cost
Feature: Token & Cost Management Testing
  As a Gen AI Tester
  I want to track token usage and API costs
  So that I can ensure AI operations stay within budget

  Scenario: Token tracking and estimation
    Given a Token Manager with a limit of 1000 tokens
    When I estimate tokens for "This is a sample prompt to estimate tokens."
    Then the estimated token count should be greater than 0
    When I track 12 prompt tokens and 50 completion tokens
    Then the total tokens used should be 62
    And the remaining tokens should be 938

  Scenario: Cost calculation for API calls
    Given a Cost Calculator with a budget of 0.5 dollars
    When I add a cost for 100 input tokens and 200 output tokens
    Then the calculated cost should be approximately 0.007
    And the budget remaining should be approximately 0.493

  Scenario: Budget exceedance handling
    Given a Cost Calculator with a budget of 0.5 dollars
    When I add a cost for 100000 input tokens and 100000 output tokens
    Then the total cost should exceed the budget
    And the remaining budget should be 0
