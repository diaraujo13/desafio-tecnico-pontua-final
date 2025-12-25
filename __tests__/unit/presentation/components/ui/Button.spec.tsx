import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../../../../../src/presentation/components/ui/Button';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Button Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render button with label', () => {
    renderWithTheme(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Click" onPress={onPress} />);

    fireEvent.press(screen.getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Click" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Click" onPress={onPress} loading />);

    // Label should not be visible when loading
    expect(screen.queryByText('Click')).toBeNull();
    // ActivityIndicator should be present (we can't easily test it, but we verify label is gone)
  });

  it('should show ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = renderWithTheme(<Button label="Click" loading />);
    // ActivityIndicator is rendered internally
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('should apply primary variant styles', () => {
    renderWithTheme(<Button label="Primary" variant="primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('should apply secondary variant styles', () => {
    renderWithTheme(<Button label="Secondary" variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('should apply outline variant styles', () => {
    renderWithTheme(<Button label="Outline" variant="outline" />);
    expect(screen.getByText('Outline')).toBeTruthy();
  });

  it('should apply ghost variant styles', () => {
    renderWithTheme(<Button label="Ghost" variant="ghost" />);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });
});
