/**
 * Authentication Step Definitions
 *
 * Steps for login/logout flows.
 * Interacts ONLY with UI elements using Detox.
 */

/* eslint-disable testing-library/await-async-utils */
// Note: waitFor from Detox is different from React Testing Library's waitFor
// Detox's waitFor returns a promise that is properly awaited
import { Given, When, Then } from '@cucumber/cucumber';
import { by, element, waitFor } from 'detox';

/**
 * Given: App is open
 */
Given('que o app está aberto', async () => {
  await waitFor(element(by.id('LoginScreen_EmailInput')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * When: Login with email and password
 */
When(
  'eu faço login com email {string} e senha {string}',
  async (email: string, password: string) => {
    // Type email
    await element(by.id('LoginScreen_EmailInput')).typeText(email);
    // Type password
    await element(by.id('LoginScreen_PasswordInput')).typeText(password);
    // Tap login button
    await element(by.id('LoginScreen_LoginButton')).tap();
  },
);

/**
 * When: Tap demo account
 */
When('eu toco na conta de demonstração {string}', async (role: string) => {
  await element(by.id(`LoginScreen_DemoAccount_${role}`)).tap();
});

/**
 * Then: Should see home screen
 */
Then('eu devo ver a tela inicial', async () => {
  // Wait for dashboard screen to be visible
  await waitFor(element(by.id('DashboardScreen_Container')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * Then: Should see error message
 */
Then('eu devo ver uma mensagem de erro', async () => {
  await waitFor(element(by.id('LoginScreen_ErrorText')))
    .toBeVisible()
    .withTimeout(5000);
});
