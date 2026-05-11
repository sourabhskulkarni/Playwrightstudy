// LexicalMetrics.ts
// Provides lexical-level evaluation metrics for AI response quality
// Implements BLEU, ROUGE-L, Levenshtein Distance, and Keyword Overlap scoring

/**
 * Result of a lexical evaluation containing multiple metric scores
 */
export interface LexicalEvaluationResult {
  bleuScore: number;        // 0-1, measures n-gram precision against reference
  rougeLScore: number;      // 0-1, measures longest common subsequence overlap
  levenshteinDistance: number; // Edit distance (lower = more similar)
  levenshteinNormalized: number; // 0-1 normalized (1 = identical)
  keywordOverlap: number;   // 0-1, ratio of shared keywords
  overallLexicalScore: number; // 0-1, weighted average of all metrics
}

export class LexicalMetrics {

  /**
   * Run all lexical evaluations between a candidate response and a reference answer
   */
  evaluate(candidate: string, reference: string): LexicalEvaluationResult {
    const bleuScore = this.computeBLEU(candidate, reference);
    const rougeLScore = this.computeROUGEL(candidate, reference);
    const levenshteinDistance = this.computeLevenshtein(candidate, reference);
    const maxLen = Math.max(candidate.length, reference.length);
    const levenshteinNormalized = maxLen > 0 ? 1 - (levenshteinDistance / maxLen) : 1;
    const keywordOverlap = this.computeKeywordOverlap(candidate, reference);

    // Weighted average: BLEU 30%, ROUGE-L 30%, Levenshtein 20%, Keyword 20%
    const overallLexicalScore =
      (bleuScore * 0.3) +
      (rougeLScore * 0.3) +
      (levenshteinNormalized * 0.2) +
      (keywordOverlap * 0.2);

    return {
      bleuScore,
      rougeLScore,
      levenshteinDistance,
      levenshteinNormalized,
      keywordOverlap,
      overallLexicalScore
    };
  }

  /**
   * BLEU Score (Bilingual Evaluation Understudy)
   * Measures n-gram precision of candidate against reference.
   * Simplified: uses unigram and bigram precision with brevity penalty.
   */
  computeBLEU(candidate: string, reference: string, maxN: number = 2): number {
    const candTokens = this.tokenize(candidate);
    const refTokens = this.tokenize(reference);

    if (candTokens.length === 0 || refTokens.length === 0) return 0;

    let logPrecisionSum = 0;
    let validN = 0;

    for (let n = 1; n <= maxN; n++) {
      const candNgrams = this.getNgrams(candTokens, n);
      const refNgrams = this.getNgrams(refTokens, n);

      if (candNgrams.length === 0) continue;

      // Count matches
      const refNgramCounts = this.countNgrams(refNgrams);
      const candNgramCounts = this.countNgrams(candNgrams);

      let matches = 0;
      for (const [ngram, count] of candNgramCounts) {
        const refCount = refNgramCounts.get(ngram) || 0;
        matches += Math.min(count, refCount);
      }

      const precision = matches / candNgrams.length;
      if (precision > 0) {
        logPrecisionSum += Math.log(precision);
        validN++;
      }
    }

    if (validN === 0) return 0;

    // Brevity penalty
    const bp = candTokens.length >= refTokens.length
      ? 1
      : Math.exp(1 - refTokens.length / candTokens.length);

    return bp * Math.exp(logPrecisionSum / validN);
  }

  /**
   * ROUGE-L Score (Recall-Oriented Understudy for Gisting Evaluation)
   * Measures the longest common subsequence (LCS) between candidate and reference.
   */
  computeROUGEL(candidate: string, reference: string): number {
    const candTokens = this.tokenize(candidate);
    const refTokens = this.tokenize(reference);

    if (candTokens.length === 0 || refTokens.length === 0) return 0;

    const lcsLength = this.longestCommonSubsequence(candTokens, refTokens);

    const precision = lcsLength / candTokens.length;
    const recall = lcsLength / refTokens.length;

    if (precision + recall === 0) return 0;

    // F1 score
    const beta = 1; // Equal weight for precision and recall
    const fScore = ((1 + beta * beta) * precision * recall) / ((beta * beta * precision) + recall);

    return fScore;
  }

  /**
   * Levenshtein Distance (Edit Distance)
   * Measures minimum edits (insert, delete, replace) to transform candidate into reference.
   */
  computeLevenshtein(candidate: string, reference: string): number {
    const m = candidate.length;
    const n = reference.length;

    // Create distance matrix
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = candidate[i - 1] === reference[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // Deletion
          dp[i][j - 1] + 1,      // Insertion
          dp[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    return dp[m][n];
  }

  /**
   * Keyword Overlap
   * Measures the ratio of shared meaningful words between candidate and reference.
   * Filters out stop words for more meaningful comparison.
   */
  computeKeywordOverlap(candidate: string, reference: string): number {
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
      'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
      'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet',
      'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
      'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);

    const candKeywords = new Set(
      this.tokenize(candidate).filter(t => t.length > 2 && !stopWords.has(t))
    );
    const refKeywords = new Set(
      this.tokenize(reference).filter(t => t.length > 2 && !stopWords.has(t))
    );

    if (candKeywords.size === 0 && refKeywords.size === 0) return 1;
    if (candKeywords.size === 0 || refKeywords.size === 0) return 0;

    // Jaccard similarity
    const intersection = new Set([...candKeywords].filter(k => refKeywords.has(k)));
    const union = new Set([...candKeywords, ...refKeywords]);

    return intersection.size / union.size;
  }

  // --- Private Helper Methods ---

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 0);
  }

  private getNgrams(tokens: string[], n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  private countNgrams(ngrams: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const ng of ngrams) {
      counts.set(ng, (counts.get(ng) || 0) + 1);
    }
    return counts;
  }

  private longestCommonSubsequence(a: string[], b: string[]): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp[m][n];
  }
}
