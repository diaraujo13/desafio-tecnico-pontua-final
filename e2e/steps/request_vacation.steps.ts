/**
 * Request Vacation Step Definitions
 *
 * Steps for vacation request flows.
 * Interacts ONLY with UI elements using Detox.
 */

/* eslint-disable testing-library/await-async-utils */
// Note: waitFor from Detox is different from React Testing Library's waitFor
// Detox's waitFor returns a promise that is properly awaited
import { Given, When, Then } from '@cucumber/cucumber';
import { by, element, waitFor } from 'detox';
import type { CustomWorld } from '../support/world';

/**
 * Given: Logged in as collaborator
 */
Given('que estou logado como colaborador', async function (this: CustomWorld) {
  // Navigate to login screen
  await waitFor(element(by.id('LoginScreen_EmailInput')))
    .toBeVisible()
    .withTimeout(5000);

  // Use demo account for collaborator
  await element(by.id('LoginScreen_DemoAccount_COLLABORATOR')).tap();
  await element(by.id('LoginScreen_LoginButton')).tap();

  // Wait for navigation away from login
  await waitFor(element(by.id('LoginScreen_EmailInput')))
    .not.toBeVisible()
    .withTimeout(5000);

  this.currentUserRole = 'COLLABORATOR';
});

/**
 * Given: On request vacation screen
 */
Given('estou na tela de solicitação de férias', async () => {
  // Navigate to request vacation screen from dashboard
  await element(by.id('DashboardScreen_RequestVacationButton')).tap();

  // Wait for the screen to be visible
  await waitFor(element(by.id('RequestVacationScreen_StartDateButton')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * When: Select start date
 * Note: Date picker interaction is platform-specific
 */
When('eu seleciono data de início {string}', async (_dateStr: string) => {
  // Tap the start date button to open picker
  await element(by.id('RequestVacationScreen_StartDateButton')).tap();

  // Date format: "10/03/2025" -> need to parse and set
  // This is simplified - actual implementation depends on DateTimePicker behavior
  // For Android, we might need to use UIAutomator
  // For iOS, we can interact with the picker directly

  // Wait for picker to appear (platform-specific)
  // Then interact with picker to select date
  // This is a placeholder - actual implementation requires platform-specific code
  await waitFor(element(by.id('RequestVacationScreen_StartDatePicker')))
    .toBeVisible()
    .withTimeout(2000);
});

/**
 * When: Select end date
 */
When('eu seleciono data de término {string}', async (_dateStr: string) => {
  // Tap the end date button to open picker
  await element(by.id('RequestVacationScreen_EndDateButton')).tap();

  // Similar to start date - platform-specific implementation needed
  await waitFor(element(by.id('RequestVacationScreen_EndDatePicker')))
    .toBeVisible()
    .withTimeout(2000);
});

/**
 * Then: Should see success message
 */
Then('eu devo ver a mensagem de sucesso', async () => {
  // Wait for success message to appear
  // The actual message text may vary, so we check for any success indicator
  await waitFor(element(by.text('Solicitação enviada com sucesso')))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * Then: Vacation should appear in history
 */
Then('a solicitação deve aparecer no meu histórico com status {string}', async (status: string) => {
  // Navigate to history screen (if not already there)
  // Check that the vacation request appears with the correct status
  // This is simplified - actual implementation needs to verify the list item
  await waitFor(element(by.text(status)))
    .toBeVisible()
    .withTimeout(5000);
});

/**
 * Then: Should see error about invalid dates
 */
Then('eu devo ver uma mensagem de erro sobre datas inválidas', async () => {
  // Check for error message related to date validation
  // The actual error message may vary based on DomainError
  await waitFor(element(by.text(/data|período|inválid/i)))
    .toBeVisible()
    .withTimeout(5000);
});
