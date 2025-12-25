/**
 * Manager Dashboard Step Definitions
 *
 * Steps for manager approval/rejection flows.
 * Interacts ONLY with UI elements using Detox.
 */

/* eslint-disable testing-library/await-async-utils */
// Note: waitFor from Detox is different from React Testing Library's waitFor
// Detox's waitFor returns a promise that is properly awaited
import { Given, When, Then } from '@cucumber/cucumber';
import { by, element, waitFor } from 'detox';
import type { CustomWorld } from '../support/world';

/**
 * Given: Logged in as manager
 */
Given('que estou logado como gestor', async function (this: CustomWorld) {
  // Navigate to login screen
  await waitFor(element(by.id('LoginScreen_EmailInput')))
    .toBeVisible()
    .withTimeout(5000);

  // Use demo account for manager
  await element(by.id('LoginScreen_DemoAccount_MANAGER')).tap();
  await element(by.id('LoginScreen_LoginButton')).tap();

  // Wait for navigation away from login
  await waitFor(element(by.id('LoginScreen_EmailInput')))
    .not.toBeVisible()
    .withTimeout(5000);

  this.currentUserRole = 'MANAGER';
});

/**
 * When: Access dashboard
 */
When('eu acesso o dashboard', async () => {
  // Navigate to manager dashboard
  // Wait for the dashboard to be visible
  await waitFor(element(by.id('ManagerDashboardScreen_VacationsList')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * Then: Should see pending requests list
 */
Then('eu devo ver a lista de solicitações pendentes', async () => {
  // Verify the list is visible
  await waitFor(element(by.id('ManagerDashboardScreen_VacationsList')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * Given: There is a pending vacation request
 */
Given('existe uma solicitação de férias pendente', async function (this: CustomWorld) {
  // Navigate to dashboard
  await waitFor(element(by.id('ManagerDashboardScreen_VacationsList')))
    .toBeVisible()
    .withTimeout(5000);

  // Verify at least one pending request exists
  // This assumes the list has items - actual implementation may need to check list content
  // For now, we just ensure the list is visible
});

/**
 * When: Tap on pending request
 */
When('eu toco na solicitação pendente', async () => {
  // Tap on the first item in the pending vacations list
  // FlatList items are accessible via index
  // We'll use a more specific selector - tapping the first card
  // Note: This assumes cards are pressable - adjust based on actual implementation
  await element(by.id('ManagerDashboardScreen_VacationsList')).atIndex(0).tap();
});

/**
 * When: Fill rejection reason
 */
When('preencho o motivo {string}', async (reason: string) => {
  // Type reason in rejection modal
  await element(by.id('RejectionModal_ReasonInput')).typeText(reason);
});

/**
 * Then: Request should have status
 */
Then('a solicitação deve ter status {string}', async (status: string) => {
  // Verify the status is displayed
  // The actual implementation depends on how status is shown in the UI
  await waitFor(element(by.text(status)))
    .toBeVisible()
    .withTimeout(5000);
});
