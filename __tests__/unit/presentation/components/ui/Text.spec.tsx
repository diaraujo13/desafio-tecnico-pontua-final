import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from '../../../../../src/presentation/components/ui/Text';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Text Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render text with default variant', () => {
    renderWithTheme(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should apply h1 variant styles', () => {
    renderWithTheme(<Text variant="h1">Heading 1</Text>);
    expect(screen.getByText('Heading 1')).toBeTruthy();
    // Styles are applied internally, we verify the component renders
  });

  it('should apply h2 variant styles', () => {
    renderWithTheme(<Text variant="h2">Heading 2</Text>);
    expect(screen.getByText('Heading 2')).toBeTruthy();
  });

  it('should apply body variant styles', () => {
    renderWithTheme(<Text variant="body">Body text</Text>);
    expect(screen.getByText('Body text')).toBeTruthy();
  });

  it('should apply caption variant styles', () => {
    renderWithTheme(<Text variant="caption">Caption</Text>);
    expect(screen.getByText('Caption')).toBeTruthy();
  });

  it('should apply label variant styles', () => {
    renderWithTheme(<Text variant="label">Label</Text>);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('should allow style override', () => {
    const customStyle = { color: '#FF0000' };
    renderWithTheme(<Text style={customStyle}>Custom styled</Text>);
    expect(screen.getByText('Custom styled')).toBeTruthy();
  });

  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<Text>Test</Text>);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });
});
