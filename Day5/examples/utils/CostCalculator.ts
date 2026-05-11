// CostCalculator.ts
// Utility for tracking API costs

export class CostCalculator {
  private totalCost: number = 0;
  private budget: number;
  private pricePerInputToken: number;
  private pricePerOutputToken: number;

  constructor(budget: number = 10.0, inputPrice: number = 0.00001, outputPrice: number = 0.00003) {
    this.budget = budget;
    this.pricePerInputToken = inputPrice;
    this.pricePerOutputToken = outputPrice;
  }

  addCost(inputTokens: number, outputTokens: number): number {
    const cost = (inputTokens * this.pricePerInputToken) + (outputTokens * this.pricePerOutputToken);
    this.totalCost += cost;
    
    if (this.totalCost > this.budget) {
      console.warn(`Budget exceeded! Total cost: $${this.totalCost.toFixed(4)}, Budget: $${this.budget.toFixed(4)}`);
    }
    
    return cost;
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  getBudgetStatus() {
    return {
      totalCost: this.totalCost,
      budget: this.budget,
      remaining: Math.max(0, this.budget - this.totalCost),
      percentageUsed: (this.totalCost / this.budget) * 100
    };
  }

  reset() {
    this.totalCost = 0;
  }
}
