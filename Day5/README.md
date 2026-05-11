# Day 5: Generative AI Application Testing — Complete Implementation Guide

**Created by:** Sourabh Kulkarni - SDET Architect  
**Version:** 2.0 - Comprehensive Gen AI Testing Suite  
**Focus:** Practical Gen AI & LLM Testing with Playwright + Cucumber BDD  
**Duration:** 6-8 hours training + hands-on implementation  

---

## 🎯 What You'll Learn Today

By the end of Day 5, you'll be a **Gen AI Tester** — capable of testing any Generative AI application with:

✅ **Core Skills:**
- Design Gen AI test frameworks
- Test RAG-based applications
- Detect & prevent hallucinations
- Optimize prompts for quality & cost
- Validate safety & compliance
- Monitor AI performance

✅ **Advanced AI Testing Concepts:**
- Lexical Metrics (BLEU, ROUGE-L, Levenshtein)
- Semantic Evaluators (TF-IDF cosine similarity, topic coverage)
- LLM Groundedness Scoring (claim verification against sources)
- LLM Client Interface (typed, swappable API abstraction)
- RAG Pipeline Evaluation (retrieval + generation metrics)
- Pipeline Quality Gates (deploy/review/block decisions)
- Prompt A/B Testing Harness (statistical significance testing)
- Synthetic Data Generation (edge cases, adversarial, multi-turn)
- Adversarial Testing (prompt injection, jailbreak, data exfiltration)

✅ **All tests in Cucumber BDD format** — no legacy spec.ts files

---

## 📚 Learning Path

### Part 1: Foundations (90 min)
1. Gen AI testing vs traditional testing
2. Core concepts (LLM, RAG, tokens, prompts)
3. Testing challenges & solutions
4. Framework design

**Read:** [DAY6_DETAILED_GUIDE.md](DAY6_DETAILED_GUIDE.md) - Parts 1-2

### Part 2: RAG & Retrieval Systems (90 min)
1. RAG architecture understanding
2. Retrieval testing metrics (Recall@K, Precision@K)
3. Groundedness scoring
4. Citation accuracy

**Feature:** [gen-ai-rag.feature](examples/features/gen-ai-rag.feature)  
**Feature:** [groundedness-scoring.feature](examples/features/groundedness-scoring.feature)

### Part 3: Quality Metrics & Evaluation (90 min)
1. Lexical metrics (BLEU, ROUGE-L, Levenshtein)
2. Semantic evaluation (cosine similarity, topic coverage)
3. Pipeline quality gates
4. LLM client interfaces

**Feature:** [lexical-metrics.feature](examples/features/lexical-metrics.feature)  
**Feature:** [semantic-evaluation.feature](examples/features/semantic-evaluation.feature)  
**Feature:** [pipeline-gates.feature](examples/features/pipeline-gates.feature)

### Part 4: Prompt Engineering & Safety (90 min)
1. Prompt optimization strategies
2. A/B testing for prompts
3. Adversarial testing (injection, jailbreak)
4. Safety & bias validation
5. Synthetic data generation

**Feature:** [prompt-optimization.feature](examples/features/prompt-optimization.feature)  
**Feature:** [prompt-ab-testing.feature](examples/features/prompt-ab-testing.feature)  
**Feature:** [gen-ai-safety.feature](examples/features/gen-ai-safety.feature)  
**Feature:** [adversarial-testing.feature](examples/features/adversarial-testing.feature)  
**Feature:** [synthetic-data.feature](examples/features/synthetic-data.feature)

### Part 5: Advanced Topics (60 min)
1. Token & cost management
2. Hallucination detection
3. Performance monitoring
4. Production deployment

**Feature:** [token-cost-management.feature](examples/features/token-cost-management.feature)  
**Feature:** [hallucination-detection.feature](examples/features/hallucination-detection.feature)

---

## 🗂️ Files Structure

