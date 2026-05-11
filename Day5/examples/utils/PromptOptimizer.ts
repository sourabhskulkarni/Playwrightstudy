// PromptOptimizer.ts
// Utility for optimizing prompts to balance quality and cost

import { TokenManager } from './TokenManager';
import { GenAITestFramework } from '../frameworks/GenAITestFramework';

export interface PromptOptimizationResult {
  strategy: string;
  prompt: string;
  qualityScore: number;
  tokenCount: number;
  cost: number;
  efficiencyScore: number; // quality per dollar
}

export class PromptOptimizer {
  private framework: GenAITestFramework;

  constructor(framework: GenAITestFramework) {
    this.framework = framework;
  }

  async compareStrategies(baseTask: string): Promise<PromptOptimizationResult[]> {
    const strategies = [
      { name: 'Simple', prompt: baseTask },
      { name: 'Detailed Context', prompt: `You are an expert. Context: Provide a complete and accurate response. Task: ${baseTask}` },
      { name: 'Few-Shot', prompt: `Example 1: Task A -> Response A. Example 2: Task B -> Response B. Now, Task: ${baseTask}` },
      { name: 'Chain-of-Thought', prompt: `Think step-by-step to arrive at the final answer for this task: ${baseTask}` }
    ];

    const results: PromptOptimizationResult[] = [];

    for (const strategy of strategies) {
      const result = await this.framework.testAIResponse(strategy.prompt, {
        expectedQuality: 0.7,
        checkHallucinations: false
      });

      const efficiencyScore = result.quality.overallScore / Math.max(result.costUSD, 0.0001);

      results.push({
        strategy: strategy.name,
        prompt: strategy.prompt,
        qualityScore: result.quality.overallScore,
        tokenCount: result.tokensUsed,
        cost: result.costUSD,
        efficiencyScore
      });
    }

    // Sort by efficiency score descending
    return results.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  }

  getBestStrategy(results: PromptOptimizationResult[]): PromptOptimizationResult {
    if (results.length === 0) throw new Error("No results to evaluate");
    return results[0]; // Since they are sorted by efficiency
  }
}
