# Day 3: Detailed Trainer Guide - API Testing & Performance Testing

## Learning Objectives
By the end of Day 3, your team will understand:
- What APIs are and why test them
- How to make HTTP requests in tests
- How to validate API responses
- What performance testing is
- How to measure load times
- How to implement performance assertions

---

## Part 1: API Fundamentals

### What is an API?

**API = Application Programming Interface**

Think of it as a waiter at a restaurant:

```
Restaurant Analogy:
You → (request) → Waiter → (internal work) → Chef → (response) → Waiter → You

API:
Your App → (request) → Server → (internal work) → Database → (response) → Server → Your App
```

### Types of APIs

1. **REST API** (Most common)
   - Uses HTTP methods: GET, POST, PUT, DELETE
   - Exchanges data as JSON
   - Stateless (each request is independent)

2. **GraphQL**
   - Query language for APIs
   - Ask for exactly what you need

3. **SOAP**
   - Older, more complex
   - Uses XML

**We'll focus on REST APIs.**

### HTTP Methods

```
GET    - Retrieve data (no body needed)
POST   - Create new data (with body)
PUT    - Update existing data (with body)
DELETE - Remove data
PATCH  - Partially update data
```

**Real MakeMyTrip Examples:**
```
GET    /flights/search?from=DEL&to=BOM    → Get list of flights
POST   /booking                             → Create new booking
GET    /booking/123                         → Get booking details
DELETE /booking/123                         → Cancel booking
PUT    /user/profile                        → Update profile
```

---

## Part 2: Making API Calls in Playwright

### The APIRequestContext

Playwright provides a built-in tool called `APIRequestContext` for making API calls.

```typescript
import { APIRequestContext, request } from '@playwright/test';

// Create an API context
const apiContext = await request.newContext({
  baseURL: 'https://api.makemytrip.com',
  extraHTTPHeaders: {
    'Content-Type': 'application/json',
  },
});

// Make a GET request
const response = await apiContext.get('/flights/search?from=DEL&to=BOM');

// Get the status code
console.log('Status:', response.status());  // 200, 404, 500, etc.

// Parse response as JSON
const data = await response.json();

// Clean up
await apiContext.dispose();
```

---

## Part 3: Making Different Types of Requests

### GET Request

```typescript
test('search flights', async () => {
  const apiContext = await request.newContext();
  
  const response = await apiContext.get('https://api.makemytrip.com/flights/search', {
    params: {  // Query parameters (become ?from=DEL&to=BOM)
      from: 'DEL',
      to: 'BOM',
      date: '2024-12-01',
      adults: '1'
    }
  });
  
  console.log('Status:', response.status());  // Should be 200
  const flights = await response.json();
  console.log('Flights found:', flights.total);
  
  await apiContext.dispose();
});
```

**What happens behind scenes:**
```
1. Constructs URL: api.makemytrip.com/flights/search?from=DEL&to=BOM&date=2024-12-01
2. Sends request to server
3. Server processes request
4. Server returns response (JSON data)
5. We parse the response
```

### POST Request

```typescript
test('create booking', async () => {
  const apiContext = await request.newContext();
  
  const bookingData = {
    flightId: 'FL123',
    passengers: [{
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      gender: 'M'
    }],
    payment: {
      method: 'card',
      amount: 5000
    }
  };
  
  const response = await apiContext.post('https://api.makemytrip.com/booking', {
    data: bookingData,  // Sent in request body
    headers: {
      'Authorization': 'Bearer token123'  // Add authentication
    }
  });
  
  console.log('Status:', response.status());  // Should be 201
  const booking = await response.json();
  console.log('Booking ID:', booking.id);
  
  await apiContext.dispose();
});
```

### PUT Request (Update)

```typescript
test('update passenger details', async () => {
  const apiContext = await request.newContext();
  
  const updatedData = {
    name: 'Jane Doe',
    email: 'jane@example.com'
  };
  
  const response = await apiContext.put('https://api.makemytrip.com/booking/123', {
    data: updatedData
  });
  
  console.log('Status:', response.status());  // Should be 200
  
  await apiContext.dispose();
});
```

### DELETE Request

```typescript
test('cancel booking', async () => {
  const apiContext = await request.newContext();
  
  const response = await apiContext.delete('https://api.makemytrip.com/booking/123');
  
  console.log('Status:', response.status());  // Should be 200 or 204
  
  await apiContext.dispose();
});
```

---

## Part 4: Validating API Responses

### Response Structure

Every API response has:

```
Status Code: 200
Headers: { 'content-type': 'application/json', ... }
Body: { "flights": [...], "total": 10 }
```

### Validation 1: Status Code

```typescript
test('api returns success', async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.get('https://api.makemytrip.com/flights/search?from=DEL&to=BOM');
  
  // Check status code
  expect(response.status()).toBe(200);  // Success
  // OR
  expect([200, 201]).toContain(response.status());  // Accept multiple codes
  
  await apiContext.dispose();
});
```

