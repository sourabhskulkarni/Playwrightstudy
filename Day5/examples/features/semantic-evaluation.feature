@day5 @semantic-evaluation
Feature: Semantic Evaluation
  As a Gen AI Tester
  I want to evaluate AI responses using semantic analysis
  So that I can measure meaning-level quality beyond simple word matching

  Scenario: High semantic similarity for paraphrased content
    Given the Semantic Evaluator is initialized
    When I semantically evaluate candidate "Playwright is an open-source tool for browser automation and testing" against reference "Playwright is a free tool used for automating browser tests"
    Then the cosine similarity should be greater than 0.3
    And the overall semantic score should be greater than 0.3

  Scenario: Topic coverage analysis
    Given the Semantic Evaluator is initialized
    When I semantically evaluate candidate "Playwright supports Chromium and Firefox for cross-browser testing" against reference "Playwright enables cross-browser testing across Chromium Firefox and WebKit"
    Then the topic coverage should be greater than 0.4

  Scenario: Context alignment with prompt
    Given the Semantic Evaluator is initialized
    When I evaluate context alignment of response "Playwright supports Chromium Firefox and WebKit browsers" with prompt "Which browsers does Playwright support?"
    Then the context alignment score should be greater than 0.3
