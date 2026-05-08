// File: performance/k6/spike-test.js
// Description: Spike test - sudden traffic surge (like viral tweet)

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },     // Normal baseline
    { duration: '30s', target: 5000 },  // Spike! Massive jump
    { duration: '2m', target: 5000 },   // Maintain spike for 2 minutes
    { duration: '30s', target: 50 },    // Back to normal quickly
    { duration: '1m', target: 0 },      // Cool down
  ],

  // Tight thresholds to catch issues during spikes
  thresholds: {
    'http_req_failed': ['rate<0.05'],    // Max 5% failures during spike
    'http_req_duration': ['p(95)<1000'], // 95% under 1 second
  },
};

export default function() {
  const response = http.get(
    'https://api.makemytrip.com/search?from=DEL&to=BOM&date=2025-12-01',
    {
      timeout: '10s', // Extended timeout for spike
    }
  );

  check(response, {
    'spike test: status ok': (r) => r.status === 200,
    'spike test: quick response': (r) => r.timings.duration < 1000,
    'spike test: has data': (r) => r.body.length > 0,
  });

  // Minimal sleep during spike
  sleep(Math.random() * 2);
}
