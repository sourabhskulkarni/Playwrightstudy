import { Before, After } from '@cucumber/cucumber';
import { GenAIWorld } from './world';
import { GenAITestFramework } from '../frameworks/GenAITestFramework';
import { RAGTestFramework } from '../frameworks/RAGTestFramework';
import { SafetyValidator } from '../frameworks/SafetyValidator';
import { HallucinationDetector } from '../frameworks/HallucinationDetector';
import { LexicalMetrics } from '../frameworks/LexicalMetrics';
import { SemanticEvaluator } from '../frameworks/SemanticEvaluator';
import { GroundednessScorer } from '../frameworks/GroundednessScorer';
import { PipelineGates } from '../frameworks/PipelineGates';
import { PromptABHarness } from '../frameworks/PromptABHarness';
import { SyntheticDataGenerator } from '../frameworks/SyntheticDataGenerator';
import { AdversarialTester } from '../frameworks/AdversarialTester';
import { PromptOptimizer } from '../utils/PromptOptimizer';
import { TokenManager } from '../utils/TokenManager';
import { CostCalculator } from '../utils/CostCalculator';

Before(function (this: GenAIWorld) {
  // --- Core Gen AI Frameworks ---
  this.genAIFramework = new GenAITestFramework({
    apiClient: {},
    config: {
      qualityThreshold: 0.85,
      hallucinnationThreshold: 0,
      costPerToken: 0.00003
    }
  });

  this.ragFramework = new RAGTestFramework({
    apiClient: {},
    vectorDbClient: {},
    knowledgeBase: {},
    config: {
      qualityThreshold: 0.85,
      hallucinnationThreshold: 0,
      costPerToken: 0.00003
    }
  });

  this.safetyValidator = new SafetyValidator();
  this.hallucinationDetector = new HallucinationDetector({ isMock: true }, 1);

  // --- New Advanced Frameworks ---
  this.lexicalMetrics = new LexicalMetrics();
  this.semanticEvaluator = new SemanticEvaluator();
  this.groundednessScorer = new GroundednessScorer(0.5);
  this.pipelineGates = new PipelineGates();
  this.syntheticDataGenerator = new SyntheticDataGenerator();
  this.adversarialTester = new AdversarialTester();

  // Prompt A/B Harness with a mock evaluator
  this.promptABHarness = new PromptABHarness(async (prompt: string) => {
    const result = await this.genAIFramework.testAIResponse(prompt, {
      expectedQuality: 0.7,
      checkHallucinations: false
    });
    return {
      score: result.quality.overallScore,
      tokens: result.tokensUsed,
      cost: result.costUSD
    };
  });

  // --- Migrated from spec.ts ---
  this.promptOptimizer = new PromptOptimizer(this.genAIFramework);
  this.tokenManager = new TokenManager(1000);
  this.costCalculator = new CostCalculator(0.5, 0.00001, 0.00003);
});

After(function (this: GenAIWorld) {
  // Clean up - reset stateful utilities
  if (this.tokenManager) this.tokenManager.reset();
  if (this.costCalculator) this.costCalculator.reset();
});
