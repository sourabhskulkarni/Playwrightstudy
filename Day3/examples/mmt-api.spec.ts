import { test, expect, request } from '@playwright/test';

test.describe('MakeMyTrip API Testing', () => {
  test('Get flight search results', async () => {
    const apiContext = await request.newContext();

    // Note: This is a mock API call. Real MakeMyTrip APIs may require authentication
    // and specific endpoints. This is for demonstration purposes.
    const response = await apiContext.get('https://api.makemytrip.com/flights/search', {
      params: {
        from: 'DEL',
        to: 'BOM',
        date: '2024-12-01',
        adults: '1'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('flights');
    expect(Array.isArray(data.flights)).toBe(true);
  });

  test('Post booking request', async () => {
    const apiContext = await request.newContext();

    const bookingData = {
      flightId: 'FL123',
      passengers: [{
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
      }],
      payment: {
        method: 'card',
        amount: 5000
      }
    };

    const response = await apiContext.post('https://api.makemytrip.com/booking', {
      data: bookingData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      }
    });

    // Assuming it returns 201 for successful booking
    expect([200, 201]).toContain(response.status());
  });

  test('API Authentication', async () => {
    const apiContext = await request.newContext();

    // Login to get token
    const loginResponse = await apiContext.post('https://api.makemytrip.com/auth/login', {
      data: {
        username: 'testuser',
        password: 'testpass'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const { token } = await loginResponse.json();

    // Use token for authenticated request
    const protectedResponse = await apiContext.get('https://api.makemytrip.com/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(protectedResponse.status()).toBe(200);
  });
});