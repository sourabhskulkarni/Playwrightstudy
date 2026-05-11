# Day 6: Generative AI Testing - Complete Detailed Guide

**Created by:** Sourabh Kulkarni - SDET Architect  
**Duration:** 6-8 hours with hands-on labs  
**Difficulty:** Advanced  

---

## Part 1: Understanding Gen AI Testing

### Why Traditional Testing Doesn't Work for AI

#### Traditional Testing (Deterministic)
```
Input: Username = "John"
Expected Output: "Welcome, John"
Actual Output: "Welcome, John"
Result: ✓ PASS

Same input always = Same output
```

#### Gen AI Testing (Non-Deterministic)
```
Input: "Summarize AI trends"
Output 1: "AI focuses on efficiency..."
Output 2: "Key AI trends include..."
Output 3: "Modern AI emphasizes..."

Same input can produce different outputs
Result: Quality score instead of Pass/Fail
```

### Key Differences

| Aspect          | Traditional              | Gen AI                    |
| --------------- | ------------------------ | ------------------------- |
| **Determinism** | Same input = Same output | Variable outputs          |
| **Assertions**  | Pass/Fail                | Quality scores (0-1)      |
| **Metrics**     | Coverage %               | Quality, accuracy, safety |
| **Cost**        | Zero per test            | Per API call              |
| **Speed**       | Milliseconds             | Seconds                   |
| **Validation**  | Binary                   | Multi-dimensional         |
| **Failures**    | Root cause clear         | Multiple factors          |

### Gen AI Testing Challenges

```
Challenge 1: Quality Evaluation
├─ How do we measure if response is "good"?
├─ Subjective evaluation is unreliable
└─ Need: Automated quality metrics

Challenge 2: Hallucinations
├─ AI generates false information convincingly
├─ Hard to detect without fact-checking
└─ Need: Hallucination detection system

Challenge 3: Cost Control
├─ Each API call costs money
├─ Testing 1000 prompts = $$ spent
└─ Need: Token tracking & optimization

Challenge 4: Safety & Bias
├─ AI can generate harmful content
├─ Bias may be subtle and hidden
└─ Need: Safety validators

Challenge 5: Performance
├─ Response time matters for UX
├─ Token limits affect cost
└─ Need: Performance monitoring
```

---

## Part 2: Core Concepts

### Tokens

**Definition:** Tokens are units of text that AI processes.

```
Text: "Hello, world!"
Tokens: ["Hello", ",", " world", "!"]
Count: 4 tokens

Text: "The quick brown fox..."
Tokens: ["The", " quick", " brown", " fox", "..."]
Count: 5 tokens

💡 Key Points:
- 1 token ≈ 4 characters
- 1000 tokens ≈ 750 words
- Pricing based on tokens (input + output)
```

**Token Cost Example:**
```
Model: GPT-4
Input: "Explain quantum computing" (5 tokens)
Output: "Quantum computing uses quantum mechanics..." (50 tokens)
Total: 55 tokens × $0.0015/token = $0.000825 (~0.1 cent)

At scale: 10,000 responses = $8.25
```

### Context Window

**Definition:** Maximum tokens the model can process at once.

```
Context Window = 128,000 tokens (for some models)

Breakdown:
├─ System message: 500 tokens
├─ Conversation history: 80,000 tokens
├─ Current user message: 5,000 tokens
├─ Available for output: 42,500 tokens
└─ TOTAL: 128,000 tokens
```

### Prompts

**Definition:** Instructions you give the AI to generate responses.

```typescript
// Simple prompt
"What is machine learning?"

// Detailed prompt (few-shot)
"Explain these concepts like you're talking to a beginner:
Q: What is AI?
A: AI is technology that can learn from data...

Q: What is machine learning?
A: ???"

// System message (personality)
"You are a Python expert. Answer all questions about Python."
```

### RAG (Retrieval-Augmented Generation)

**Definition:** Combine document retrieval with generation.

```
Flow:
User Query: "Who won the 2024 World Cup?"
    ↓
[RETRIEVAL]
Query Vector Database → Find relevant documents
Retrieved: [Document about 2024 World Cup]
    ↓
[AUGMENTATION]
Combine retrieved document with query:
"Using this document: [World Cup info]
Answer: Who won the 2024 World Cup?"
    ↓
[GENERATION]
LLM generates: "Argentina won the 2024 World Cup..."
    ↓
Response is grounded in real data (not hallucinated)
```

