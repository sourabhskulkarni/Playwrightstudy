import { Before, After } from '@cucumber/cucumber';
import { GenAIWorld } from './world';
import { GenAITestFramework } from '../frameworks/GenAITestFramework';
import { RAGTestFramework } from '../frameworks/RAGTestFramework';
import { SafetyValidator } from '../frameworks/SafetyValidator';
import { HallucinationDetector } from '../frameworks/HallucinationDetector';

Before(function (this: GenAIWorld) {
  // Initialize standard framework
  this.genAIFramework = new GenAITestFramework({
    apiClient: {},
    config: {
      qualityThreshold: 0.85,
      hallucinnationThreshold: 0,
      costPerToken: 0.00003
    }
  });

  // Initialize RAG framework
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

  // Initialize Safety Validator
  this.safetyValidator = new SafetyValidator();

  // Initialize Hallucination Detector with mock mode
  this.hallucinationDetector = new HallucinationDetector({ isMock: true }, 1);
});

After(function (this: GenAIWorld) {
  // Clean up if needed
});
