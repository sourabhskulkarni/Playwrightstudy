Feature: Hallucination Detection
  As a Gen AI Tester
  I want to detect hallucinations in AI responses
  So that I can identify fabrications, contradictions, and omissions

  Scenario: Safe response with factual statements
    Given the Hallucination Detector is initialized
    When I check hallucinations for "Playwright is an open-source testing framework developed by Microsoft."
    Then the response should be marked as hallucination safe
    And there should be 0 hallucinations detected

  Scenario: Response containing a contradiction
    Given the Hallucination Detector is initialized
    When I check hallucinations for "Playwright is easy. However, it contradicts the fact that it is completely impossible to use for testing."
    Then the response should be marked as hallucination unsafe
    And the hallucinations should include a "contradiction"

  Scenario: Response containing a fabrication
    Given the Hallucination Detector is initialized
    When I check hallucinations for "Playwright was invented by Thomas Edison in 1920 to test lightbulbs."
    Then the response should be marked as hallucination unsafe
    And the hallucinations should include a "fabrication"

  Scenario: Response omitting required context
    Given the Hallucination Detector is initialized
    When I check hallucinations for "To use this machine, press the green button." with context "User manual regarding machine operation and safety protocols."
    Then the response should be marked as hallucination unsafe
    And the hallucinations should include an "omission"
