import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { GenAIWorld } from '../support/world';

// =============================================
// LEXICAL METRICS STEPS
// =============================================
Given('the Lexical Metrics evaluator is initialized', function (this: GenAIWorld) {
  expect(this.lexicalMetrics).toBeDefined();
});

When('I evaluate candidate {string} against reference {string}', function (this: GenAIWorld, candidate: string, reference: string) {
  this.lastLexicalResult = this.lexicalMetrics.evaluate(candidate, reference);
});

Then('the BLEU score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastLexicalResult.bleuScore).toBeGreaterThan(expected);
});

Then('the ROUGE-L score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastLexicalResult.rougeLScore).toBeGreaterThan(expected);
});

Then('the keyword overlap score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastLexicalResult.keywordOverlap).toBeGreaterThan(expected);
});

Then('the overall lexical score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastLexicalResult.overallLexicalScore).toBeGreaterThan(expected);
});

Then('the overall lexical score should be less than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastLexicalResult.overallLexicalScore).toBeLessThan(expected);
});

// =============================================
// SEMANTIC EVALUATOR STEPS
// =============================================
Given('the Semantic Evaluator is initialized', function (this: GenAIWorld) {
  expect(this.semanticEvaluator).toBeDefined();
});

When('I semantically evaluate candidate {string} against reference {string}', function (this: GenAIWorld, candidate: string, reference: string) {
  this.lastSemanticResult = this.semanticEvaluator.evaluate(candidate, reference);
});

When('I evaluate context alignment of response {string} with prompt {string}', function (this: GenAIWorld, response: string, prompt: string) {
  this.lastSemanticResult = this.semanticEvaluator.evaluate(response, response, prompt);
});

Then('the cosine similarity should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastSemanticResult.cosineSimilarity).toBeGreaterThan(expected);
});

Then('the topic coverage should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastSemanticResult.topicCoverage).toBeGreaterThan(expected);
});

Then('the context alignment score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastSemanticResult.contextAlignment).toBeGreaterThan(expected);
});

Then('the overall semantic score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastSemanticResult.overallSemanticScore).toBeGreaterThan(expected);
});

// =============================================
// GROUNDEDNESS SCORER STEPS
// =============================================
Given('the Groundedness Scorer is initialized with threshold {float}', function (this: GenAIWorld, threshold: number) {
  // Re-initialize with custom threshold
  const { GroundednessScorer } = require('../frameworks/GroundednessScorer');
  this.groundednessScorer = new GroundednessScorer(threshold);
});

When('I score groundedness of response {string} against sources:', async function (this: GenAIWorld, response: string, dataTable: DataTable) {
  const sources = dataTable.raw().map(row => row[0]);
  this.lastGroundednessResult = await this.groundednessScorer.scoreGroundedness(response, sources);
});

Then('the groundedness score should be greater than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastGroundednessResult.overallScore).toBeGreaterThan(expected);
});

Then('the groundedness score should be less than {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastGroundednessResult.overallScore).toBeLessThan(expected);
});

Then('the groundedness check should pass', function (this: GenAIWorld) {
  expect(this.lastGroundednessResult.passed).toBeTruthy();
});

Then('there should be ungrounded claims detected', function (this: GenAIWorld) {
  expect(this.lastGroundednessResult.ungroundedClaims.length).toBeGreaterThan(0);
});

// =============================================
// PIPELINE GATES STEPS
// =============================================
Given('the Pipeline Gates are initialized with default gates', function (this: GenAIWorld) {
  expect(this.pipelineGates).toBeDefined();
});

When('I evaluate pipeline metrics with quality {float} hallucination rate {int} groundedness {float} latency {int} cost {float} and safety {float}',
  function (this: GenAIWorld, quality: number, hallRate: number, ground: number, latency: number, cost: number, safety: number) {
    this.lastGateReport = this.pipelineGates.evaluate({
      qualityScore: quality,
      hallucinationRate: hallRate,
      groundednessScore: ground,
      latencyP95Ms: latency,
      costPerRequest: cost,
      safetyScore: safety
    });
  });

Then('all gates should pass', function (this: GenAIWorld) {
  expect(this.lastGateReport.allGatesPassed).toBeTruthy();
});

Then('there should be critical gate failures', function (this: GenAIWorld) {
  expect(this.lastGateReport.criticalFailures).toBeGreaterThan(0);
});

Then('there should be warning gate failures', function (this: GenAIWorld) {
  expect(this.lastGateReport.warnings).toBeGreaterThan(0);
});

