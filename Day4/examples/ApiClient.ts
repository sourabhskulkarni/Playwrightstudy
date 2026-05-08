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

  async login(credentials: { username: string; password: string }) {
    const response = await this.requestContext.post('/auth/login', {
      data: credentials,
    });

    if (response.status() === 200) {
      const data = await response.json();
      this.token = data.token;
      // Set token for future requests
      await this.requestContext.dispose();
      this.requestContext = await request.newContext({
        baseURL: this.baseURL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      });
    }

    return response;
  }

  async searchFlights(params: {
    from: string;
    to: string;
    date: string;
    returnDate?: string;
    adults: number;
    class?: string;
  }) {
    const response = await this.requestContext.get('/flights/search', {
      params,
    });
    return response;
  }

  async createBooking(bookingData: {
    flightId: string;
    passengers: Array<{
      name: string;
      email: string;
      phone: string;
    }>;
    payment: {
      method: string;
      amount: number;
    };
  }) {
    const response = await this.requestContext.post('/booking', {
      data: bookingData,
    });
    return response;
  }

  async getBookingDetails(bookingId: string) {
    const response = await this.requestContext.get(`/booking/${bookingId}`);
    return response;
  }

  async cancelBooking(bookingId: string) {
    const response = await this.requestContext.delete(`/booking/${bookingId}`);
    return response;
  }

  async getUserProfile() {
    const response = await this.requestContext.get('/user/profile');
    return response;
  }

  async dispose() {
    await this.requestContext.dispose();
  }
}