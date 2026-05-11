// TokenManager.ts
// Utility for tracking and managing tokens

export class TokenManager {
  private totalPromptTokens: number = 0;
  private totalCompletionTokens: number = 0;
  private tokenLimit: number;

  constructor(tokenLimit: number = 100000) {
    this.tokenLimit = tokenLimit;
  }

  /**
   * Tracks tokens used in a request
   */
  trackTokens(promptTokens: number, completionTokens: number): void {
    this.totalPromptTokens += promptTokens;
    this.totalCompletionTokens += completionTokens;
    
    if (this.getTotalTokens() > this.tokenLimit) {
      console.warn(`Token limit of ${this.tokenLimit} exceeded!`);
    }
  }

  getTotalTokens(): number {
    return this.totalPromptTokens + this.totalCompletionTokens;
  }

  getUsageStats() {
    return {
      promptTokens: this.totalPromptTokens,
      completionTokens: this.totalCompletionTokens,
      totalTokens: this.getTotalTokens(),
      limit: this.tokenLimit,
      remainingTokens: Math.max(0, this.tokenLimit - this.getTotalTokens())
    };
  }

  reset() {
    this.totalPromptTokens = 0;
    this.totalCompletionTokens = 0;
  }

  // Simplified token estimation (1 token ≈ 4 characters)
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
