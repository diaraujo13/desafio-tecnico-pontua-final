/**
 * Jest Configuration for E2E Tests
 *
 * Note: Cucumber is run directly via CLI, not through Jest.
 * This config is kept for potential future Jest-based E2E tests.
 */

module.exports = {
  rootDir: '..',
  testTimeout: 120000,
  maxWorkers: 1,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: false,
};
