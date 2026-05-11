import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { ApiClient } from '../ApiClient';
import { DatabaseHelper } from '../DatabaseHelper';

export class Day4World extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  
  public apiClient!: ApiClient;
  public dbHelper!: DatabaseHelper;

  // Shared state
  public travellerDetails: any;
  public userId!: number;
  public dbBookingId!: number;
  public apiBookingId!: string;
  public flightsList: any[] = [];
  
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(Day4World);
