# K6 Performance Testing - Complete Beginner's Guide

## Welcome to K6! 🚀

K6 is a **modern performance testing tool** that lets you test if your website/API can handle heavy traffic.

---

## Part 1: What is Performance Testing?

### Simple Definition:
**Performance testing** checks if your application works correctly when many users use it at the same time.

### Real-Life Analogy:
```
Restaurant without performance testing:
- Designed for 10 customers
- 50 customers arrive for lunch
- Restaurant crashes! (Overcrowded, slow service)

Restaurant WITH performance testing:
- Tested with 100+ simultaneous customers
- Built to handle the load
- Runs smoothly even when busy!
```

### Why Performance Testing Matters:
- ✓ Know your application's limits
- ✓ Find bottlenecks (slow parts)
- ✓ Prevent crashes during peak usage
- ✓ Improve user experience
- ✓ Save money (avoid expensive infrastructure)

---

## Part 2: What is K6?

### Definition:
**K6** is a load testing tool that simulates many users accessing your application simultaneously.

### K6 vs JMeter:

| Feature | K6 | JMeter |
|---------|----|----|
| **Language** | JavaScript | XML/Java |
| **Learning** | Easy | Hard |
| **Cloud** | Built-in (k6 Cloud) | Manual setup |
| **Speed** | Fast |Slower |
| **Modern UI** | Yes | No |
| **Best for** | API & Web tests | Complex scenarios |

**For beginners: Use K6**  
**For complex scenarios: Use JMeter**

### K6 Architecture:
```
Your K6 Script (JavaScript)
       ↓
K6 Engine (Runs your script)
       ↓
Virtual Users (Simulated users)
       ↓
Your Application (Website/API)
       ↓
K6 Cloud (Results & Reporting)
```

---

## Part 3: Installing K6

### For Windows:

**Option 1: Using Chocolatey (Recommended)**
```bash
# Install Chocolatey (if not already installed)
# From PowerShell (as Administrator)
choco install k6

# Verify installation
k6 version
```

**Option 2: Using Manual Installation**
```bash
# Download from https://github.com/grafana/k6/releases
# Download latest k6 release for Windows
# Extract and add to PATH
```

**Option 3: Using Docker**
```bash
# Run K6 in Docker
docker run -i grafana/k6 run - < script.js
```

### For Mac:
```bash
# Using Homebrew
brew install k6

# Verify
k6 version
```

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

### Verify Installation:
```bash
k6 version
# Should output: k6 vX.X.X (version number)

k6 help
# Shows available commands
```

---

## Part 4: Your First K6 Script

### Basic Structure:

```javascript
// Import K6 functions
import http from 'k6/http';
import { check, sleep } from 'k6';

// Define how many users and how long to run
export const options = {
  vus: 10,              // 10 virtual users
  duration: '30s',      // Run for 30 seconds
};

// The actual test (runs for each user)
export default function() {
  // Make a request
  const response = http.get('https://www.makemytrip.com/');
  
  // Check if response is good
  check(response, {
    'status is 200': (r) => r.status === 200,
    'page loaded': (r) => r.body.length > 0,
  });
  
  // Wait between requests
  sleep(1);
}
```

### Terminology:

- **VUs (Virtual Users)**: Simulated users accessing your app (like 10 users on same time)
- **Duration**: How long the test runs
- **Iterations**: How many times each user repeats the test function
- **RPS (Requests Per Second)**: How many requests per second
- **Think time**: Simulated delay between user actions (user thinking time)

### Running Your Script:

```bash
# Run locally
k6 run script.js

# With verbose output
k6 run script.js -v

# Run and send results to k6 Cloud
k6 run script.js --cloud
```

---

## Part 5: K6 Test Types Explained

### Type 1: Load Test (Gradual Increase)

**What:** Start with few users, gradually increase to peak load.

**Use Case:** How does your app perform as more users arrive?

**Real Example:** Website opens to public
```
9:00 AM: 10 users
9:15 AM: 50 users
9:30 AM: 100 users
9:45 AM: 200 users
10:00 AM: Peak (500 users)
```

**K6 Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },   // 0 → 100 users over 5 minutes
    { duration: '10m', target: 100 },  // Stay at 100 users for 10 minutes
    { duration: '5m', target: 0 },     // 100 → 0 users over 5 minutes
  ],
};

