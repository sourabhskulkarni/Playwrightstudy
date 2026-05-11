import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext } from '@playwright/test';

export class Day3World extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public apiContext!: APIRequestContext;
  
  // State for assertions
  public lastResponse: any;
  public lastData: any;
  public domLoadTime: number = 0;
  public fullLoadTime: number = 0;
  public resourceCounts = { images: 0, js: 0, css: 0 };
  public lcpTime: number = 0;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(Day3World);