```
Day5/
├── README.md                                    ← You are here
├── DAY6_DETAILED_GUIDE.md                       ← Complete training guide
│
└── examples/
    ├── features/                                ← BDD Feature Files (Gherkin)
    │   ├── gen-ai-basic.feature                 ← Basic response quality & consistency
    │   ├── gen-ai-rag.feature                   ← RAG pipeline testing
    │   ├── gen-ai-safety.feature                ← Safety & compliance
    │   ├── hallucination-detection.feature       ← Hallucination testing
    │   ├── lexical-metrics.feature              ← BLEU, ROUGE-L, Levenshtein
    │   ├── semantic-evaluation.feature          ← Cosine similarity, topic coverage
    │   ├── groundedness-scoring.feature         ← Claim grounding verification
    │   ├── pipeline-gates.feature               ← Quality gate evaluation
    │   ├── prompt-optimization.feature          ← Strategy comparison
    │   ├── prompt-ab-testing.feature            ← Statistical A/B testing
    │   ├── token-cost-management.feature        ← Token tracking & budgets
    │   ├── synthetic-data.feature               ← Test data generation
    │   └── adversarial-testing.feature          ← Security attack testing
    │
    ├── step-definitions/                        ← BDD Step Definitions
    │   ├── gen-ai.steps.ts                      ← Core Gen AI steps
    │   └── advanced-gen-ai.steps.ts             ← Advanced concept steps
    │
    ├── support/                                 ← BDD Support Files
    │   ├── world.ts                             ← Custom World with all frameworks
    │   └── hooks.ts                             ← Before/After hooks
    │
    ├── frameworks/                              ← Core Gen AI Framework Classes
    │   ├── GenAITestFramework.ts                ← Core quality evaluation
    │   ├── RAGTestFramework.ts                  ← RAG pipeline testing
    │   ├── HallucinationDetector.ts             ← Hallucination detection
    │   ├── SafetyValidator.ts                   ← Safety & PII validation
    │   ├── LexicalMetrics.ts                    ← BLEU, ROUGE-L, Levenshtein
    │   ├── SemanticEvaluator.ts                 ← TF-IDF cosine similarity
    │   ├── GroundednessScorer.ts                ← Claim grounding scorer
    │   ├── LLMClientInterface.ts                ← Typed ILLMClient + MockLLMClient
    │   ├── PipelineGates.ts                     ← Quality gate system
    │   ├── PromptABHarness.ts                   ← Statistical A/B testing
    │   ├── SyntheticDataGenerator.ts            ← Test data generator
    │   └── AdversarialTester.ts                 ← Security attack tester
    │
    └── utils/                                   ← Utility Classes
        ├── TokenManager.ts                      ← Token counting & limits
        ├── PromptOptimizer.ts                   ← Prompt strategy comparison
        ├── CostCalculator.ts                    ← API cost tracking
        └── ResponseValidator.ts                 ← Response format validation
```

---

## 🚀 Quick Start

### Run All Day 5 Gen AI BDD Tests
```bash
npm run test:bdd:day5
```

### Run Specific Feature
```bash
# Basic quality testing
npx cucumber-js -p day5 --name "Basic Generative AI"

# Lexical metrics
npx cucumber-js -p day5 --name "Lexical Metrics"

# Pipeline gates
npx cucumber-js -p day5 --name "Pipeline Quality Gates"

# Adversarial testing
npx cucumber-js -p day5 --name "Adversarial Testing"
```

### Dry Run (validate steps are wired)
```bash
npx cucumber-js -p day5 --dry-run
```

---

## 📊 Gen AI Testing Concepts Covered

### Complete Coverage Matrix

| # | Concept | Framework Class | Feature File |
|---|---------|----------------|--------------|
| 1 | Lexical Metrics (BLEU/ROUGE) | `LexicalMetrics.ts` | `lexical-metrics.feature` |
| 2 | Semantic Evaluators | `SemanticEvaluator.ts` | `semantic-evaluation.feature` |
| 3 | LLM Groundedness Scorer | `GroundednessScorer.ts` | `groundedness-scoring.feature` |
| 4 | LLM Client Interface | `LLMClientInterface.ts` | (used across all tests) |
| 5 | RAG Pipeline Evaluator | `RAGTestFramework.ts` | `gen-ai-rag.feature` |
| 6 | Pipeline Gates | `PipelineGates.ts` | `pipeline-gates.feature` |
| 7 | Prompt A/B Harness | `PromptABHarness.ts` | `prompt-ab-testing.feature` |
| 8 | Synthetic Data Generator | `SyntheticDataGenerator.ts` | `synthetic-data.feature` |
| 9 | Hallucination Detection | `HallucinationDetector.ts` | `hallucination-detection.feature` |
| 10 | Safety & Compliance | `SafetyValidator.ts` | `gen-ai-safety.feature` |
| 11 | Adversarial Testing | `AdversarialTester.ts` | `adversarial-testing.feature` |
| 12 | Token & Cost Management | `TokenManager.ts` + `CostCalculator.ts` | `token-cost-management.feature` |
| 13 | Prompt Optimization | `PromptOptimizer.ts` | `prompt-optimization.feature` |

### Gen AI Testing Pyramid

```
                    ▲
                   ╱ ╲
                  ╱   ╲  Adversarial & Security
                 ╱     ╲ (5%)
                ╱───────╲
               ╱         ╲ Safety & Compliance
              ╱           ╲ (10%)
             ╱─────────────╲
            ╱               ╲ Pipeline Gates & Quality
           ╱                 ╲ (20%)
          ╱───────────────────╲
         ╱                     ╲ RAG, Groundedness, Semantic
        ╱                       ╲ (25%)
       ╱─────────────────────────╲
      ╱                           ╲ Lexical, Basic Response, Cost
     ╱                             ╲ (40%)
    ╱───────────────────────────────╲
```

---

## 🎯 Learning Outcomes

After completing Day 5, you will:

✅ **Understand:** Gen AI testing, RAG systems, hallucination detection, prompt engineering, safety/compliance, adversarial attacks

✅ **Can Implement:** All 13 Gen AI testing concepts in BDD format with reusable framework classes

✅ **Can Deploy:** Production-ready Gen AI test suites with CI/CD integration, quality gates, and monitoring

---

**Status:** ✅ Production-Ready Training Module  
**Created by:** Sourabh Kulkarni - SDET Architect  
**Last Updated:** May 11, 2026

Next → Start with [DAY6_DETAILED_GUIDE.md](DAY6_DETAILED_GUIDE.md)
