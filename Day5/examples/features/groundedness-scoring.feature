@day5 @groundedness
Feature: Groundedness Scoring
  As a Gen AI Tester
  I want to verify AI responses are grounded in source documents
  So that I can detect when the AI generates claims not supported by provided context

  Scenario: Fully grounded response passes
    Given the Groundedness Scorer is initialized with threshold 0.3
    When I score groundedness of response "Playwright is an open-source testing framework" against sources:
      | Playwright is an open-source automation library for browser testing and web scraping |
      | Playwright supports multiple browsers including Chromium, Firefox, and WebKit        |
    Then the groundedness score should be greater than 0.3
    And the groundedness check should pass

  Scenario: Ungrounded claim is flagged
    Given the Groundedness Scorer is initialized with threshold 0.5
    When I score groundedness of response "Playwright was created by Google in 2015 and only supports Chrome" against sources:
      | Playwright is an open-source automation library created by Microsoft |
      | Playwright supports Chromium, Firefox, and WebKit browsers          |
    Then there should be ungrounded claims detected

  Scenario: Partial groundedness with mixed claims
    Given the Groundedness Scorer is initialized with threshold 0.3
    When I score groundedness of response "Playwright supports Chromium browsers. It also makes coffee." against sources:
      | Playwright supports multiple browsers including Chromium, Firefox, and WebKit |
    Then the groundedness score should be less than 1.0
