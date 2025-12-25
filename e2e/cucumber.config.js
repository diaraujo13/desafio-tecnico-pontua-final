/**
 * Cucumber Configuration
 *
 * Configuration for running Cucumber tests with Detox.
 */

module.exports = {
  default: {
    require: ['e2e/support/**/*.ts', 'e2e/steps/**/*.ts'],
    format: [
      'progress-bar',
      'json:e2e/reports/cucumber-report.json',
      'html:e2e/reports/cucumber-report.html',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    publishQuiet: true,
    worldParameters: {},
  },
};
