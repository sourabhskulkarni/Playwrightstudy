/**
 * Home Page Step Definitions
 * 
 * Covers: features/home-page.feature
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { customWorld } from '../support/world';
import { HomePage } from '../pages/HomePage';
import { logger } from '../utils/logger';

Given('user is on MakeMyTrip homepage', 
    async function (this: customWorld) {
        this.homePage = new HomePage(this.page);
        await this.homePage.navigate();
        logger.info('User navigated to MakeMyTrip homepage');
    }
);

Then('user should be able to see login pop-up', 
    async function (this: customWorld) {
        await this.homePage.verifyloginpopupvisible();
        logger.info('Login pop-up is visible');
    }
);

When('user close the pop-up', 
    async function (this: customWorld) {
        await this.homePage.closeLoginPopup();
        logger.info('User closed the login pop-up');
    }
);

Then('user should see the Login or Create Account button', 
    async function (this: customWorld) {
        await this.homePage.verifyLoginOrCreateAccountButtonVisible();
        logger.info('Login or Create Account button is visible');
    }
);