**Common Status Codes:**
```
200 OK              - Request successful
201 Created         - Resource created successfully
400 Bad Request     - Invalid parameters
401 Unauthorized    - Missing/invalid authentication
403 Forbidden       - No permission
404 Not Found       - Resource doesn't exist
500 Server Error    - Server problem
```

### Validation 2: Response Headers

```typescript
test('api returns json', async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.get('https://api.makemytrip.com/flights/search?from=DEL&to=BOM');
  
  // Check content type header
  expect(response.headers()['content-type']).toContain('application/json');
  
  await apiContext.dispose();
});
```

### Validation 3: Response Body

```typescript
test('flight search returns correct structure', async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.get('https://api.makemytrip.com/flights/search?from=DEL&to=BOM');
  
  const data = await response.json();
  
  // Check structure exists
  expect(data).toHaveProperty('flights');
  expect(data).toHaveProperty('total');
  expect(data).toHaveProperty('currency');
  
  // Check types
  expect(Array.isArray(data.flights)).toBe(true);
  expect(typeof data.total).toBe('number');
  
  // Check content
  expect(data.flights.length).toBeGreaterThan(0);
  expect(data.total).toBeGreaterThan(0);
  
  // Check each flight has required fields
  data.flights.forEach(flight => {
    expect(flight).toHaveProperty('id');
    expect(flight).toHaveProperty('airline');
    expect(flight).toHaveProperty('price');
    expect(flight).toHaveProperty('departure');
    expect(flight).toHaveProperty('arrival');
  });
  
  await apiContext.dispose();
});
```

### Validation 4: Specific Values

```typescript
test('flight prices are reasonable', async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.get('https://api.makemytrip.com/flights/search?from=DEL&to=BOM');
  
  const data = await response.json();
  
  // Check price ranges
  data.flights.forEach(flight => {
    expect(flight.price).toBeGreaterThan(1000);    // At least ₹1000
    expect(flight.price).toBeLessThan(100000);     // Less than ₹100000
    expect(flight.currency).toBe('INR');
  });
  
  await apiContext.dispose();
});
```

---

## Part 5: Authentication in APIs

### Types of Authentication

#### 1. Bearer Token (Most common)

```typescript
test('authenticated request', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      'Authorization': 'Bearer eyJhbGc...'  // Long token string
    }
  });
  
  const response = await apiContext.get('https://api.makemytrip.com/user/profile');
  expect(response.status()).toBe(200);
  
  await apiContext.dispose();
});
```

#### 2. API Key

```typescript
test('api key authentication', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      'X-API-Key': 'your-api-key-123'
    }
  });
  
  const response = await apiContext.get('https://api.makemytrip.com/flights/search?from=DEL&to=BOM');
  expect(response.status()).toBe(200);
  
  await apiContext.dispose();
});
```

#### 3. Basic Authentication

```typescript
test('basic auth', async () => {
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      'Authorization': 'Basic ' + Buffer.from('username:password').toString('base64')
    }
  });
  
  const response = await apiContext.get('https://api.makemytrip.com/admin/users');
  expect(response.status()).toBe(200);
  
  await apiContext.dispose();
});
```

### Getting Tokens (Login First)

```typescript
test('login and use token', async () => {
  const apiContext = await request.newContext();
  
  // Step 1: Login to get token
  const loginResponse = await apiContext.post('https://api.makemytrip.com/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123'
    }
  });
  
  expect(loginResponse.status()).toBe(200);
  const { token } = await loginResponse.json();
  
  // Step 2: Use token for other requests
  const userResponse = await apiContext.get('https://api.makemytrip.com/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(userResponse.status()).toBe(200);
  
  await apiContext.dispose();
});
```

---

## Part 6: Performance Testing Basics

### What is Performance Testing?

Testing to ensure software:
- Loads quickly
- Responds fast to user actions
- Doesn't use excessive resources
- Scales with more users

### Types of Performance Tests

```
Load Testing       - How fast under normal load?
Stress Testing     - How much load can it handle?
Endurance Testing  - Can it run for hours without issues?
Spike Testing      - How does it handle sudden traffic?
```

### Key Metrics

**1. Response Time**
```
Time from sending request to receiving response
Ideal: < 2 seconds
Acceptable: < 3 seconds
Bad: > 5 seconds
```

**2. Page Load Time**
```
Time to load complete page
Ideal: < 2 seconds
Acceptable: < 3 seconds
Bad: > 5 seconds
```

**3. Time to First Byte (TTFB)**
```
Time from request to first byte of response
Ideal: < 600ms
Acceptable: < 1s
```

**4. Largest Contentful Paint (LCP)**
```
Time when largest content element appears
Ideal: < 2.5 seconds
```

---

## Part 7: Measuring Performance with Playwright

### Measuring Page Load Time

