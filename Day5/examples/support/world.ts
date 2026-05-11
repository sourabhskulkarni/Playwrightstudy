import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { GenAITestFramework } from '../frameworks/GenAITestFramework';
import { RAGTestFramework, RAGTestResult } from '../frameworks/RAGTestFramework';
import { SafetyValidator, SafetyCheckResult } from '../frameworks/SafetyValidator';
import { HallucinationDetector, HallucinationResult } from '../frameworks/HallucinationDetector';
import { LexicalMetrics, LexicalEvaluationResult } from '../frameworks/LexicalMetrics';
import { SemanticEvaluator, SemanticEvaluationResult } from '../frameworks/SemanticEvaluator';
import { GroundednessScorer, GroundednessResult } from '../frameworks/GroundednessScorer';
import { PipelineGates, PipelineGateReport } from '../frameworks/PipelineGates';
import { PromptABHarness, ABTestResult } from '../frameworks/PromptABHarness';
import { SyntheticDataGenerator, SyntheticPrompt, SyntheticConversation } from '../frameworks/SyntheticDataGenerator';
import { AdversarialTester, AdversarialTestResult } from '../frameworks/AdversarialTester';
import { PromptOptimizer, PromptOptimizationResult } from '../utils/PromptOptimizer';
import { TokenManager } from '../utils/TokenManager';
import { CostCalculator } from '../utils/CostCalculator';

export class GenAIWorld extends World {
  // --- Existing frameworks ---
  public genAIFramework!: GenAITestFramework;
  public ragFramework!: RAGTestFramework;
  public safetyValidator!: SafetyValidator;
  public hallucinationDetector!: HallucinationDetector;

  // --- New framework instances ---
  public lexicalMetrics!: LexicalMetrics;
  public semanticEvaluator!: SemanticEvaluator;
  public groundednessScorer!: GroundednessScorer;
  public pipelineGates!: PipelineGates;
  public promptABHarness!: PromptABHarness;
  public syntheticDataGenerator!: SyntheticDataGenerator;
  public adversarialTester!: AdversarialTester;

  // --- Migrated from spec.ts ---
  public promptOptimizer!: PromptOptimizer;
  public tokenManager!: TokenManager;
  public costCalculator!: CostCalculator;

  // --- State to pass between steps ---
  public lastResult: any;
  public lastRAGResult!: RAGTestResult;
  public lastSafetyResult!: SafetyCheckResult;
  public lastHallucinationResult!: HallucinationResult;
  public lastLexicalResult!: LexicalEvaluationResult;
  public lastSemanticResult!: SemanticEvaluationResult;
  public lastGroundednessResult!: GroundednessResult;
  public lastGateReport!: PipelineGateReport;
  public lastABResult!: ABTestResult;
  public lastAdversarialResult!: AdversarialTestResult;
  public lastSyntheticPrompts!: SyntheticPrompt[];
  public lastSyntheticConversations!: SyntheticConversation[];
  public lastOptimizationResults!: PromptOptimizationResult[];
  public lastTokenEstimate!: number;
  public lastCalculatedCost!: number;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(GenAIWorld);
