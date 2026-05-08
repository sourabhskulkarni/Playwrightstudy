# Day 3: API Testing and Performance Testing

## Agenda
- API Testing with Playwright
- REST API Concepts
- Authentication and Headers
- Performance Testing Basics
- Measuring Page Load Times
- Real-time Example: Testing MakeMyTrip APIs

## API Testing with Playwright
Playwright provides APIRequestContext for testing APIs.

### Key Methods:
- request.get(url)
- request.post(url, data)
- request.put(url, data)
- request.delete(url)

### Example:
```typescript
const apiContext = await request.newContext();
const response = await apiContext.get('https://api.example.com/users');
expect(response.status()).toBe(200);
```

## REST API Concepts
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200 OK, 201 Created, 400 Bad Request, etc.
- **Headers**: Content-Type, Authorization
- **Body**: JSON, XML, Form Data

## Authentication
- Basic Auth
- Bearer Token
- API Keys

## Performance Testing
- Page load times
- Network requests
- Resource usage

### Playwright Performance APIs:
- page.evaluate(() => performance.timing)
- Tracing
- Lighthouse integration

## Real-time Example: MakeMyTrip API Testing
See examples/ folder for API tests and performance tests.

Run: npx playwright test examples/mmt-api.spec.ts