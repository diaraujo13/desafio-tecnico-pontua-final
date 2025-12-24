import { tokens } from './tokens';

/**
 * Theme Type Definition
 * Defines the structure of a theme with semantic color roles
 */
export interface Theme {
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;

    // Text colors
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textOnPrimary: string;
    textOnSecondary: string;

    // Primary colors
    primary: string;
    primaryVariant: string;
    onPrimary: string;

    // Secondary colors
    secondary: string;
    secondaryVariant: string;
    onSecondary: string;

    // Status colors
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
    statusCancelled: string;

    // Semantic colors
    success: string;
    error: string;
    warning: string;
    info: string;

    // Border colors
    border: string;
    borderLight: string;
  };

  spacing: typeof tokens.spacing;
  borderRadius: typeof tokens.borderRadius;
  typography: typeof tokens.typography;
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}


