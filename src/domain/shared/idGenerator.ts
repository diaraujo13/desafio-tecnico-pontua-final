/**
 * Simple ID generator for React Native
 * Uses timestamp + random number to generate unique IDs
 * This is a lightweight alternative to uuid that works in React Native
 */

/**
 * Generates a unique ID
 * Format: timestamp-randomNumber
 * Example: 1704067200000-0.123456789
 */
export function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random();
  return `${timestamp}-${random}`;
}
