@day5 @lexical-metrics
Feature: Lexical Metrics Evaluation
  As a Gen AI Tester
  I want to evaluate AI responses using lexical metrics
  So that I can measure text-level quality with BLEU, ROUGE-L, and similarity scores

  Scenario: BLEU score evaluation against reference
    Given the Lexical Metrics evaluator is initialized
    When I evaluate candidate "Playwright supports Chromium Firefox and WebKit browsers" against reference "Playwright supports multiple browsers including Chromium Firefox and WebKit"
    Then the BLEU score should be greater than 0.5
    And the overall lexical score should be greater than 0.4

  Scenario: ROUGE-L score for longest common subsequence
    Given the Lexical Metrics evaluator is initialized
    When I evaluate candidate "automated testing saves time and reduces bugs" against reference "automated testing helps save time and significantly reduces software bugs"
    Then the ROUGE-L score should be greater than 0.5

  Scenario: Keyword overlap analysis
    Given the Lexical Metrics evaluator is initialized
    When I evaluate candidate "Playwright is a testing framework" against reference "Playwright is an automation testing framework for browsers"
    Then the keyword overlap score should be greater than 0.3

  Scenario: Low similarity detected for unrelated texts
    Given the Lexical Metrics evaluator is initialized
    When I evaluate candidate "The weather is sunny today" against reference "Playwright supports multiple browsers"
    Then the overall lexical score should be less than 0.3
