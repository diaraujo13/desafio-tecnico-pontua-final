import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { ThemeProvider } from './src/presentation/theme/ThemeProvider';
import { QueryProvider } from './src/presentation/providers/QueryProvider';
import { AuthProvider } from './src/presentation/contexts/AuthContext';
import { ErrorBoundary } from './src/presentation/components/templates/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error for external service (stub for now)
        // In production, this would send to Sentry, Crashlytics, etc.
        if (__DEV__) {
          console.error('Global Error:', error, errorInfo);
        }
      }}
    >
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  // const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <RootNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
