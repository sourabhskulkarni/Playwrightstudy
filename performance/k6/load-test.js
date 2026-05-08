// File: performance/k6/load-test.js
// Description: Gradual load test - users ramp up progressively

import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },    // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },   // Increase to 100 over 2 minutes
    { duration: '5m', target: 100 },   // Stay at 100 for 5 minutes
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],
  
  // Performance thresholds - test fails if not met
  thresholds: {
    'http_req_duration': [
      'p(95)<500',     // 95% of requests must be under 500ms
      'p(99)<1000',    // 99% must be under 1 second
      'avg<300',       // Average must be under 300ms
    ],
    'http_req_failed': ['rate<0.05'],  // Less than 5% failures allowed
  },
};

export default function() {
  // Group flights search
  group('Flight Search', () => {
    const searchResponse = http.get(
      'https://api.makemytrip.com/search?from=DEL&to=BOM&date=2025-12-01',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'K6-LoadTest/1.0',
        },
      }
    );

    check(searchResponse, {
      'search status 200': (r) => r.status === 200,
      'search has flights': (r) => r.body.includes('flights'),
      'search time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1); // User reading results
  });

  // Group flight details
  group('Flight Details', () => {
    const detailsResponse = http.get(
      'https://api.makemytrip.com/flights/FL123456',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    check(detailsResponse, {
      'details status 200': (r) => r.status === 200,
      'details time < 300ms': (r) => r.timings.duration < 300,
    });

    sleep(2); // User reviewing flight details
  });

  sleep(1); // Think time between iterations
}