### Embeddings & Vector Search

```
Document: "Machine learning is a subset of AI"
    ↓
Convert to embedding (vector of numbers):
[0.1, 0.3, 0.8, 0.2, ...]  ← 768 dimensions

Query: "What is ML?"
    ↓
Convert to embedding:
[0.15, 0.35, 0.75, 0.25, ...] ← Same dimensions

Calculate similarity (distance between vectors):
Similarity = 0.95 (very similar, 95% match)
    ↓
Retrieve the document (relevant!)
```

---

## Part 3: RAG System Testing

### RAG Testing Framework

```typescript
interface RAGTest {
  query: string;
  expectedDocuments: Document[];
  expectedAnswer: string;
  
  // Measured metrics
  retrievedDocs: Document[];
  generatedAnswer: string;
  
  // Scores (0-1)
  retrievalScore: number;  // Did we find right docs?
  relevanceScore: number;  // Are they relevant?
  accuracyScore: number;   // Is answer correct?
  citationScore: number;   // Are sources cited?
}
```

### Retrieval Metrics

#### Recall@K
```
Definition: % of relevant documents in top-K results
Formula: (Relevant docs found / Total relevant docs) × 100

Example:
Query: "Benefits of solar energy"
Total relevant docs: 10
Found in top-5 results: 8
Recall@5 = (8/10) × 100 = 80% ✓
```

#### Precision@K
```
Definition: % of retrieved documents that are relevant
Formula: (Relevant docs found / Total retrieved) × 100

Example:
Retrieved top-5 results
Relevant results: 4
Irrelevant results: 1
Precision@5 = (4/5) × 100 = 80% ✓
```

#### MRR (Mean Reciprocal Rank)
```
Definition: Rank of the first relevant result
Formula: 1 / Rank of first relevant doc

Example:
Results:
1. [Irrelevant]
2. [Irrelevant]
3. [RELEVANT] ← First relevant at position 3
4. [Relevant]
5. [Relevant]

MRR = 1/3 = 0.33

Higher rank (closer to top) = Higher MRR
```

### RAG Quality Metrics

```
Metric                  Target    How to Measure
────────────────────────────────────────────────
Retrieval Recall        > 80%     # relevant docs found
Retrieval Precision     > 90%     # retrieved are relevant
Citation Accuracy       100%      # sources are correct
Factual Accuracy        > 95%     Expert review / Fact-check
Relevance to Query      > 90%     Semantic similarity
Answer Completeness     > 85%     Question answered fully
Latency                 < 5s      End-to-end time
```

---

## Part 4: Prompt Engineering & Optimization

### Prompt Strategies

#### 1. Simple Prompts
```
"What is machine learning?"

Pros: Fast, cheap
Cons: May miss context, generic responses
```

#### 2. Few-Shot Prompts
```
"Here are some examples:

Example 1:
Question: What is AI?
Answer: AI is technology that performs tasks...

Example 2:
Question: What is ML?
Answer: ML is a subset of AI that learns...

Now answer:
Question: What is deep learning?
Answer: ???"

Pros: Better quality
Cons: More tokens, higher cost
```

#### 3. Chain-of-Thought
```
"Think step by step:

Question: If John has 3 apples and buys 5 more,
then gives 2 to Mary, how many does he have?

Let me think:
1. John starts with 3 apples
2. He buys 5 more: 3 + 5 = 8 apples
3. He gives 2 to Mary: 8 - 2 = 6 apples
4. Final answer: 6 apples"

Pros: Better reasoning, more accurate
Cons: Takes more tokens
```

### Prompt Testing Process

```
1. CREATE VARIATIONS
   └─ Simple vs Detailed
   └─ Few-shot vs Chain-of-thought
   └─ Different temperatures

2. GENERATE RESPONSES
   └─ 10 responses per prompt
   └─ Measure consistency (std dev)
   └─ Calculate average quality

3. EVALUATE
   └─ Quality score
   └─ Cost per request
   └─ Token efficiency
   └─ Consistency

4. COMPARE & SELECT
   └─ Best quality/cost ratio
   └─ Deploy optimized prompt
```

### Temperature Impact