export default function() {
  const response = http.get('https://api.makemytrip.com/flights');
  
  check(response, {
    'status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**What K6 Measures:**
- How response time changes as load increases
- At what point does app start slowing down
- Maximum users it can handle

---

### Type 2: Stress Test (Push to Limit)

**What:** Increase users until the system breaks.

**Use Case:** What's the breaking point?

**Real Example:**
```
Target: 500 users
500 → 1000 users (stress slowly)
1000 → 5000 users (keep stressing)
Keep going until system fails!
```

**K6 Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // 0 → 100 users (ramp-up)
    { duration: '5m', target: 100 },   // Stay at 100
    { duration: '10m', target: 500 },  // 100 → 500 users (stress)
    { duration: '10m', target: 1000 }, // 500 → 1000 users (more stress!)
    { duration: '3m', target: 0 },     // Cool down
  ],
};

export default function() {
  const response = http.get('https://api.makemytrip.com/search');
  
  check(response, {
    'status is successful': (r) => r.status < 400,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  sleep(Math.random() + 1);  // Random sleep 1-2 seconds
}
```

**During Stress Test, Watch For:**
- Error rates increasing
- Response times getting longer
- Memory usage growing
- CPU usage maxing out

---

### Type 3: Spike Test (Sudden Traffic)

**What:** Sudden jump to high number of users (like viral tweet).

**Use Case:** Can you handle sudden traffic spike?

**Real Example:**
```
Normal: 50 users
SPIKE: Suddenly 5000 users come!
After spike: Back to 50 users
```

**K6 Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },     // Baseline 50 users
    { duration: '10s', target: 5000 },  // Spike! 50 → 5000 in 10 seconds
    { duration: '2m', target: 5000 },   // Maintain spike for 2 minutes
    { duration: '10s', target: 50 },    // Back to normal quickly
    { duration: '1m', target: 0 },      // Cool down
  ],
};

export default function() {
  const response = http.get('https://api.makemytrip.com/flights');
  
  check(response, {
    'is successful': (r) => r.status === 200,
    'is fast': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**Questions Spike Test Answers:**
- Does app crash during sudden traffic?
- How long to recover after spike?
- Does it cause cascading failures?

---

### Type 4: Soak Test (Long Duration)

**What:** Keep moderate load for very long time.

**Use Case:** Do memory leaks or issues appear over time?

**K6 Script:**
```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 },    // Ramp up
    { duration: '8h', target: 100 },    // Hold for 8 hours!
    { duration: '5m', target: 0 },      // Ramp down
  ],
};

// Rest of script...
```

**What This Tests:**
- Memory leaks
- Database connection pool issues
- Log file disk space
- Session management over time

---

## Part 6: Understanding K6 Metrics

### Key Metrics:

```javascript
// These metrics are automatically collected by K6

http_requests_total         // Total number of requests
http_request_duration        // Time per request (ms)
http_request_failed          // Failed requests
data_sent                    // Data uploaded (bytes)
data_received                // Data downloaded (bytes)
vus                          // Virtual users right now
vus_max                      // Maximum VUs during test
iteration_duration           // Time per iteration
drop_rate                    // % of requests that failed
```

### Reading K6 Report:

```bash
$ k6 run load-test.js

     ✓ status is 200
     ✓ response time < 500ms

   checks.........................: 95.5%  (total 10245)
   data received....................: 5.2 MB
   data sent........................: 234 MB
   http_req_blocked..................: avg=0.23ms    min=0.01ms   max=34ms     p(90)=0.35ms   p(95)=0.53ms
   http_req_connecting...............: avg=0.08ms    min=0ms      max=24ms     p(90)=0.15ms   p(95)=0.30ms
   http_req_duration.................: avg=123.45ms  min=45ms     max=2500ms   p(90)=250ms    p(95)=350ms
   http_req_failed...................: 4.5%
   http_requests.....................: 10245 in 30m
   iteration_duration................: avg=1.12s     min=1.01s    max=4.5s     p(90)=1.20s    p(95)=1.35s
   vus...............................: 100 (min: 100, max: 100)
