import { Theme } from './types';
import { tokens } from './tokens';

/**
 * Light Theme
 * Maps primitive tokens to semantic roles for light mode
 */
export const lightTheme: Theme = {
  colors: {
    // Background colors
    background: tokens.colors.neutral[0], // White
    surface: tokens.colors.neutral[50], // Very light gray
    surfaceVariant: tokens.colors.neutral[100], // Light gray

    // Text colors
    textPrimary: tokens.colors.neutral[900], // Dark gray/black
    textSecondary: tokens.colors.neutral[500], // Medium gray
    textDisabled: tokens.colors.neutral[500], // Medium gray
    textOnPrimary: tokens.colors.neutral[0], // White
    textOnSecondary: tokens.colors.neutral[0], // White

    // Primary colors
    primary: tokens.colors.primary[500], // Blue
    primaryVariant: tokens.colors.primary[700], // Darker blue
    onPrimary: tokens.colors.neutral[0], // White

    // Secondary colors (using neutral for now, can be customized)
    secondary: tokens.colors.neutral[500], // Medium gray
    secondaryVariant: tokens.colors.neutral[900], // Dark gray
    onSecondary: tokens.colors.neutral[0], // White

    // Status colors
    statusPending: tokens.colors.status.pending,
    statusApproved: tokens.colors.status.approved,
    statusRejected: tokens.colors.status.rejected,
    statusCancelled: tokens.colors.status.cancelled,

    // Semantic colors
    success: tokens.colors.semantic.success,
    error: tokens.colors.semantic.error,
    warning: tokens.colors.semantic.warning,
    info: tokens.colors.semantic.info,

    // Border colors
    border: tokens.colors.neutral[100], // Light gray
    borderLight: tokens.colors.neutral[50], // Very light gray
  },

  spacing: tokens.spacing,
  borderRadius: tokens.borderRadius,
  typography: tokens.typography,
  shadows: tokens.shadows,
};


