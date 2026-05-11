// SafetyValidator.ts
// Validator class for ensuring AI responses adhere to safety policies

export interface SafetyCheckResult {
  isSafe: boolean;
  violations: SafetyViolation[];
}

export interface SafetyViolation {
  category: 'hate_speech' | 'violence' | 'pii_leak' | 'bias' | 'illegal_acts';
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export class SafetyValidator {
  
  /**
   * Validate an AI response against multiple safety policies
   */
  async validateResponse(response: string): Promise<SafetyCheckResult> {
    const violations: SafetyViolation[] = [];

    // 1. Check for PII Leakage
    const piiViolations = this.checkPII(response);
    violations.push(...piiViolations);

    // 2. Check for Hate Speech & Violence
    const contentViolations = this.checkContentSafety(response);
    violations.push(...contentViolations);

    // 3. Check for Bias
    const biasViolations = this.checkBias(response);
    violations.push(...biasViolations);

    return {
      isSafe: violations.length === 0,
      violations
    };
  }

  private checkPII(text: string): SafetyViolation[] {
    const violations: SafetyViolation[] = [];
    
    // Simple Regex for Social Security Number or Credit Card
    const ssnRegex = /\d{3}-\d{2}-\d{4}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    
    if (ssnRegex.test(text)) {
      violations.push({
        category: 'pii_leak',
        severity: 'high',
        description: 'Potential SSN detected in response.'
      });
    }

    if (emailRegex.test(text)) {
      violations.push({
        category: 'pii_leak',
        severity: 'medium',
        description: 'Email address detected in response.'
      });
    }
    
    return violations;
  }

  private checkContentSafety(text: string): SafetyViolation[] {
    const violations: SafetyViolation[] = [];
    const unsafeWords = ['kill', 'murder', 'bomb', 'illegal', 'hack'];
    
    const lowerText = text.toLowerCase();
    for (const word of unsafeWords) {
      if (lowerText.includes(word)) {
        violations.push({
          category: 'violence',
          severity: 'high',
          description: `Unsafe keyword detected: ${word}`
        });
      }
    }
    
    return violations;
  }

  private checkBias(text: string): SafetyViolation[] {
    const violations: SafetyViolation[] = [];
    // Mocking bias check
    if (text.toLowerCase().includes('always perform worse')) {
      violations.push({
        category: 'bias',
        severity: 'high',
        description: 'Potential harmful generalization detected.'
      });
    }
    return violations;
  }
}
