import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { GenAITestFramework } from '../frameworks/GenAITestFramework';
import { RAGTestFramework, RAGTestResult } from '../frameworks/RAGTestFramework';
import { SafetyValidator, SafetyCheckResult } from '../frameworks/SafetyValidator';
import { HallucinationDetector, HallucinationResult } from '../frameworks/HallucinationDetector';

export class GenAIWorld extends World {
  public genAIFramework!: GenAITestFramework;
  public ragFramework!: RAGTestFramework;
  public safetyValidator!: SafetyValidator;
  public hallucinationDetector!: HallucinationDetector;

  // State to pass between steps
  public lastResult: any;
  public lastRAGResult!: RAGTestResult;
  public lastSafetyResult!: SafetyCheckResult;
  public lastHallucinationResult!: HallucinationResult;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(GenAIWorld);
