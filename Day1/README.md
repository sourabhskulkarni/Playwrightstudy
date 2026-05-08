# Day 1: Introduction to TypeScript and Playwright Basics

## Agenda
- Introduction to TypeScript
- Playwright Setup and Configuration
- Basic UI Testing Concepts
- Locators and Actions
- Testing Basic UI Elements: Input Box, Button, Label, Logo, Image
- Real-time Example: Navigating MakeMyTrip.com

## TypeScript Basics
TypeScript is a superset of JavaScript that adds static typing.

### Key Concepts:
- **Types**: string, number, boolean, etc.
- **Interfaces**: Define object shapes
- **Classes**: Object-oriented programming
- **Generics**: Reusable components

Example:
```typescript
interface User {
  name: string;
  age: number;
}

class Person implements User {
  constructor(public name: string, public age: number) {}
}
```

## Playwright Basics
Playwright is a framework for web testing and automation.

### Setup:
- Installed via npm init playwright@latest
- Config in playwright.config.ts
- Tests in tests/ directory

### Basic Test Structure:
```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

## UI Elements Testing
- **Input Box**: page.fill(selector, text)
- **Button**: page.click(selector)
- **Label**: page.textContent(selector)
- **Logo/Image**: page.locator('img[alt="logo"]').isVisible()

## Real-time Example: MakeMyTrip Navigation
See examples/ folder for code.

Run: npx playwright test examples/mmt-basic.spec.ts