```typescript
test('measure page load time', async ({ page }) => {
  const startTime = Date.now();
  
  // Navigate to page
  await page.goto('https://www.makemytrip.com/', {
    waitUntil: 'domcontentloaded'  // Wait until DOM is ready
  });
  
  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms`);
  
  // Assert load time is acceptable
  expect(loadTime).toBeLessThan(3000);  // Should load in under 3 seconds
});
```

### Measuring Search Performance

```typescript
test('measure search time', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  
  const startTime = Date.now();
  
  // Perform search
  await page.locator('input[name="from"]').fill('Delhi');
  await page.locator('input[name="to"]').fill('Mumbai');
  await page.locator('button[type="submit"]').click();
  
  // Wait for results
  await page.waitForSelector('.flight-results');
  
  const searchTime = Date.now() - startTime;
  console.log(`Search took ${searchTime}ms`);
  
  // Assert search time is acceptable
  expect(searchTime).toBeLessThan(5000);  // Should search in under 5 seconds
});
```

### Measuring Resource Loading

```typescript
test('measure resource loading', async ({ page }) => {
  const resources = [];
  
  // Capture all requests/responses
  page.on('response', (response) => {
    resources.push({
      url: response.url(),
      status: response.status(),
      size: response.headers()['content-length'] || 'unknown'
    });
  });
  
  await page.goto('https://www.makemytrip.com/', {
    waitUntil: 'networkidle'  // Wait until network idle
  });
  
  // Analyze resources
  const imageResources = resources.filter(r => r.url.match(/\.(jpg|jpeg|png|gif|webp)/i));
  const jsResources = resources.filter(r => r.url.includes('.js'));
  const cssResources = resources.filter(r => r.url.includes('.css'));
  
  console.log(`Images: ${imageResources.length}`);
  console.log(`JS files: ${jsResources.length}`);
  console.log(`CSS files: ${cssResources.length}`);
  
  // Assert reasonable number of resources
  expect(imageResources.length).toBeLessThan(50);
  expect(jsResources.length).toBeLessThan(20);
  expect(cssResources.length).toBeLessThan(10);
});
```

### Core Web Vitals

```typescript
test('measure core web vitals', async ({ page }) => {
  await page.goto('https://www.makemytrip.com/');
  
  // Get Core Web Vitals
  const metrics = await page.evaluate(() => {
    const vitals = {};
    
    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals['lcp'] = lastEntry.startTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          vitals['cls'] = clsValue;
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // First Input Delay (FID) - via First Interaction Delay
    new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      vitals['fid'] = entry.processingEnd - entry.startTime;
    }).observe({ entryTypes: ['first-input'] });
    
    return vitals;
  });
  
  console.log('Core Web Vitals:', metrics);
  
  // Assert good vitals
  if (metrics.lcp) {
    expect(metrics.lcp).toBeLessThan(2500);  // Good LCP
  }
  if (metrics.cls) {
    expect(metrics.cls).toBeLessThan(0.1);  // Good CLS
  }
});
```

---

## Part 8: Creating API Client Class

```typescript
import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private requestContext!: APIRequestContext;
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'https://api.makemytrip.com') {
    this.baseURL = baseURL;
  }

  async init() {
    this.requestContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string) {
    const response = await this.requestContext.post('/auth/login', {
      data: { email, password },
    });
    
    expect(response.status()).toBe(200);
    const { token } = await response.json();
    this.token = token;
    return token;
  }

  async searchFlights(from: string, to: string, date: string) {
    const response = await this.requestContext.get('/flights/search', {
      params: { from, to, date },
    });
    
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async createBooking(flightId: string, passengers: any[]) {
    const response = await this.requestContext.post('/booking', {
      data: { flightId, passengers },
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
    });
    
    expect([200, 201]).toContain(response.status());
    return await response.json();
  }

  async dispose() {
    await this.requestContext.dispose();
  }
}
```

### Using API Client in Tests

```typescript
test('complete booking via API', async () => {
  const api = new ApiClient();
  await api.init();
  
  try {
    // Login
    await api.login('user@example.com', 'password');
    
    // Search flights
    const flights = await api.searchFlights('DEL', 'BOM', '2024-12-01');
    expect(flights.flights.length).toBeGreaterThan(0);
    
    // Create booking
    const booking = await api.createBooking(flights.flights[0].id, [
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      }
    ]);
    
    expect(booking).toHaveProperty('id');
    console.log('Booking created:', booking.id);
  } finally {
    await api.dispose();
  }
});
```

---

## Summary of Day 3

**Key Concepts:**
1. **APIs** - How applications communicate
2. **HTTP Methods** - GET, POST, PUT, DELETE
3. **Response Validation** - Status, headers, body
4. **Authentication** - Bearer tokens, API keys
5. **Performance Metrics** - Load time, response time, Core Web Vitals
6. **APIRequestContext** - Playwright's API testing tool

**Best Practices:**
- Create reusable API client classes
- Validate all aspects of responses
- Measure performance metrics
- Set reasonable performance thresholds
- Handle authentication properly

Next: Day 4 - Database Testing & Complete Framework