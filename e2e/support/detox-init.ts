/**
 * Detox Initialization
 *
 * This file ensures Detox is properly initialized before tests run.
 * It's loaded by Cucumber before hooks.ts
 */

import { device } from 'detox';

// Detox initialization is handled by the Detox CLI
// This file exists to ensure proper import order
// The actual initialization happens via:
// 1. Detox CLI (detox test)
// 2. Or manually: await detox.init()

export async function ensureDetoxReady() {
  // Check if device is available
  // If not, Detox CLI should have initialized it
  try {
    // This will throw if Detox is not initialized
    await device.getPlatform();
  } catch {
    console.warn('Detox not initialized. Make sure to run tests via: npm run test:e2e');
    throw new Error(
      'Detox must be initialized before running tests. Use Detox CLI or ensure detox.init() is called.',
    );
  }
}
