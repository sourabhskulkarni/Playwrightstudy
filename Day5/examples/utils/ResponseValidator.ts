// ResponseValidator.ts
// Generic utility for validating AI responses

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
}

export class ResponseValidator {
  
  validateJSON(response: string): ValidationResult {
    const feedback: string[] = [];
    let isValid = false;
    let score = 0;
    
    try {
      // Try parsing the response to check if it's valid JSON
      // Sometimes AI wraps JSON in markdown blocks
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      JSON.parse(cleanedResponse);
      isValid = true;
      score = 1.0;
    } catch (error: any) {
      feedback.push(`Invalid JSON format: ${error.message}`);
    }
    
    return { isValid, score, feedback };
  }

  validateFormat(response: string, expectedFormat: RegExp): ValidationResult {
    const feedback: string[] = [];
    const isValid = expectedFormat.test(response);
    
    if (!isValid) {
      feedback.push(`Response does not match expected format.`);
    }
    
    return { isValid, score: isValid ? 1.0 : 0.0, feedback };
  }

  validateCompleteness(response: string, requiredKeywords: string[]): ValidationResult {
    const feedback: string[] = [];
    const lowerResponse = response.toLowerCase();
    
    let foundCount = 0;
    for (const keyword of requiredKeywords) {
      if (lowerResponse.includes(keyword.toLowerCase())) {
        foundCount++;
      } else {
        feedback.push(`Missing required keyword: ${keyword}`);
      }
    }
    
    const score = foundCount / requiredKeywords.length;
    
    return {
      isValid: score === 1.0,
      score,
      feedback
    };
  }
}
