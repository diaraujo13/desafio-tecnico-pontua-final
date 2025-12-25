/**
 * Cucumber Hooks
 *
 * BeforeAll / AfterAll hooks for E2E test lifecycle management.
 * Handles app launch, cleanup, and world state reset.
 *
 * IMPORTANT: Detox must be initialized before these hooks run.
 * This is done in e2e/support/init.ts
 */

import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { device } from 'detox';
import type { CustomWorld } from './world';

/**
 * Before all tests: Launch the app
 * Note: Detox.init() must be called before this (in init.ts)
 */
BeforeAll({ timeout: 120000 }, async () => {
  console.log('Launching app for E2E tests...');
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
  });
  console.log('App launched successfully');
});

/**
 * After all tests: Clean up
 */
AfterAll(async () => {
  console.log('E2E tests completed');
  // Detox handles cleanup automatically
});

/**
 * Before each scenario: Reset app state
 */
Before(async function (this: CustomWorld) {
  // Reset world state
  this.reset();

  // Reload app to ensure clean state
  await device.reloadReactNative();
});

/**
 * After each scenario: Clean up any test data if needed
 */
After(async function (this: CustomWorld) {
  // Reset world state for next scenario
  this.reset();
});
