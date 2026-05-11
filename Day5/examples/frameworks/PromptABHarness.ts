// PromptABHarness.ts
// Statistical A/B testing harness for comparing prompt variants

export interface ABTestConfig {
  promptA: string;
  promptB: string;
  nameA?: string;
  nameB?: string;
  iterations: number;        // Number of runs per variant
  qualityThreshold: number;  // Minimum acceptable quality
}

export interface VariantResult {
  name: string;
  prompt: string;
  scores: number[];
  meanScore: number;
  stdDev: number;
  minScore: number;
  maxScore: number;
  avgTokens: number;
  avgCostUSD: number;
}

export interface ABTestResult {
  variantA: VariantResult;
  variantB: VariantResult;
  winner: string;             // Name of the winning variant
  scoreDifference: number;    // Absolute difference in mean scores
  isSignificant: boolean;     // Whether the difference is statistically significant
  confidenceLevel: number;    // 0-1 confidence in the result
  recommendation: string;
}

export class PromptABHarness {
  private evaluator: (prompt: string) => Promise<{ score: number; tokens: number; cost: number }>;

  /**
   * @param evaluator - Function that evaluates a prompt and returns score, token count, and cost
   */
  constructor(evaluator: (prompt: string) => Promise<{ score: number; tokens: number; cost: number }>) {
    this.evaluator = evaluator;
  }

  /**
   * Run an A/B test comparing two prompt variants
   */
  async runABTest(config: ABTestConfig): Promise<ABTestResult> {
    const variantA = await this.evaluateVariant(config.nameA || 'Variant A', config.promptA, config.iterations);
    const variantB = await this.evaluateVariant(config.nameB || 'Variant B', config.promptB, config.iterations);

    const scoreDiff = Math.abs(variantA.meanScore - variantB.meanScore);

    // Simple significance test: difference > 2 * pooled std error
    const pooledStdErr = Math.sqrt(
      (variantA.stdDev ** 2 / config.iterations) +
      (variantB.stdDev ** 2 / config.iterations)
    );
    const isSignificant = pooledStdErr > 0 ? (scoreDiff / pooledStdErr) > 1.96 : scoreDiff > 0.05;

    // Confidence level based on t-statistic
    const tStat = pooledStdErr > 0 ? scoreDiff / pooledStdErr : 0;
    const confidenceLevel = Math.min(1, tStat / 3); // Simplified mapping

    const winner = variantA.meanScore >= variantB.meanScore ? variantA.name : variantB.name;
    const loser = winner === variantA.name ? variantB.name : variantA.name;

    const recommendation = isSignificant
      ? `Use "${winner}" — statistically significant improvement of ${(scoreDiff * 100).toFixed(1)}% over "${loser}".`
      : `No significant difference between variants (diff: ${(scoreDiff * 100).toFixed(1)}%). Either prompt is acceptable.`;

    return {
      variantA, variantB, winner, scoreDifference: scoreDiff,
      isSignificant, confidenceLevel, recommendation
    };
  }

  private async evaluateVariant(name: string, prompt: string, iterations: number): Promise<VariantResult> {
    const scores: number[] = [];
    let totalTokens = 0, totalCost = 0;

    for (let i = 0; i < iterations; i++) {
      const result = await this.evaluator(prompt);
      scores.push(result.score);
      totalTokens += result.tokens;
      totalCost += result.cost;
    }

    const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + (s - meanScore) ** 2, 0) / scores.length;

    return {
      name, prompt, scores, meanScore,
      stdDev: Math.sqrt(variance),
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      avgTokens: totalTokens / iterations,
      avgCostUSD: totalCost / iterations
    };
  }
}
