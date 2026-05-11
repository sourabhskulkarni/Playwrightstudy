// SemanticEvaluator.ts
// Provides semantic-level evaluation of AI responses
// Uses TF-IDF based cosine similarity and topic coverage analysis

/**
 * Result of a semantic evaluation
 */
export interface SemanticEvaluationResult {
  cosineSimilarity: number;   // 0-1, TF-IDF based vector similarity
  topicCoverage: number;      // 0-1, how well candidate covers reference topics
  contextAlignment: number;   // 0-1, alignment with the original prompt context
  overallSemanticScore: number; // 0-1, weighted average
}

/**
 * TF-IDF vector representation
 */
interface TFIDFVector {
  terms: Map<string, number>;
}

export class SemanticEvaluator {

  /**
   * Run all semantic evaluations between a candidate, reference, and optional prompt
   */
  evaluate(candidate: string, reference: string, prompt?: string): SemanticEvaluationResult {
    const cosineSimilarity = this.computeCosineSimilarity(candidate, reference);
    const topicCoverage = this.computeTopicCoverage(candidate, reference);
    const contextAlignment = prompt
      ? this.computeContextAlignment(candidate, prompt)
      : 0.85; // Default if no prompt provided

    // Weighted average: Cosine 40%, Topic Coverage 35%, Context Alignment 25%
    const overallSemanticScore =
      (cosineSimilarity * 0.4) +
      (topicCoverage * 0.35) +
      (contextAlignment * 0.25);

    return {
      cosineSimilarity,
      topicCoverage,
      contextAlignment,
      overallSemanticScore
    };
  }

  /**
   * Compute TF-IDF based cosine similarity between two texts
   * This is a simplified but functional TF-IDF implementation for testing purposes
   */
  computeCosineSimilarity(textA: string, textB: string): number {
    const tokensA = this.tokenize(textA);
    const tokensB = this.tokenize(textB);

    if (tokensA.length === 0 || tokensB.length === 0) return 0;

    // Build document frequency map
    const allDocs = [tokensA, tokensB];
    const dfMap = this.computeDocumentFrequency(allDocs);

    // Build TF-IDF vectors
    const vecA = this.computeTFIDF(tokensA, dfMap, allDocs.length);
    const vecB = this.computeTFIDF(tokensB, dfMap, allDocs.length);

    // Compute cosine similarity
    return this.cosine(vecA, vecB);
  }

  /**
   * Compute topic coverage - how many key topics from reference appear in candidate
   * Uses noun/keyword extraction as a proxy for topics
   */
  computeTopicCoverage(candidate: string, reference: string): number {
    const refTopics = this.extractTopics(reference);
    const candTopics = this.extractTopics(candidate);

    if (refTopics.size === 0) return 1; // No topics to cover

    let covered = 0;
    for (const topic of refTopics) {
      // Check exact match or partial match
      if (candTopics.has(topic)) {
        covered++;
      } else {
        // Check if any candidate topic contains this topic or vice versa
        for (const ct of candTopics) {
          if (ct.includes(topic) || topic.includes(ct)) {
            covered += 0.5; // Partial credit
            break;
          }
        }
      }
    }

    return Math.min(1, covered / refTopics.size);
  }

  /**
   * Compute context alignment - how well the response addresses the prompt
   */
  computeContextAlignment(response: string, prompt: string): number {
    // Extract intent keywords from prompt
    const promptKeywords = this.extractTopics(prompt);
    const responseTokens = new Set(this.tokenize(response));

    if (promptKeywords.size === 0) return 0.85;

    let aligned = 0;
    for (const keyword of promptKeywords) {
      if (responseTokens.has(keyword)) {
        aligned++;
      }
    }

    return Math.min(1, aligned / promptKeywords.size);
  }

  // --- Private Helper Methods ---

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 0);
  }

  private computeDocumentFrequency(docs: string[][]): Map<string, number> {
    const df = new Map<string, number>();
    for (const doc of docs) {
      const uniqueTerms = new Set(doc);
      for (const term of uniqueTerms) {
        df.set(term, (df.get(term) || 0) + 1);
      }
    }
    return df;
  }

  private computeTFIDF(tokens: string[], df: Map<string, number>, totalDocs: number): TFIDFVector {
    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    const tfidf = new Map<string, number>();
    for (const [term, count] of tf) {
      const termFreq = count / tokens.length;
      const docFreq = df.get(term) || 1;
      const idf = Math.log((totalDocs + 1) / (docFreq + 1)) + 1; // Smoothed IDF
      tfidf.set(term, termFreq * idf);
    }

    return { terms: tfidf };
  }

  private cosine(vecA: TFIDFVector, vecB: TFIDFVector): number {
    const allTerms = new Set([...vecA.terms.keys(), ...vecB.terms.keys()]);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const term of allTerms) {
      const a = vecA.terms.get(term) || 0;
      const b = vecB.terms.get(term) || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  private extractTopics(text: string): Set<string> {
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
      'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
      'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet',
      'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
      'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'what',
      'how', 'why', 'when', 'where', 'which', 'who'
    ]);

    const tokens = this.tokenize(text);
    return new Set(tokens.filter(t => t.length > 2 && !stopWords.has(t)));
  }
}
