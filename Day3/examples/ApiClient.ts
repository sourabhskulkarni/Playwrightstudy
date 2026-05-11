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
    // MOCKED FOR LEARNING STATE: Returns a successful mock response
    return {
      status: () => 200,
      json: async () => ({ token: 'mock-jwt-token-12345' })
    } as any;
  }

  async searchFlights(params: {
    from: string;
    to: string;
    date: string;
    returnDate?: string;
    adults: number;
    class?: string;
  }) {
    // MOCKED FOR LEARNING STATE
    return {
      status: () => 200,
      json: async () => ({
        flights: [
          { id: 'FL123', airline: 'MockAir', price: 5000, departure: '10:00', arrival: '12:00' }
        ]
      })
    } as any;
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
    // MOCKED FOR LEARNING STATE
    return {
      status: () => 201,
      json: async () => ({
        bookingId: 'BKG' + Math.floor(Math.random() * 10000),
        status: 'confirmed'
      })
    } as any;
  }

  async getBookingDetails(bookingId: string) {
    // MOCKED FOR LEARNING STATE
    return {
      status: () => 200,
      json: async () => ({
        bookingId,
        status: 'confirmed',
        flightDetails: { id: 'FL123', airline: 'MockAir' }
      })
    } as any;
  }

  async cancelBooking(bookingId: string) {
    return {
      status: () => 200,
      json: async () => ({ success: true })
    } as any;
  }

  async getUserProfile() {
    return {
      status: () => 200,
      json: async () => ({
        name: 'testuser',
        bookings: ['BKG123']
      })
    } as any;
  }

  async dispose() {
    await this.requestContext.dispose();
  }
}