import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../../presentation/theme/ThemeProvider';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom QueryClient instance
   * If not provided, creates a new one with test-friendly defaults
   */
  queryClient?: QueryClient;
  /**
   * Whether to include NavigationContainer
   * Default: true
   */
  includeNavigation?: boolean;
  /**
   * Whether to include SafeAreaProvider
   * Default: true
   */
  includeSafeArea?: boolean;
}

/**
 * Canonical render function with all necessary providers
 *
 * Default behavior:
 * - NO AuthProvider (authentication must be mocked via useAuth)
 * - Includes Theme, Navigation, QueryClient, SafeArea
 * - Auth is opt-in, never default
 *
 * @example
 * ```tsx
 * // Mock useAuth before using renderWithProviders
 * jest.mock('@/presentation/hooks/useAuth');
 *
 * const { getByTestId } = renderWithProviders(<LoginScreen />);
 * ```
 */
export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const {
    queryClient: customQueryClient,
    includeNavigation = true,
    includeSafeArea = true,
    ...renderOptions
  } = options;

  // Create QueryClient with test-friendly defaults if not provided
  const queryClient =
    customQueryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    let content = <>{children}</>;

    // Wrap in providers in order (outermost to innermost)
    content = <ThemeProvider>{content}</ThemeProvider>;

    if (includeNavigation) {
      content = <NavigationContainer>{content}</NavigationContainer>;
    }

    if (includeSafeArea) {
      content = <SafeAreaProvider>{content}</SafeAreaProvider>;
    }

    return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
