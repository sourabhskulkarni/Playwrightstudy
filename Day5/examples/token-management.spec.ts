import { test, expect } from '@playwright/test';
import { TokenManager } from './utils/TokenManager';
import { CostCalculator } from './utils/CostCalculator';

test.describe('Token & Cost Management Testing', () => {
  let tokenManager: TokenManager;
  let costCalculator: CostCalculator;

  test.beforeEach(() => {
    tokenManager = new TokenManager(1000); // Small limit for testing
    costCalculator = new CostCalculator(0.5, 0.00001, 0.00003); // $0.50 budget
  });

  test('Test token tracking and estimation', () => {
    const sampleText = 'This is a sample prompt to estimate tokens.';
    const estimatedTokens = TokenManager.estimateTokens(sampleText);
    
    expect(estimatedTokens).toBeGreaterThan(0);
    expect(estimatedTokens).toBe(Math.ceil(sampleText.length / 4));
    
    // Track some usage
    tokenManager.trackTokens(estimatedTokens, 50);
    const stats = tokenManager.getUsageStats();
    
    expect(stats.promptTokens).toBe(estimatedTokens);
    expect(stats.completionTokens).toBe(50);
    expect(stats.totalTokens).toBe(estimatedTokens + 50);
    expect(stats.remainingTokens).toBe(1000 - stats.totalTokens);
  });

  test('Test cost calculation', () => {
    // Simulate 100 input tokens and 200 output tokens
    const cost = costCalculator.addCost(100, 200);
    
    // Expected: 100 * 0.00001 + 200 * 0.00003 = 0.001 + 0.006 = 0.007
    expect(cost).toBeCloseTo(0.007);
    
    const status = costCalculator.getBudgetStatus();
    expect(status.totalCost).toBeCloseTo(0.007);
    expect(status.budget).toBe(0.5);
    expect(status.percentageUsed).toBeCloseTo((0.007 / 0.5) * 100);
  });

  test('Test budget exceedance handling', () => {
    // Exceed budget intentionally
    costCalculator.addCost(100000, 100000); // Total cost should be 1 + 3 = 4 dollars
    
    const status = costCalculator.getBudgetStatus();
    expect(status.remaining).toBe(0); // Cannot be negative based on our implementation
    expect(status.totalCost).toBeGreaterThan(status.budget);
  });
});
