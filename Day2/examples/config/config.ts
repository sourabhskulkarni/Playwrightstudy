import dotenv from 'dotenv';

dotenv.config();

export interface ConfigInterface {
  baseUrl: string;
  apiBaseUrl: string;
  browser: string;
  headless: boolean;
  slowMo: number;
  timeout: number;
  navigationTimeout: number;
  reportDir: string;
  screenshotOnFailure: boolean;
  logLevel: string;
}

class Config implements ConfigInterface {
  readonly baseUrl: string;
  readonly apiBaseUrl: string;
  readonly browser: string;
  readonly headless: boolean;
  readonly slowMo: number;
  readonly timeout: number;
  readonly navigationTimeout: number;
  readonly reportDir: string;
  readonly screenshotOnFailure: boolean;
  readonly logLevel: string;

  constructor() {
    this.baseUrl = process.env.BASE_URL || 'https://www.makemytrip.com/';
    this.apiBaseUrl = process.env.API_BASE_URL || 'https://api.makemytrip.com';
    this.browser = process.env.BROWSER || 'chromium';
    this.headless = process.env.HEADLESS !== 'false';
    this.slowMo = parseInt(process.env.SLOW_MO || '0', 10);
    this.timeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);
    this.navigationTimeout = parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10);
    this.reportDir = process.env.REPORT_DIR || './reports';
    this.screenshotOnFailure = process.env.SCREENSHOT_ON_FAILURE !== 'false';
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  validate(): void {
    if (!this.baseUrl) {
      throw new Error('BASE_URL is required');
    }
  }
}

export const config = new Config();
config.validate();
