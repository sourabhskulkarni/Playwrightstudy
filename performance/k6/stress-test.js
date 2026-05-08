// File: performance/k6/stress-test.js
// Description: Stress test - keep pushing users until breaking point

import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Wait, ramp up to 100
    { duration: '2m', target: 200 },   // Increase to 200
    { duration: '2m', target: 500 },   // Push harder - 500 users
    { duration: '2m', target: 1000 },  // Keep pushing - 1000 users
    { duration: '2m', target: 2000 },  // Extreme stress - 2000 users
    { duration: '5m', target: 2000 },  // Hold at maximum for 5 minutes
    { duration: '5m', target: 0 },     // Cool down
  ],

  // More relaxed thresholds for stress testing
  thresholds: {
    'http_req_failed': ['rate<0.1'],   // Allow up to 10% failures when stressed
    'http_req_duration': ['p(95)<2000'], // 95% under 2 seconds
  },
};

export default function() {
  group('Search Under Stress', () => {
    const response = http.get(
      'https://api.makemytrip.com/search?from=DEL&to=BOM&date=2025-12-01'
    );

    check(response, {
      'status ok': (r) => r.status < 400,
      'has response': (r) => r.body.length > 0,
    });

    // Smaller sleep during stress test
    sleep(Math.random() + 0.5); // 0.5-1.5 seconds
  });

  group('Details Under Stress', () => {
    const response = http.get(
      'https://api.makemytrip.com/flights/FL123456'
    );

    check(response, {
      'details ok': (r) => r.status < 400,
    });

    sleep(Math.random() + 0.5);
  });
}
