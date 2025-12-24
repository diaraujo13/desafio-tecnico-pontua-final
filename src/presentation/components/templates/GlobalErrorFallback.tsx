import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { tokens } from '../../theme/tokens';
import { lightTheme } from '../../theme/light';
import { darkTheme } from '../../theme/dark';

export interface GlobalErrorFallbackProps {
  /**
   * Error object that caused the crash
   */
  error: Error;
  /**
   * Function to reset the error boundary state
   */
  resetError: () => void;
}

/**
 * GlobalErrorFallback Component
 *
 * A user-friendly fallback UI displayed when a fatal error occurs.
 * Uses native React Native components (Text, TouchableOpacity) instead of
 * Design System components to avoid dependency on ThemeProvider context.
 * This ensures the fallback works even if ThemeProvider or other contexts fail.
 * Provides option to retry/restart the application.
 */
export function GlobalErrorFallback({ error, resetError }: GlobalErrorFallbackProps) {
  // Use useColorScheme directly instead of useTheme to avoid dependency on ThemeProvider
  // This ensures the fallback works even if ThemeProvider fails
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const handleRetry = () => {
    resetError();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Ops! Algo deu errado
        </Text>

        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </Text>

        {__DEV__ && (
          <View style={[styles.errorDetails, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error.message}</Text>
            {error.stack && (
              <Text style={[styles.stackTrace, { color: theme.colors.textSecondary }]}>
                {error.stack}
              </Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleRetry}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            testID="GlobalErrorFallback_RetryButton"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tentar Novamente"
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.textOnPrimary }]}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorDetails: {
    borderRadius: tokens.borderRadius.md,
    marginBottom: tokens.spacing.lg,
    padding: tokens.spacing.md,
    width: '100%',
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: tokens.typography.fontSize.sm,
    marginBottom: tokens.spacing.sm,
  },
  message: {
    fontSize: tokens.typography.fontSize.base,
    lineHeight: tokens.typography.fontSize.base * tokens.typography.lineHeight.normal,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: tokens.borderRadius.md,
    minHeight: 44,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    width: '100%',
  },
  retryButtonText: {
    fontFamily: tokens.typography.fontFamily.medium,
    fontSize: tokens.typography.fontSize.base,
    textAlign: 'center',
  },
  stackTrace: {
    fontFamily: 'monospace',
    fontSize: tokens.typography.fontSize.xs,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.bold,
    fontSize: tokens.typography.fontSize['3xl'],
    lineHeight: tokens.typography.fontSize['3xl'] * tokens.typography.lineHeight.tight,
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
  },
});
