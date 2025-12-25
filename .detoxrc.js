/**
 * Detox Configuration (Root)
 *
 * This is the main Detox configuration file.
 * Detox looks for this file in the project root.
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
        avdName: 'Pixel_5_API_33',
      },
    },
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
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
