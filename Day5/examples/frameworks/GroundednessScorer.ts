// GroundednessScorer.ts
// Verifies AI response claims are grounded in source documents

export interface GroundednessResult {
  overallScore: number;
  totalClaims: number;
  groundedClaims: number;
  ungroundedClaims: UngroundedClaim[];
  sourceUtilization: number;
  passed: boolean;
}

export interface UngroundedClaim {
  claim: string;
  bestMatchScore: number;
  suggestedSource: string;
  severity: 'critical' | 'major' | 'minor';
}

export class GroundednessScorer {
  private threshold: number;

  constructor(threshold: number = 0.7) {
    this.threshold = threshold;
  }

  async scoreGroundedness(response: string, sourceDocuments: string[]): Promise<GroundednessResult> {
    const claims = this.extractClaims(response);
    const ungroundedClaims: UngroundedClaim[] = [];
    let groundedCount = 0;

    for (const claim of claims) {
      const match = this.findBestMatch(claim, sourceDocuments);
      if (match.score >= this.threshold) {
        groundedCount++;
      } else {
        ungroundedClaims.push({
          claim,
          bestMatchScore: match.score,
          suggestedSource: match.bestFragment,
          severity: match.score < 0.2 ? 'critical' : match.score < 0.5 ? 'major' : 'minor'
        });
      }
    }

    const overallScore = claims.length > 0 ? groundedCount / claims.length : 1;
    const sourceUtilization = this.computeSourceUtilization(response, sourceDocuments.join(' '));

    return {
      overallScore, totalClaims: claims.length, groundedClaims: groundedCount,
      ungroundedClaims, sourceUtilization, passed: overallScore >= this.threshold
    };
  }

  private extractClaims(response: string): string[] {
    return response.split(/[.!?]+/).map(s => s.trim())
      .filter(s => s.length >= 10 && !/^(hello|hi|sure|okay|yes|no|thank)/i.test(s));
  }

  private findBestMatch(claim: string, docs: string[]): { score: number; bestFragment: string } {
    let bestScore = 0, bestFragment = '';
    const claimTokens = this.tokenize(claim);

    for (const doc of docs) {
      for (const sentence of doc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0)) {
        const score = this.computeOverlap(claimTokens, this.tokenize(sentence));
        if (score > bestScore) { bestScore = score; bestFragment = sentence; }
      }
    }
    return { score: bestScore, bestFragment };
  }

  private computeOverlap(a: string[], b: string[]): number {
    if (!a.length || !b.length) return 0;
    const setA = new Set(a), setB = new Set(b);
    const intersection = [...setA].filter(t => setB.has(t)).length;
    const union = new Set([...setA, ...setB]).size;
    return union > 0 ? intersection / union : 0;
  }

  private computeSourceUtilization(response: string, source: string): number {
    const respTokens = new Set(this.tokenize(response));
    const srcTokens = new Set(this.tokenize(source));
    if (!srcTokens.size) return 0;
    let used = 0;
    for (const t of srcTokens) { if (respTokens.has(t)) used++; }
    return used / srcTokens.size;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 0);
  }
}