```

### What Each Line Means:

| Metric | Explanation |
|--------|-------------|
| `checks: 95.5%` | 95.5% of checks passed (5% failed) |
| `data_received: 5.2 MB` | Downloaded 5.2 MB total |
| `http_req_duration: avg=123ms` | Average response time 123ms |
| `http_req_failed: 4.5%` | 4.5% of requests had errors |
| `http_requests: 10245` | Made 10,245 total requests |
| `vus: 100` | Running with 100 users |
| `p(95)=350ms` | 95% of requests were faster than 350ms |

---

## Part 7: Real-World K6 Examples

### Example 1: Load Test MakeMyTrip Flights Search

```javascript
// File: performance/k6/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },    // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },   // Increase to 100 over 2 minutes
    { duration: '5m', target: 100 },   // Stay at 100 for 5 minutes
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% requests < 500ms
    'http_req_failed': ['rate<0.1'],                    // Less than 10% failures
  },
};

export default function() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'K6-Performance-Test/1.0',
    },
  };

  // Simulate searching flights
  const searchResponse = http.get(
    'https://api.makemytrip.com/search?from=DEL&to=BOM&date=2025-12-01',
    params
  );

  check(searchResponse, {
    'search returned 200': (r) => r.status === 200,
    'search completed fast': (r) => r.timings.duration < 500,
    'flight results exist': (r) => r.body.includes('flights'),
  });

  sleep(1);

  // Simulate selecting a flight
  const flightId = JSON.parse(searchResponse.body).flights[0].id;
  
  const detailsResponse = http.get(
    `https://api.makemytrip.com/flights/${flightId}`,
    params
  );

  check(detailsResponse, {
    'details returned 200': (r) => r.status === 200,
    'details completed fast': (r) => r.timings.duration < 300,
  });

  sleep(2);  // User thinking time before next action
}
```

### Example 2: Spike Test - Sudden Traffic

```javascript
// File: performance/k6/spike-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },     // Normal load
    { duration: '1m', target: 5000 },   // Spike! Most important part
    { duration: '2m', target: 5000 },   // Maintain spike
    { duration: '1m', target: 50 },     // Back to normal
    { duration: '1m', target: 0 },      // Cool down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.05'],  // Max 5% failures allowed
  },
};

export default function() {
  const response = http.get('https://api.makemytrip.com/flights');

  check(response, {
    'spike test passed': (r) => r.status === 200,
    'response under 1s': (r) => r.timings.duration < 1000,
  });

  sleep(Math.random() * 2);
}
```

### Example 3: Stress Test - Find Breaking Point

```javascript
// File: performance/k6/stress-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },    // Keep pushing
    { duration: '2m', target: 2000 },    // Still pushing
    { duration: '2m', target: 5000 },    // Maximum stress!
    { duration: '5m', target: 0 },       // Cool down
  ],
};

