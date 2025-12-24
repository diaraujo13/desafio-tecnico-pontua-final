import { Theme } from './types';
import { tokens } from './tokens';

/**
 * Dark Theme
 * Maps primitive tokens to semantic roles for dark mode
 */
export const darkTheme: Theme = {
  colors: {
    // Background colors
    background: tokens.colors.neutral[900], // Dark gray/black
    surface: '#2C2C2C', // Slightly lighter than background
    surfaceVariant: '#3A3A3A', // Medium dark gray

    // Text colors
    textPrimary: tokens.colors.neutral[0], // White
    textSecondary: tokens.colors.neutral[500], // Medium gray
    textDisabled: tokens.colors.neutral[500], // Medium gray
    textOnPrimary: tokens.colors.neutral[0], // White
    textOnSecondary: tokens.colors.neutral[0], // White

    // Primary colors
    primary: tokens.colors.primary[500], // Blue (same as light)
    primaryVariant: tokens.colors.primary[100], // Lighter blue for dark mode
    onPrimary: tokens.colors.neutral[0], // White

    // Secondary colors
    secondary: tokens.colors.neutral[500], // Medium gray
    secondaryVariant: tokens.colors.neutral[100], // Light gray
    onSecondary: tokens.colors.neutral[900], // Dark gray/black

    // Status colors (same as light, but could be adjusted for better contrast)
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
    border: '#404040', // Dark gray border
    borderLight: '#2C2C2C', // Very dark border
  },

  spacing: tokens.spacing,
  borderRadius: tokens.borderRadius,
  typography: tokens.typography,
  shadows: {
    ...tokens.shadows,
    sm: {
      ...tokens.shadows.sm,
      shadowColor: '#000',
      shadowOpacity: 0.3,
    },
    md: {
      ...tokens.shadows.md,
      shadowColor: '#000',
      shadowOpacity: 0.4,
    },
  },
};
