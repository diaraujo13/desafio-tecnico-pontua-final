/**
 * Utility functions for simulating network latency and errors
 * Used by in-memory repositories to mimic real API behavior
 */

/**
 * Simulates a network request with optional delay and error simulation
 * @param data - The data to return on success
 * @param ms - Delay in milliseconds (default: 800ms)
 * @param shouldFail - Whether to simulate a failure (default: false)
 * @returns A Promise that resolves with the data after the delay, or rejects if shouldFail is true
 */
export async function simulateRequest<T>(
  data: T,
  ms: number = 800,
  shouldFail: boolean = false
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Simulated network error'));
      } else {
        resolve(data);
      }
    }, ms);
  });
}

/**
 * Simulates a network error with delay
 * @param message - Error message (default: 'Network error')
 * @param ms - Delay in milliseconds (default: 800ms)
 * @returns A Promise that rejects with an error after the delay
 */
export async function simulateError(
  message: string = 'Network error',
  ms: number = 800
): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
}
