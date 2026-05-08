/**
 * Test Data Management
 * Corporate standard for managing test data across scenarios
 */

export interface Passenger {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface FlightSearchCriteria {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  tripType: 'OneWay' | 'RoundTrip';
}

export interface FareDetails {
  fareType: 'Regular' | 'Special';
  baseFare: number;
  taxes: number;
  totalFare: number;
}

export interface BookingDetails {
  flightSearchCriteria: FlightSearchCriteria;
  passengers: Passenger[];
  seatPreference?: string;
  mealPreference?: string[];
}

export class TestDataBuilder {
  private searchCriteria: FlightSearchCriteria;
  private passengers: Passenger[] = [];

  constructor() {
    this.searchCriteria = this.getDefaultSearchCriteria();
  }

  private getDefaultSearchCriteria(): FlightSearchCriteria {
    return {
      fromCity: 'Delhi',
      toCity: 'Mumbai',
      departureDate: this.getFormattedDate(0),
      returnDate: this.getFormattedDate(5),
      adults: 1,
      children: 0,
      cabinClass: 'Economy',
      tripType: 'RoundTrip',
    };
  }

  private getFormattedDate(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  withSearchCriteria(criteria: Partial<FlightSearchCriteria>): TestDataBuilder {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    return this;
  }

  withPassenger(passenger: Passenger): TestDataBuilder {
    this.passengers.push(passenger);
    return this;
  }

  withDefaultPassengers(count: number = 1): TestDataBuilder {
    for (let i = 0; i < count; i++) {
      this.passengers.push({
        name: `Traveler ${i + 1}`,
        email: `traveler${i + 1}@corporate.com`,
        phone: `98765432${String(i).padStart(2, '0')}`,
      });
    }
    return this;
  }

  build(): BookingDetails {
    return {
      flightSearchCriteria: this.searchCriteria,
      passengers: this.passengers.length > 0 ? this.passengers : this.getDefaultPassengers(),
    };
  }

  private getDefaultPassengers(): Passenger[] {
    return [
      {
        name: 'John Doe',
        email: 'john.doe@corporate.com',
        phone: '9876543210',
        gender: 'Male',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@corporate.com',
        phone: '9876543211',
        gender: 'Female',
      },
    ];
  }

  static getDefaultBookingData(): BookingDetails {
    return new TestDataBuilder().build();
  }

  static roundTripDelhi(): BookingDetails {
    return new TestDataBuilder()
      .withSearchCriteria({
        fromCity: 'Delhi',
        toCity: 'Mumbai',
        tripType: 'RoundTrip',
        adults: 2,
        children: 1,
      })
      .withDefaultPassengers(2)
      .build();
  }

  static oneWayBangalore(): BookingDetails {
    return new TestDataBuilder()
      .withSearchCriteria({
        fromCity: 'Bangalore',
        toCity: 'Goa',
        tripType: 'OneWay',
        adults: 1,
      })
      .withDefaultPassengers(1)
      .build();
  }
}
