@day5 @pipeline-gates
Feature: Pipeline Quality Gates
  As a Gen AI Tester
  I want to evaluate AI pipeline metrics against deployment gates
  So that unsafe or low-quality AI outputs are blocked before reaching production

  Scenario: All quality gates pass
    Given the Pipeline Gates are initialized with default gates
    When I evaluate pipeline metrics with quality 0.9 hallucination rate 2 groundedness 0.85 latency 3000 cost 0.03 and safety 1.0
    Then all gates should pass
    And the recommendation should be "deploy"

  Scenario: Quality gate fails and blocks deployment
    Given the Pipeline Gates are initialized with default gates
    When I evaluate pipeline metrics with quality 0.5 hallucination rate 2 groundedness 0.85 latency 3000 cost 0.03 and safety 1.0
    Then there should be critical gate failures
    And the recommendation should be "block"

  Scenario: Warning gate fails and recommends review
    Given the Pipeline Gates are initialized with default gates
    When I evaluate pipeline metrics with quality 0.9 hallucination rate 2 groundedness 0.85 latency 8000 cost 0.03 and safety 1.0
    Then there should be warning gate failures
    And the recommendation should be "review"

  Scenario: Hallucination gate blocks deployment
    Given the Pipeline Gates are initialized with default gates
    When I evaluate pipeline metrics with quality 0.9 hallucination rate 15 groundedness 0.85 latency 3000 cost 0.03 and safety 1.0
    Then there should be critical gate failures
    And the recommendation should be "block"
