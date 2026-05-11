import { test, expect } from '@playwright/test';
import { HallucinationDetector } from './frameworks/HallucinationDetector';

test.describe('Hallucination Detection Testing', () => {
  let detector: HallucinationDetector;

  test.beforeAll(() => {
    // Pass a mock knowledge base
    detector = new HallucinationDetector({ isMock: true }, 1);
  });

  test('Test safe response with factual statements', async () => {
    const response = 'Playwright is an open-source testing framework developed by Microsoft. It supports Chromium, WebKit, and Firefox.';
    
    const result = await detector.detectHallucinations(response);
    
    expect(result.safe).toBeTruthy();
    expect(result.hallucinations.length).toBe(0);
  });

  test('Test response with detected contradiction', async () => {
    const response = 'Playwright is easy. However, it contradicts the fact that it is completely impossible to use for testing.';
    
    const result = await detector.detectHallucinations(response);
    
    expect(result.safe).toBeFalsy();
    expect(result.hallucinations.some(h => h.type === 'contradiction')).toBeTruthy();
  });

  test('Test response with detected fabrication', async () => {
    const response = 'Playwright was invented by Thomas Edison in 1920 to test lightbulbs.';
    
    const result = await detector.detectHallucinations(response);
    
    // In our mock logic, the word 'invented' triggers fabrication check failure
    expect(result.safe).toBeFalsy();
    expect(result.hallucinations.some(h => h.type === 'fabrication')).toBeTruthy();
  });

  test('Test response for omissions', async () => {
    const response = 'To use this machine, press the green button.';
    const context = 'User manual regarding machine operation and safety protocols.';
    
    const result = await detector.detectHallucinations(response, context);
    
    // In our mock logic, context with 'safety' requires 'safety' in response
    expect(result.safe).toBeFalsy();
    expect(result.hallucinations.some(h => h.type === 'omission')).toBeTruthy();
  });
});
