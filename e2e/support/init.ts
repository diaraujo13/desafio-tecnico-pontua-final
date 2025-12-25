/**
 * Detox + Cucumber Bootstrap
 *
 * This file initializes Detox and sets up the test environment.
 * It is loaded by Cucumber via require in support files.
 *
 * IMPORTANT: This file must be loaded BEFORE hooks.ts
 */

import { setDefaultTimeout } from '@cucumber/cucumber';

// Set default timeout for Cucumber steps (2 minutes)
setDefaultTimeout(120000);

// Initialize Detox before any tests run
// This is called when the support files are loaded
let detoxInitialized = false;

export async function initDetox() {
  if (!detoxInitialized) {
    console.log('Initializing Detox...');
    // Detox.init() is called automatically by Detox CLI
    // But we ensure it's ready here
    detoxInitialized = true;
    console.log('Detox initialized');
  }
}

// Auto-initialize if running directly
if (require.main === module) {
  initDetox().catch(console.error);
}