Then('the recommendation should be {string}', function (this: GenAIWorld, expected: string) {
  expect(this.lastGateReport.recommendation).toBe(expected);
});

// =============================================
// PROMPT A/B HARNESS STEPS
// =============================================
Given('the Prompt A\\/B Harness is initialized', function (this: GenAIWorld) {
  expect(this.promptABHarness).toBeDefined();
});

When('I run an A\\/B test comparing prompt A {string} and prompt B {string} over {int} iterations',
  async function (this: GenAIWorld, promptA: string, promptB: string, iterations: number) {
    this.lastABResult = await this.promptABHarness.runABTest({
      promptA, promptB, nameA: 'Variant A', nameB: 'Variant B',
      iterations, qualityThreshold: 0.7
    });
  });

Then('a winner should be declared', function (this: GenAIWorld) {
  expect(this.lastABResult.winner).toBeDefined();
  expect(this.lastABResult.winner.length).toBeGreaterThan(0);
});

Then('both variants should have mean scores greater than {int}', function (this: GenAIWorld, expected: number) {
  expect(this.lastABResult.variantA.meanScore).toBeGreaterThan(expected);
  expect(this.lastABResult.variantB.meanScore).toBeGreaterThan(expected);
});

Then('both variants should have similar scores', function (this: GenAIWorld) {
  expect(this.lastABResult.scoreDifference).toBeLessThan(0.15);
});

// =============================================
// SYNTHETIC DATA GENERATOR STEPS
// =============================================
Given('the Synthetic Data Generator is initialized', function (this: GenAIWorld) {
  expect(this.syntheticDataGenerator).toBeDefined();
});

When('I generate {int} test prompts for the {string} domain', function (this: GenAIWorld, count: number, domain: string) {
  this.lastSyntheticPrompts = this.syntheticDataGenerator.generateTestPrompts(domain, count);
});

When('I generate edge case prompts', function (this: GenAIWorld) {
  this.lastSyntheticPrompts = this.syntheticDataGenerator.generateEdgeCases();
});

When('I generate adversarial prompts', function (this: GenAIWorld) {
  this.lastSyntheticPrompts = this.syntheticDataGenerator.generateAdversarialPrompts();
});

When('I generate {int} multi-turn conversations', function (this: GenAIWorld, count: number) {
  this.lastSyntheticConversations = this.syntheticDataGenerator.generateMultiTurnConversations(count);
});

Then('I should receive {int} synthetic prompts', function (this: GenAIWorld, expected: number) {
  expect(this.lastSyntheticPrompts.length).toBe(expected);
});

Then('each prompt should have a category and difficulty level', function (this: GenAIWorld) {
  for (const prompt of this.lastSyntheticPrompts) {
    expect(prompt.category).toBeDefined();
    expect(prompt.difficulty).toBeDefined();
  }
});

Then('I should receive edge cases including {string} and {string} and {string}',
  function (this: GenAIWorld, cat1: string, cat2: string, cat3: string) {
    const categories = this.lastSyntheticPrompts.map(p => p.category);
    expect(categories).toContain(cat1);
    expect(categories).toContain(cat2);
    expect(categories).toContain(cat3);
  });

Then('I should receive adversarial cases including {string} and {string}',
  function (this: GenAIWorld, cat1: string, cat2: string) {
    const categories = this.lastSyntheticPrompts.map(p => p.category);
    expect(categories).toContain(cat1);
    expect(categories).toContain(cat2);
  });

Then('I should receive {int} conversations', function (this: GenAIWorld, expected: number) {
  expect(this.lastSyntheticConversations.length).toBe(expected);
});

Then('each conversation should have multiple turns and a test objective', function (this: GenAIWorld) {
  for (const conv of this.lastSyntheticConversations) {
    expect(conv.turns.length).toBeGreaterThan(1);
    expect(conv.testObjective).toBeDefined();
    expect(conv.testObjective.length).toBeGreaterThan(0);
  }
});

// =============================================
// ADVERSARIAL TESTER STEPS
// =============================================
Given('the Adversarial Tester is initialized', function (this: GenAIWorld) {
  expect(this.adversarialTester).toBeDefined();
});

When('I test the attack {string} of category {string} with response {string}',
  function (this: GenAIWorld, attack: string, category: string, response: string) {
    this.lastAdversarialResult = this.adversarialTester.testAttack(attack, category as any, response);
  });

Then('the attack should be blocked', function (this: GenAIWorld) {
  expect(this.lastAdversarialResult.blocked).toBeTruthy();
});

