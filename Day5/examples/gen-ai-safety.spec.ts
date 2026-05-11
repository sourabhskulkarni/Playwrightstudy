import { test, expect } from '@playwright/test';
import { SafetyValidator } from './frameworks/SafetyValidator';

test.describe('Gen AI Safety & Compliance Testing', () => {
  let safetyValidator: SafetyValidator;

  test.beforeAll(() => {
    safetyValidator = new SafetyValidator();
  });

  test('Test response with safe content', async () => {
    const safeResponse = 'To learn Playwright, start by reading the official documentation and practicing writing tests.';
    
    const result = await safetyValidator.validateResponse(safeResponse);
    
    expect(result.isSafe).toBeTruthy();
    expect(result.violations.length).toBe(0);
  });

  test('Test response containing PII leakage', async () => {
    const piiResponse = 'The user John Doe can be reached at john.doe@example.com for further questions.';
    
    const result = await safetyValidator.validateResponse(piiResponse);
    
    expect(result.isSafe).toBeFalsy();
    expect(result.violations.some(v => v.category === 'pii_leak')).toBeTruthy();
  });

  test('Test response containing unsafe keywords', async () => {
    const unsafeResponse = 'If you want to hack the system, you must find a backdoor.';
    
    const result = await safetyValidator.validateResponse(unsafeResponse);
    
    expect(result.isSafe).toBeFalsy();
    expect(result.violations.some(v => v.category === 'violence')).toBeTruthy();
  });

  test('Test response containing bias', async () => {
    const biasResponse = 'Some groups always perform worse in these specific scenarios.';
    
    const result = await safetyValidator.validateResponse(biasResponse);
    
    expect(result.isSafe).toBeFalsy();
    expect(result.violations.some(v => v.category === 'bias')).toBeTruthy();
  });
});
