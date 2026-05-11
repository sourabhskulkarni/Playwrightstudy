Feature: Retrieval-Augmented Generation (RAG) Testing
  As a Gen AI Tester
  I want to test RAG pipelines
  So that I can verify documents are retrieved and contextually applied

  Scenario: Successful document retrieval and generation
    Given the RAG framework is initialized
    When I perform a RAG test for "Which browsers does Playwright support?" expecting document "browser-support.pdf"
    Then the retrieval score should be at least 0.8
    And the generation relevance score should be at least 0.8
    And the RAG pipeline test should pass

  Scenario: Unsuccessful retrieval when document is missing
    Given the RAG framework is initialized
    When I perform a RAG test for "How to cook spaghetti?" expecting document "cookbook.pdf"
    Then the retrieval score should be below 0.8
    And the RAG pipeline test should fail
