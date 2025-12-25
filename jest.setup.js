/**
 * Jest Setup File
 *
 * Global mocks and configuration for all unit tests.
 * This file runs before every test file.
 */

// Mock React Native AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(storage[key] || null)),
      setItem: jest.fn((key, value) => {
        storage[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete storage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(storage).forEach((key) => delete storage[key]);
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
      multiGet: jest.fn((keys) => Promise.resolve(keys.map((key) => [key, storage[key] || null]))),
      multiSet: jest.fn((pairs) => {
        pairs.forEach(([key, value]) => {
          storage[key] = value;
        });
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys) => {
        keys.forEach((key) => delete storage[key]);
        return Promise.resolve();
      }),
    },
  };
});

// Mock React Native Keychain
jest.mock('react-native-keychain', () => ({
  __esModule: true,
  default: {
    setGenericPassword: jest.fn(() => Promise.resolve(true)),
    getGenericPassword: jest.fn(() => Promise.resolve(false)),
    resetGenericPassword: jest.fn(() => Promise.resolve(true)),
    setInternetCredentials: jest.fn(() => Promise.resolve(true)),
    getInternetCredentials: jest.fn(() => Promise.resolve(false)),
    resetInternetCredentials: jest.fn(() => Promise.resolve(true)),
  },
}));

// Mock React Native Safe Area Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { createContext } = React;

  // Create a mock context for SafeAreaProviderCompat
  const SafeAreaContext = createContext({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  // eslint-disable-next-line react/prop-types
  const SafeAreaProvider = ({ children }) => {
    return (
      <SafeAreaContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        {children}
      </SafeAreaContext.Provider>
    );
  };

  return {
    __esModule: true,
    SafeAreaProvider,

    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    SafeAreaContext,
  };
});

// Mock React Native Screens
jest.mock('react-native-screens', () => ({
  __esModule: true,
  enableScreens: jest.fn(),
  enableFreeze: jest.fn(),
  screensEnabled: jest.fn(() => true),
}));

// Mock React Navigation Elements (used by Native Stack Navigator)
// SafeAreaProviderCompat needs SafeAreaContext from react-native-safe-area-context
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  // Import the mocked SafeAreaContext
  const { SafeAreaContext } = require('react-native-safe-area-context');

  return {
    __esModule: true,
    // eslint-disable-next-line react/prop-types
    SafeAreaProviderCompat: ({ children }) => {
      // Provide the SafeAreaContext that SafeAreaProviderCompat expects
      return (
        <SafeAreaContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          {children}
        </SafeAreaContext.Provider>
      );
    },
  };
});

// Mock React Navigation
// Note: Tests can override these mocks by calling jest.mock() again in the test file
// This provides sensible defaults for tests that don't set up navigation explicitly
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const actualNav = jest.requireActual('@react-navigation/native');

  // Create mock functions that can be overridden by tests
  const mockUseNavigation = jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => false),
    getParent: jest.fn(),
    getState: jest.fn(),
    reset: jest.fn(),
  }));

  // Don't mock useRoute globally - let tests that use NavigationContainer get real route params
  // Tests that need mocked useRoute should define it in the test file
  // This allows NavigationContainer with initialParams to work correctly

  return {
    ...actualNav,
    useNavigation: mockUseNavigation,
    // Keep useRoute real so NavigationContainer can provide params via initialParams
    useRoute: actualNav.useRoute,
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        callback();
      }, []);
    }),
    // Keep NavigationContainer real so tests can use it with initialParams
    NavigationContainer: actualNav.NavigationContainer,
  };
});

// Mock React Navigation Native Stack
// This mock works with NavigationContainer by rendering components directly
// NavigationContainer will provide the navigation context via useRoute
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    __esModule: true,
    createNativeStackNavigator: () => ({
      // eslint-disable-next-line react/prop-types
      Navigator: ({ children }) => {
        return <>{children}</>;
      },
      // eslint-disable-next-line react/prop-types
      Screen: ({ component: Component, ...props }) => {
        if (!Component) {
          return null;
        }
        // Pass all props to the component, including initialParams
        // NavigationContainer will provide route params via useRoute hook
        return <Component {...props} />;
      },
    }),
  };
});

// Suppress console warnings in tests (optional - can be removed if you want to see warnings)
// Only suppress in test environment, keep errors visible
if (process.env.NODE_ENV === 'test') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress specific warnings that are expected in tests
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('act(...)') || message.includes('Warning: ReactDOM.render'))
    ) {
      return;
    }
    originalWarn(...args);
  };
}
