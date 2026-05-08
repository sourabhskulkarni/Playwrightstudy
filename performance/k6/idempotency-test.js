// File: performance/k6/idempotency-test.js
// Description: Test that placing same booking twice returns same result

import http from 'k6/http';
import { check, sleep } from 'k6';

// Simple UUID generator (since k6 jslib might not be available)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const options = {
  vus: 10,           // 10 concurrent users
  iterations: 5,     // Each user does 5 iterations
  
  thresholds: {
    'http_req_failed': ['rate<0.01'],  // Max 1% failures
  },
};

export default function() {
  // Generate unique idempotency key for this request
  const idempotencyKey = generateUUID();
  
  const bookingPayload = JSON.stringify({
    flightId: 'FL123456',
    passengers: 2,
    name: 'John Doe',
    email: 'john@example.com',
    idempotencyKey: idempotencyKey, // Unique identifier
  });

  const headers = {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey, // Also in header
  };

  // First request - should create booking
  const firstResponse = http.post(
    'https://api.makemytrip.com/book',
    bookingPayload,
    { headers }
  );

  const firstBooking = JSON.parse(firstResponse.body);

  check(firstResponse, {
    'first attempt: status created': (r) => r.status === 201 || r.status === 200,
    'first attempt: has booking ID': (r) => firstBooking.id !== undefined,
  });

  sleep(1); // Simulate network delay

  // RETRY - Send EXACT same request again
  // With proper idempotency, should return SAME booking
  const secondResponse = http.post(
    'https://api.makemytrip.com/book',
    bookingPayload,
    { headers } // Same headers with same idempotency key
  );

  const secondBooking = JSON.parse(secondResponse.body);

  // CRITICAL: Check that both bookings are identical
  check(secondResponse, {
    'retry: returns same booking ID': (r) => {
      return secondBooking.id === firstBooking.id;
    },
    'retry: idempotency works': (r) => r.status === 200 || r.status === 201,
    'retry: no duplicate created': (r) => {
      return secondBooking.id === firstBooking.id; // Same ID = same booking
    },
  });

  // Optional: Verify booking details match
  if (firstBooking.id !== secondBooking.id) {
    console.error(`Idempotency FAILED: Got different IDs!`);
    console.error(`  First:  ${firstBooking.id}`);
    console.error(`  Second: ${secondBooking.id}`);
  }

  sleep(2);
}