```
Temperature 0.0 (Deterministic)
Output: "The capital of France is Paris."
Output: "The capital of France is Paris."
Output: "The capital of France is Paris."
✓ Always same (good for factual tasks)

Temperature 0.5 (Balanced)
Output: "Paris is France's capital city."
Output: "France's capital is Paris."
Output: "The city of Paris is France's capital."
✓ Some variation (good for most tasks)

Temperature 1.0+ (Creative)
Output: "Paris, the city of lights, is France's capital."
Output: "The romantic city of Paris governs France."
Output: "France revolves around its capital, Paris."
✓ High variation (good for creative tasks)
```

---

## Part 5: Safety & Hallucination Prevention

### Hallucination Types

#### 1. Fabrication (Making Things Up)
```
Prompt: "Who won the 2024 World Cup?"
Response: "Atlantis FC won the 2024 World Cup..."
           ↑ Never happened, completely fabricated

Detection: Not in any reliable knowledge base
Prevention: Use RAG (ground in real documents)
```

#### 2. Contradiction (Conflicting Statements)
```
Prompt: "Tell me about Python programming"
Response: "Python is a complex language that only experts can use.
          However, Python is known for its simplicity
          and is great for beginners."
          ↑ Contradictory statements

Detection: Logical inconsistency checker
Prevention: Prompt instructions to be consistent
```

#### 3. Omission (Missing Critical Info)
```
Prompt: "What are the side effects of medication X?"
Response: "Medication X is effective for treating..."
          ↑ Missing important safety information

Detection: Checklist of required information
Prevention: Prompt to include all critical details
```

### Hallucination Detection System

```typescript
async function detectHallucinations(response: string, knowledgeBase: KB) {
  const hallucinations = [];
  
  // 1. Extract claims
  const claims = await extractClaims(response);
  
  // 2. Verify each claim
  for (const claim of claims) {
    const verified = await verifyClaim(claim, knowledgeBase);
    
    if (!verified) {
      hallucinations.push({
        claim,
        type: classifyType(claim),  // Fabrication / Contradiction / Omission
        confidence: 0.95,
        severity: calculateSeverity(claim)
      });
    }
  }
  
  return {
    hallucinations,
    hallucinnationRate: (hallucinations.length / claims.length) * 100,
    safe: hallucinations.length < 3  // Threshold
  };
}
```

### Safety Validation

```
SAFETY CHECKLIST
═════════════════════════════════════

Content Safety:
☐ No hate speech
☐ No violence
☐ No illegal activities
☐ No self-harm content
☐ No explicit content

Bias Detection:
☐ No gender bias
☐ No racial bias
☐ No age discrimination
☐ No disability bias
☐ No economic bias

Privacy/Security:
☐ No PII exposure
☐ No credentials leaked
☐ No data leakage
☐ No password info

Compliance:
☐ GDPR compliant
☐ Copyright respected
☐ Terms of service ok
☐ No regulated content
```

---

## Part 6: Monitoring & Production

### Metrics Dashboard

```
GEN AI METRICS
════════════════════════════════════════════

🎯 Quality Metrics
   Response Quality:    8.4/10    ✓
   Hallucination Rate:  2.1%      ✓
   Factual Accuracy:    96.3%     ✓
   User Satisfaction:   4.2/5     ✓

⚡ Performance Metrics
   Average Latency:     2.3s      ✓
   P95 Latency:         4.8s      ✓
   Throughput:          42 req/s  ✓
   Availability:        99.95%    ✓

💰 Cost Metrics
   Tokens/Request:      45        ✓
   Cost/Request:        $0.012    ✓
   Daily Cost:          $287      ⚠️ Trending up
   Budget Remaining:    $4,213    ✓

🔒 Safety Metrics
   Safety Violations:   0         ✓
   Bias Incidents:      0         ✓
   Privacy Issues:      0         ✓
   Compliance Status:   PASS      ✓
```

### Monitoring Implementation

