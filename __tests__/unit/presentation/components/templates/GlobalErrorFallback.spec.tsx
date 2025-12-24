import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { GlobalErrorFallback } from '../../../../../src/presentation/components/templates/GlobalErrorFallback';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';

  return TestWrapper;
};

describe('GlobalErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message and title', () => {
    render(
      <GlobalErrorFallback error={mockError} resetError={mockResetError} />,
      { wrapper: createTestWrapper() },
    );

    expect(screen.getByText('Ops! Algo deu errado')).toBeTruthy();
    expect(screen.getByText('Ocorreu um erro inesperado. Por favor, tente novamente.')).toBeTruthy();
  });

  it('should call resetError when retry button is pressed', () => {
    render(
      <GlobalErrorFallback error={mockError} resetError={mockResetError} />,
      { wrapper: createTestWrapper() },
    );

    const retryButton = screen.getByTestId('GlobalErrorFallback_RetryButton');
    fireEvent.press(retryButton);

    expect(mockResetError).toHaveBeenCalledTimes(1);
  });

  it('should display error details in development mode', () => {
    const originalDev = __DEV__;
    // @ts-ignore - Temporarily override __DEV__
    global.__DEV__ = true;

    render(
      <GlobalErrorFallback error={mockError} resetError={mockResetError} />,
      { wrapper: createTestWrapper() },
    );

    expect(screen.getByText('Test error message')).toBeTruthy();

    // @ts-ignore - Restore __DEV__
    global.__DEV__ = originalDev;
  });

  it('should not display error details in production mode', () => {
    const originalDev = __DEV__;
    // @ts-ignore - Temporarily override __DEV__
    global.__DEV__ = false;

    render(
      <GlobalErrorFallback error={mockError} resetError={mockResetError} />,
      { wrapper: createTestWrapper() },
    );

    // Error message should not be visible in production
    expect(screen.queryByText('Test error message')).toBeNull();

    // @ts-ignore - Restore __DEV__
    global.__DEV__ = originalDev;
  });

  it('should display stack trace in development mode when available', () => {
    const originalDev = __DEV__;
    // @ts-ignore - Temporarily override __DEV__
    global.__DEV__ = true;

    const errorWithStack = new Error('Error with stack');
    errorWithStack.stack = 'Error: Error with stack\n    at test.js:1:1';

    render(
      <GlobalErrorFallback error={errorWithStack} resetError={mockResetError} />,
      { wrapper: createTestWrapper() },
    );

    // Stack trace should be rendered (checking for part of it)
    const stackTraceElement = screen.getByText(/Error: Error with stack/);
    expect(stackTraceElement).toBeTruthy();

    // @ts-ignore - Restore __DEV__
    global.__DEV__ = originalDev;
  });
});

