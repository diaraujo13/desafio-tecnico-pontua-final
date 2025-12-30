/**
 * Common Step Definitions
 *
 * Shared steps used across multiple feature files.
 * These steps must be unique globally to avoid Cucumber ambiguity errors.
 */

import { When } from '@cucumber/cucumber';
import { by, element } from 'detox';

/**
 * When: Tap on a button by text label
 *
 * Maps button text to testID for E2E testing.
 * This step is shared across all feature files to avoid duplication.
 */
When('toco no botão {string}', async (buttonText: string) => {
  // Consolidated button mapping for all screens
  const buttonMap: Record<string, string> = {
    // Login screen
    Entrar: 'LoginScreen_LoginButton',
    // Request vacation screen
    'Enviar solicitação': 'RequestVacationScreen_SubmitButton',
    // Review vacation screen
    Aprovar: 'ReviewVacationScreen_ApproveButton',
    Rejeitar: 'ReviewVacationScreen_RejectButton',
    // Rejection modal
    Confirmar: 'RejectionModal_ConfirmButton',
    // Dashboard screen
    'Solicitar Férias': 'DashboardScreen_RequestVacationButton',
    'Ver histórico': 'DashboardScreen_ViewHistoryButton',
    'Ver pendências': 'DashboardScreen_ViewPendingButton',
    Sair: 'DashboardScreen_LogoutButton',
  };

  const testID = buttonMap[buttonText];
  if (!testID) {
    throw new Error(
      `Button "${buttonText}" not found in button map. Available buttons: ${Object.keys(buttonMap).join(', ')}`,
    );
  }

  await element(by.id(testID)).tap();
});