```typescript
interface MonitoringConfig {
  // Quality thresholds
  minQualityScore: 0.85;
  maxHallucinationRate: 5;  // %
  minAccuracy: 0.95;        // %
  
  // Performance thresholds
  maxLatencyMs: 5000;
  minAvailability: 0.999;
  
  // Cost thresholds
  maxCostPerRequest: 0.02;  // $
  dailyBudget: 1000;        // $
  
  // Safety thresholds
  maxSafetyViolations: 0;
  maxBiasIncidents: 0;
}

// Alert when thresholds breached
if (qualityScore < config.minQualityScore) {
  alert('Quality Score Below Target');
}

if (dailyCost > config.dailyBudget) {
  alert('Budget Exceeded');
}
```

---

## Part 7: Production Deployment

### Deployment Checklist

```
PRE-DEPLOYMENT
═════════════════════════════════════════

Test Coverage:
☐ 50+ test cases written
☐ Happy path tests ✓
☐ Edge case tests ✓
☐ Error case tests ✓
☐ Safety tests ✓
☐ Performance tests ✓

Quality Gates:
☐ Response quality > 0.85
☐ Hallucination rate < 5%
☐ Accuracy > 95%
☐ Latency < 5s (P95)
☐ Cost tracking enabled
☐ Safety validated
☐ Compliance verified

Infrastructure:
☐ Monitoring set up
☐ Alerts configured
☐ Cost limits set
☐ Rate limiting enabled
☐ Error handling implemented
☐ Fallback strategy ready

Documentation:
☐ Testing guide written
☐ Known issues documented
☐ Troubleshooting guide ready
☐ Team trained

DEPLOYMENT
═════════════════════════════════════════

☐ Deploy to staging
☐ Run smoke tests
☐ Monitor for 24 hours
☐ Deploy to production
☐ Monitor closely first week
☐ Regular health checks
```

---

## Part 8: Hands-On Labs

### Lab 1: Basic Gen AI Testing (30 min)
1. Open [gen-ai-basic.spec.ts](examples/gen-ai-basic.spec.ts)
2. Understand the test structure
3. Run: `npx playwright test Day6/examples/gen-ai-basic.spec.ts`
4. Modify prompts and observe quality score changes

### Lab 2: RAG Pipeline Testing (45 min)
1. Open [gen-ai-rag.spec.ts](examples/gen-ai-rag.spec.ts)
2. Understand retrieval & generation metrics
3. Add your own test cases
4. Run tests and analyze metrics

### Lab 3: Hallucination Detection (45 min)
1. Open [hallucination-detection.spec.ts](examples/hallucination-detection.spec.ts)
2. Examine hallucination detection logic
3. Create custom hallucination test cases
4. Verify detection accuracy

### Lab 4: Safety Validation (30 min)
1. Open [gen-ai-safety.spec.ts](examples/gen-ai-safety.spec.ts)
2. Understand safety validators
3. Test with adversarial prompts
4. Verify safety checks pass

### Lab 5: Prompt Optimization (45 min)
1. Open [prompt-optimizer.spec.ts](examples/prompt-optimizer.spec.ts)
2. Compare different prompt strategies
3. Analyze quality vs cost trade-offs
4. Select optimal prompt

---

## Key Takeaways

✅ **Gen AI testing is different** - Quality scores instead of pass/fail

✅ **RAG systems** - Ground AI responses in real documents

✅ **Hallucinations are critical** - Detect and prevent fabrications

✅ **Prompts matter** - Engineering affects quality and cost

✅ **Monitor everything** - Quality, cost, safety, performance

✅ **Safety first** - Always validate for harmful content

✅ **Automation helps** - Use Playwright for UI testing of AI apps

✅ **Frameworks scale** - Reusable components for any AI app

---

## Next Steps

1. **Complete all labs** (3-4 hours)
2. **Review frameworks** - Understand each class
3. **Modify examples** - Adapt to your use cases
4. **Deploy framework** - Use in your projects
5. **Measure KPIs** - Track quality, cost, safety
6. **Optimize** - Improve based on metrics

---

## Quick Reference

**For Quality Testing:**
→ Use `GenAITestFramework.testAIResponse()`

**For RAG Systems:**
→ Use `RAGTestFramework.testRAGPipeline()`

**For Hallucinations:**
→ Use `HallucinationDetector.detectHallucinations()`

**For Safety:**
→ Use `SafetyValidator.validateResponse()`

**For Cost:**
→ Use `TokenManager.trackTokens()` and `CostCalculator.calculateCost()`

---

**Status:** ✅ Production-Ready Training  
**Created by:** Sourabh Kulkarni - SDET Architect

