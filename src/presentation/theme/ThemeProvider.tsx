import React, { createContext, useMemo, PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from './types';
import { lightTheme } from './light';
import { darkTheme } from './dark';

/**
 * Theme Context
 * Provides theme values to all child components
 */
const ThemeContext = createContext<Theme | undefined>(undefined);

/**
 * Theme Provider Component
 * Detects system color scheme and provides appropriate theme
 * Falls back to light theme if color scheme is null
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null

  const theme = useMemo(() => {
    // Fallback to light theme if colorScheme is null
    return colorScheme === 'dark' ? darkTheme : lightTheme;
  }, [colorScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme values
 * Must be used within ThemeProvider
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): Theme {
  const theme = React.useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
}
