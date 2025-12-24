/**
 * @format
 */

import { AppRegistry, ErrorUtils } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Global error handler for unhandled promise rejections
// React Native's ErrorUtils can catch these and route them to error boundaries
if (ErrorUtils) {
  const originalHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Log unhandled errors
    if (__DEV__) {
      console.error('Unhandled Error:', error, 'Fatal:', isFatal);
    }

    // In production, you would send this to a crash reporting service
    // Example: Sentry.captureException(error);

    // Call original handler to maintain default behavior
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

// Handle unhandled promise rejections (if supported by the JS engine)
if (typeof global !== 'undefined' && global.Promise) {
  const originalUnhandledRejection = global.onunhandledrejection;

  global.onunhandledrejection = (event) => {
    if (__DEV__) {
      console.error('Unhandled Promise Rejection:', event.reason);
    }

    // In production, you would send this to a crash reporting service
    // Example: Sentry.captureException(event.reason);

    // Call original handler if it exists
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };
}

AppRegistry.registerComponent(appName, () => App);
