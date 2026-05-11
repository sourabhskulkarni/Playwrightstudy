import { test, expect } from '@playwright/test';
import { PromptOptimizer } from './utils/PromptOptimizer';
import { GenAITestFramework } from './frameworks/GenAITestFramework';

test.describe('Prompt Engineering & Optimization Testing', () => {
  let optimizer: PromptOptimizer;
  let framework: GenAITestFramework;

  test.beforeAll(() => {
    framework = new GenAITestFramework({
      apiClient: {},
      config: {
        qualityThreshold: 0.85,
        hallucinnationThreshold: 0,
        costPerToken: 0.00003
      }
    });
    optimizer = new PromptOptimizer(framework);
  });

  test('Test prompt strategy comparisons', async () => {
    const baseTask = 'Explain quantum computing to a 5-year-old.';
    
    const results = await optimizer.compareStrategies(baseTask);
    
    expect(results.length).toBe(4);
    
    // Results should be sorted by efficiency score descending
    expect(results[0].efficiencyScore).toBeGreaterThanOrEqual(results[1].efficiencyScore);
    expect(results[1].efficiencyScore).toBeGreaterThanOrEqual(results[2].efficiencyScore);
    
    const bestStrategy = optimizer.getBestStrategy(results);
    expect(bestStrategy).toBeDefined();
    expect(bestStrategy.qualityScore).toBeGreaterThan(0);
    
    console.log(`Best strategy found: ${bestStrategy.strategy} with efficiency ${bestStrategy.efficiencyScore}`);
  });
});