export default function() {
  const response = http.post(
    'https://api.makemytrip.com/book',
    JSON.stringify({
      flightId: 12345,
      passengers: 2,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(response, {
    'booking status ok': (r) => r.status < 400,
  });

  sleep(1);
}
```

---

## Part 8: Idempotency Testing with K6

### What is Idempotency?

**Definition:** An API call that produces same result even if called multiple times.

### Example:

```javascript
// ❌ NOT Idempotent - Creates duplicate bookings!
POST /book
{ flightId: 123, passengers: 2 }
→ Booking created

POST /book
{ flightId: 123, passengers: 2 }  // Same request
→ Different booking created!  (WRONG!)

// ✓ Idempotent - Creates only ONE booking
POST /book
{ flightId: 123, passengers: 2, idempotencyKey: "unique-id" }
→ Booking created

POST /book
{ flightId: 123, passengers: 2, idempotencyKey: "unique-id" }
→ Returns same booking  (CORRECT!)
```

### Testing Idempotency with K6:

```javascript
// File: performance/k6/idempotency-test.js

import http from 'k6/http';
import { check } from 'k6';
import { v4 as uuid } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 10,
  duration: '1m',
};

export default function() {
  const idempotencyKey = uuid();  // Unique key for this test
  
  const payload = {
    flightId: 123,
    passengers: 2,
    idempotencyKey: idempotencyKey,  // Include idempotency key
  };

  // First request
  const response1 = http.post(
    'https://api.makemytrip.com/book',
    JSON.stringify(payload),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const booking1 = JSON.parse(response1.body);
  
  check(response1, {
    'first booking successful': (r) => r.status === 201,
  });

  // Retry the SAME request (network hiccup simulation)
  const response2 = http.post(
    'https://api.makemytrip.com/book',
    JSON.stringify(payload),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const booking2 = JSON.parse(response2.body);

  // IMPORTANT: Check they're the same booking!
  check(response2, {
    'retry returns same booking': (r) => booking2.id === booking1.id,
    'idempotency works': (r) => r.status === 200 || r.status === 201,
  });
}
```

### Why Idempotency Matters:

```
Network Timeout Scenario:
1. User clicks "Book Flight"
2. Request sent to server
3. User doesn't see confirmation (network issue)
4. User clicks "Book" again (thinking first failed)
5. Without idempotency: TWO bookings created! ❌
6. With idempotency: SAME booking returned ✓
```

---

## Part 9: K6 Checks and Thresholds

### Checks (Assertions):

```javascript
import { check } from 'k6';

export default function() {
  const response = http.get('https://api.makemytrip.com/flights');
  
  // Check if conditions are true
  check(response, {
    'response status is 200': (r) => r.status === 200,
    'has flights': (r) => r.body.includes('flights'),
    'response time < 500ms': (r) => r.timings.duration < 500,
    'body not empty': (r) => r.body.length > 0,
    'has correct content type': (r) => r.headers['Content-Type'].includes('application/json'),
  });
}
```

### Thresholds (Pass/Fail Criteria):

```javascript
export const options = {
  vus: 100,
  duration: '30s',
  
  // These thresholds MUST pass or test fails!
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% < 500ms
    'http_req_failed': ['rate<0.1'],                    // < 10% failures
    'checks': ['rate>0.95'],                            // > 95% checks pass
  },
};
```

### Real Example with Checks & Thresholds:

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '5m',
  
  // TEST FAILS if these aren't met:
  thresholds: {
    'http_req_duration': [
      'p(99)<1000',     // 99% of requests < 1 second
      'avg<500',        // Average response time < 500ms
    ],
    'http_req_failed': ['rate<0.05'],  // Less than 5% failures
    'checks': ['rate>0.95'],            // More than 95% checks pass
  },
};

export default function() {
  const response = http.get('https://api.makemytrip.com/flights');
  
  const result = check(response, {
    'status 200': (r) => r.status === 200,
    'body has data': (r) => r.body.length > 100,
    'response time ok': (r) => r.timings.duration < 1000,
  });

  // If any check fails:
  if (!result) {
    console.error('Some checks failed!');
  }
}
```

---

## Part 10: Running K6 Tests

### Command 1: Run Locally

```bash
# Run a test script
k6 run load-test.js

# Run with verbose output
k6 run load-test.js -v

# Run with specific options
k6 run load-test.js --vus 100 --duration 30s

# Run with environment variables
k6 run load-test.js -e BASE_URL=https://api.makemytrip.com
```

### Command 2: Run in Cloud

```bash
# Create free account at https://app.k6.io
# Login and get API token

# Export token
export K6_CLOUD_TOKEN=your_token_here

# Run in cloud (see results in web dashboard)
k6 run load-test.js --cloud

# Run with cloud but also local output
k6 run load-test.js --cloud -o cloud
```

### Command 3: Output Results

```bash
# Generate JSON results
k6 run load-test.js --out json=results.json

# Output to CSV
k6 run load-test.js --out csv=results.csv

# Send to Grafana
k6 run load-test.js --out grafana
```

---

## Part 11: K6 Best Practices

### Best Practice 1: Realistic Think Time

```javascript
// ❌ BAD - No think time (unrealistic)
export default function() {
  http.get('/search');
  http.get('/book');
  http.get('/confirm');
}

// ✓ GOOD - Add think time between actions
export default function() {
  http.get('/search');
  sleep(2);  // User reading results
  
  http.get('/book');
  sleep(1);  // User entering details
  
  http.get('/confirm');
  sleep(3);  // User reviewing
}

// ✓ BETTER - Randomize think time
export default function() {
  http.get('/search');
  sleep(Math.random() * 3 + 1);  // 1-4 seconds
  
  http.get('/book');
  sleep(Math.random() * 2 + 1);  // 1-3 seconds
}
```

### Best Practice 2: Use Groups for Organization

```javascript
import { group } from 'k6';

export default function() {
  group('Search Flow', () => {
    http.get('/search');
    sleep(2);
    http.get('/results');
  });

  group('Booking Flow', () => {
    http.post('/book', payload);
    sleep(1);
    http.post('/confirm');
  });

  group('Payment Flow', () => {
    http.post('/payment', payment);
    sleep(2);
  });
}
```

### Best Practice 3: Separate Data from Logic

```javascript
// ❌ BAD - Hard-coded data
export default function() {
  http.get('/search?from=DEL&to=BOM');
}

// ✓ GOOD - Use variables
const cities = ['DEL', 'BOM', 'AGR', 'JAI'];

export default function() {
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  http.get(`/search?from=DEL&to=${randomCity}`);
}
```

### Best Practice 4: Error Handling

```javascript
export default function() {
  const response = http.get('/flights');

  if (response.status !== 200) {
    console.error(`Status: ${response.status}, Body: ${response.body}`);
  }

  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
```

---

## Part 12: Project Structure for Performance Tests

```
PlaywrightStudy/
├── performance/
│   ├── k6/
│   │   ├── load-test.js          ← Gradual load test
│   │   ├── stress-test.js        ← Push to breaking point
│   │   ├── spike-test.js         ← Sudden traffic
│   │   ├── soak-test.js          ← Long duration
│   │   ├── idempotency-test.js   ← Idempotency verification
│   │   ├── config.js             ← Common configuration
│   │   └── helpers.js            ← Utility functions
│   │
│   ├── results/
│   │   ├── load-results.json     ← Test results
│   │   └── graphs/               ← Performance graphs
│   │
│   └── documents/
│       ├── performance-report.md ← Results & analysis
│       └── thresholds.md         ← Performance targets
│
├── .github/
│   └── workflows/
│       └── performance.yml       ← CI/CD integration
│
└── package.json
```

---

## Part 13: Summary & Next Steps

### What You've Learned:

✓ What performance testing is  
✓ K6 tool and its advantages  
✓ How to install K6  
✓ Writing K6 scripts  
✓ Load testing (gradual increase)  
✓ Stress testing (find limits)  
✓ Spike testing (sudden traffic)  
✓ Idempotency testing  
✓ Checks and thresholds  
✓ Running tests locally and in cloud  
✓ Best practices  

### Next Steps:

1. **Install K6** - Follow Part 3 above
2. **Create test scripts** - Start with simple load test
3. **Run locally** - `k6 run load-test.js`
4. **Sign up for k6 Cloud** - https://app.k6.io (free tier)
5. **Run in cloud** - See beautiful dashboard
6. **Integrate with CI/CD** - Add to GitHub Actions
7. **Set thresholds** - Define performance targets
8. **Monitor in production** - Continuous performance testing
9. **Compare results** - Track improvements over time
10. **Share reports** - With team and stakeholders

### Performance Testing Targets (Example):

```javascript
// For MakeMyTrip-like application:
thresholds: {
  'http_req_duration': [
    'p(95)<500',      // 95% of requests should be < 500ms
    'p(99)<1000',     // 99% of requests should be < 1s
    'avg<300',        // Average response time < 300ms
  ],
  'http_req_failed': ['rate<0.01'],   // Less than 1% failures
  'checks': ['rate>0.99'],             // 99%+ checks pass
}
```

---

## Exercises

### Exercise 1: Write Your First Load Test

**Task:** Create `performance/k6/basic-load-test.js` that:
1. Starts with 10 users
2. Increases to 50 users
3. Makes GET request to an actual API
4. Includes checks for status and duration

### Exercise 2: Create Stress Test

**Task:** Create stress test that:
1. Gradually increases to 1000 users
2. Continues until error rate exceeds 20%
3. Includes thresholds
4. Records results

### Exercise 3: Idempotency Verification

**Task:** Test that booking the same flight twice:
1. Creates booking first time
2. Returns same booking second time
3. Uses idempotency key

### Exercise 4: Run Tests in CI/CD

**Task:** Integrate K6 with GitHub Actions (use DAY5_DETAILED_GUIDE.md Part 8)

---

## Quick Reference

### K6 Stages:
```javascript
stages: [
  { duration: '5m', target: 100 },  // Ramp up to 100 users over 5 min
  { duration: '10m', target: 100 }, // Hold for 10 minutes
  { duration: '5m', target: 0 },    // Ramp down to 0
]
```

### Common Checks:
```javascript
check(response, {
  'status is 200': (r) => r.status === 200,
  'body contains text': (r) => r.body.includes('search'),
  'response time < 500ms': (r) => r.timings.duration < 500,
  'content type is JSON': (r) => r.headers['Content-Type'].includes('json'),
});
```

### Common Thresholds:
```javascript
thresholds: {
  'http_req_duration': ['p(95)<500', 'p(99)<1000', 'avg<300'],
  'http_req_failed': ['rate<0.1'],
  'checks': ['rate>0.95'],
}
```

---

**Congratulations! You now know K6 performance testing! 🎉**
