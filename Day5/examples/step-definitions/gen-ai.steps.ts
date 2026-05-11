import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { GenAIWorld } from '../support/world';

// --- General Setup ---
Given('the Generative AI framework is initialized', function (this: GenAIWorld) {
  expect(this.genAIFramework).toBeDefined();
});

Given('the RAG framework is initialized', function (this: GenAIWorld) {
  expect(this.ragFramework).toBeDefined();
});

Given('the Safety Validator is initialized', function (this: GenAIWorld) {
  expect(this.safetyValidator).toBeDefined();
});

Given('the Hallucination Detector is initialized', function (this: GenAIWorld) {
  expect(this.hallucinationDetector).toBeDefined();
});

// --- Basic Testing ---
When('I send the prompt {string}', async function (this: GenAIWorld, prompt: string) {
  this.lastResult = await this.genAIFramework.testAIResponse(prompt, {
    expectedQuality: 0.8,
    checkHallucinations: false
  });
});

Then('the response should pass the quality evaluation with an expected score of {float}', function (this: GenAIWorld, expectedScore: number) {
  expect(this.lastResult.passed).toBeTruthy();
  expect(this.lastResult.quality.overallScore).toBeGreaterThanOrEqual(expectedScore);
});

Then('the cost should be calculated', function (this: GenAIWorld) {
  expect(this.lastResult.costUSD).toBeGreaterThan(0);
});

When('I test response consistency for the prompt {string} over {int} iterations', async function (this: GenAIWorld, prompt: string, iterations: number) {
  this.lastResult = await this.genAIFramework.testConsistency(prompt, iterations);
});

Then('the response consistency should be greater than {float}', function (this: GenAIWorld, expectedConsistency: number) {
  expect(this.lastResult.consistency).toBeGreaterThan(expectedConsistency);
});

// --- RAG Testing ---
When('I perform a RAG test for {string} expecting document {string}', async function (this: GenAIWorld, query: string, doc: string) {
  this.lastRAGResult = await this.ragFramework.testRAGPipeline({
    query,
    expectedDocuments: [doc],
    expectedRelevance: 0.85
  });
});

Then('the retrieval score should be at least {float}', function (this: GenAIWorld, expectedScore: number) {
  expect(this.lastRAGResult.retrievalScore).toBeGreaterThanOrEqual(expectedScore);
});

Then('the retrieval score should be below {float}', function (this: GenAIWorld, expectedScore: number) {
  expect(this.lastRAGResult.retrievalScore).toBeLessThan(expectedScore);
});

Then('the generation relevance score should be at least {float}', function (this: GenAIWorld, expectedScore: number) {
  expect(this.lastRAGResult.relevanceScore).toBeGreaterThanOrEqual(expectedScore);
});

Then('the RAG pipeline test should pass', function (this: GenAIWorld) {
  expect(this.lastRAGResult.passed).toBeTruthy();
});

Then('the RAG pipeline test should fail', function (this: GenAIWorld) {
  expect(this.lastRAGResult.passed).toBeFalsy();
});

// --- Safety Testing ---
When('I validate the response {string}', async function (this: GenAIWorld, response: string) {
  this.lastSafetyResult = await this.safetyValidator.validateResponse(response);
});

Then('the response should be marked as safe', function (this: GenAIWorld) {
  expect(this.lastSafetyResult.isSafe).toBeTruthy();
});

Then('the response should be marked as unsafe', function (this: GenAIWorld) {
  expect(this.lastSafetyResult.isSafe).toBeFalsy();
});

Then('there should be {int} safety violations', function (this: GenAIWorld, expectedCount: number) {
  expect(this.lastSafetyResult.violations.length).toBe(expectedCount);
});

Then('the violations should include {string}', function (this: GenAIWorld, violationCategory: string) {
  expect(this.lastSafetyResult.violations.some(v => v.category === violationCategory)).toBeTruthy();
});

// --- Hallucination Detection ---
When('I check hallucinations for {string}', async function (this: GenAIWorld, response: string) {
  this.lastHallucinationResult = await this.hallucinationDetector.detectHallucinations(response);
});

When('I check hallucinations for {string} with context {string}', async function (this: GenAIWorld, response: string, context: string) {
  this.lastHallucinationResult = await this.hallucinationDetector.detectHallucinations(response, context);
});

Then('the response should be marked as hallucination safe', function (this: GenAIWorld) {
  expect(this.lastHallucinationResult.safe).toBeTruthy();
});

Then('the response should be marked as hallucination unsafe', function (this: GenAIWorld) {
  expect(this.lastHallucinationResult.safe).toBeFalsy();
});

Then('there should be {int} hallucinations detected', function (this: GenAIWorld, expectedCount: number) {
  expect(this.lastHallucinationResult.hallucinations.length).toBe(expectedCount);
});

Then('the hallucinations should include a {string}', function (this: GenAIWorld, type: string) {
  expect(this.lastHallucinationResult.hallucinations.some(h => h.type === type)).toBeTruthy();
});

Then('the hallucinations should include an {string}', function (this: GenAIWorld, type: string) {
  expect(this.lastHallucinationResult.hallucinations.some(h => h.type === type)).toBeTruthy();
});
