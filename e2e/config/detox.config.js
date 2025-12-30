/**
 * Detox Configuration
 *
 * Detox is a gray-box end-to-end testing framework for React Native.
 * This configuration sets up the test runner and device configurations.
 *
 * Note: Detox requires additional setup:
 * - Android: Requires Android SDK and emulator
 * - iOS: Requires Xcode and simulator
 * - Run `detox build` before first test execution
 */

module.exports = {
  testRunner: {
    args: {
      config: 'e2e/config/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/FeriasControlTemp.app',
      build:
        'cd ios && xcodebuild -workspace FeriasControlTemp.xcworkspace -scheme FeriasControlTemp -configuration Debug -sdk iphonesimulator -derivedDataPath ./build',
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Medium_Phone_API_35',
      },
    },
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 3rd Gen',
      },
    },
  },
  configurations: {
    'android.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'ios.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
  },
};
