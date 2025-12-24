import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from '../../../../src/presentation/theme/ThemeProvider';

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const theme = useTheme();
    return <Text testID="theme-test">{theme.colors.background}</Text>;
  };

  it('should provide theme to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const text = screen.getByTestId('theme-test');
    expect(text).toBeTruthy();
  });

  it('should throw error when useTheme is used outside Provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('should provide light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const text = screen.getByTestId('theme-test');
    // Light theme background should be white (#FFFFFF)
    expect(text.props.children).toBe('#FFFFFF');
  });
});

describe('useTheme hook', () => {
  it('should return theme object with all required properties', () => {
    const TestComponent = () => {
      const theme = useTheme();
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('borderRadius');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('shadows');
      expect(theme.colors).toHaveProperty('background');
      expect(theme.colors).toHaveProperty('textPrimary');
      expect(theme.colors).toHaveProperty('primary');
      return null;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });
});
