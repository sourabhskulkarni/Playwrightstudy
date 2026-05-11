@day5 @synthetic-data
Feature: Synthetic Data Generation
  As a Gen AI Tester
  I want to generate synthetic test data for comprehensive AI testing
  So that I can test edge cases, adversarial inputs, and multi-turn conversations

  Scenario: Generate test prompts for a domain
    Given the Synthetic Data Generator is initialized
    When I generate 5 test prompts for the "testing" domain
    Then I should receive 5 synthetic prompts
    And each prompt should have a category and difficulty level

  Scenario: Generate edge case prompts
    Given the Synthetic Data Generator is initialized
    When I generate edge case prompts
    Then I should receive edge cases including "empty_input" and "sql_injection" and "emoji_only"

  Scenario: Generate adversarial prompts
    Given the Synthetic Data Generator is initialized
    When I generate adversarial prompts
    Then I should receive adversarial cases including "prompt_injection" and "jailbreak"

  Scenario: Generate multi-turn conversations
    Given the Synthetic Data Generator is initialized
    When I generate 2 multi-turn conversations
    Then I should receive 2 conversations
    And each conversation should have multiple turns and a test objective