Then('no sensitive information should be leaked', function (this: GenAIWorld) {
  expect(this.lastAdversarialResult.responseContainsSensitiveInfo).toBeFalsy();
});

// =============================================
// PROMPT OPTIMIZATION STEPS (from Phase 2 migration)
// =============================================
Given('the Prompt Optimizer is initialized', function (this: GenAIWorld) {
  expect(this.promptOptimizer).toBeDefined();
});

When('I compare strategies for the task {string}', async function (this: GenAIWorld, task: string) {
  this.lastOptimizationResults = await this.promptOptimizer.compareStrategies(task);
});

Then('there should be {int} strategy results', function (this: GenAIWorld, expected: number) {
  expect(this.lastOptimizationResults.length).toBe(expected);
});

Then('the results should be sorted by efficiency score descending', function (this: GenAIWorld) {
  for (let i = 0; i < this.lastOptimizationResults.length - 1; i++) {
    expect(this.lastOptimizationResults[i].efficiencyScore)
      .toBeGreaterThanOrEqual(this.lastOptimizationResults[i + 1].efficiencyScore);
  }
});

Then('the best strategy should have a quality score greater than {int}', function (this: GenAIWorld, expected: number) {
  const best = this.promptOptimizer.getBestStrategy(this.lastOptimizationResults);
  expect(best.qualityScore).toBeGreaterThan(expected);
});

Then('the best strategy should be identified', function (this: GenAIWorld) {
  const best = this.promptOptimizer.getBestStrategy(this.lastOptimizationResults);
  expect(best).toBeDefined();
  expect(best.strategy).toBeDefined();
});

Then('the best strategy efficiency score should be greater than {int}', function (this: GenAIWorld, expected: number) {
  const best = this.promptOptimizer.getBestStrategy(this.lastOptimizationResults);
  expect(best.efficiencyScore).toBeGreaterThan(expected);
});

// =============================================
// TOKEN & COST MANAGEMENT STEPS (from Phase 2 migration)
// =============================================
Given('a Token Manager with a limit of {int} tokens', function (this: GenAIWorld, limit: number) {
  // Re-initialize with the specified limit from feature file
  const { TokenManager } = require('../utils/TokenManager');
  this.tokenManager = new TokenManager(limit);
  expect(this.tokenManager).toBeDefined();
});

Given('a Cost Calculator with a budget of {float} dollars', function (this: GenAIWorld, budget: number) {
  // Re-initialize with the specified budget from feature file
  const { CostCalculator } = require('../utils/CostCalculator');
  this.costCalculator = new CostCalculator(budget, 0.00001, 0.00003);
  expect(this.costCalculator).toBeDefined();
});

When('I estimate tokens for {string}', function (this: GenAIWorld, text: string) {
  const { TokenManager } = require('../utils/TokenManager');
  this.lastTokenEstimate = TokenManager.estimateTokens(text);
});

Then('the estimated token count should be greater than {int}', function (this: GenAIWorld, expected: number) {
  expect(this.lastTokenEstimate).toBeGreaterThan(expected);
});

When('I track {int} prompt tokens and {int} completion tokens', function (this: GenAIWorld, prompt: number, completion: number) {
  this.tokenManager.trackTokens(prompt, completion);
});

Then('the total tokens used should be {int}', function (this: GenAIWorld, expected: number) {
  expect(this.tokenManager.getUsageStats().totalTokens).toBe(expected);
});

Then('the remaining tokens should be {int}', function (this: GenAIWorld, expected: number) {
  expect(this.tokenManager.getUsageStats().remainingTokens).toBe(expected);
});

When('I add a cost for {int} input tokens and {int} output tokens', function (this: GenAIWorld, input: number, output: number) {
  this.lastCalculatedCost = this.costCalculator.addCost(input, output);
});

Then('the calculated cost should be approximately {float}', function (this: GenAIWorld, expected: number) {
  expect(this.lastCalculatedCost).toBeCloseTo(expected, 3);
});

Then('the budget remaining should be approximately {float}', function (this: GenAIWorld, expected: number) {
  expect(this.costCalculator.getBudgetStatus().remaining).toBeCloseTo(expected, 2);
});

Then('the total cost should exceed the budget', function (this: GenAIWorld) {
  const status = this.costCalculator.getBudgetStatus();
  expect(status.totalCost).toBeGreaterThan(status.budget);
});

Then('the remaining budget should be {int}', function (this: GenAIWorld, expected: number) {
  expect(this.costCalculator.getBudgetStatus().remaining).toBe(expected);
});
