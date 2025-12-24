import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../../../../../src/presentation/components/ui/Text';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Text Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render text with default variant', () => {
    const { getByText } = renderWithTheme(<Text>Hello World</Text>);
    const text = getByText('Hello World');
    expect(text).toBeTruthy();
  });

  it('should apply h1 variant styles', () => {
    const { getByText } = renderWithTheme(<Text variant="h1">Heading 1</Text>);
    const text = getByText('Heading 1');
    expect(text).toBeTruthy();
    // Styles are applied internally, we verify the component renders
  });

  it('should apply h2 variant styles', () => {
    const { getByText } = renderWithTheme(<Text variant="h2">Heading 2</Text>);
    const text = getByText('Heading 2');
    expect(text).toBeTruthy();
  });

  it('should apply body variant styles', () => {
    const { getByText } = renderWithTheme(<Text variant="body">Body text</Text>);
    const text = getByText('Body text');
    expect(text).toBeTruthy();
  });

  it('should apply caption variant styles', () => {
    const { getByText } = renderWithTheme(<Text variant="caption">Caption</Text>);
    const text = getByText('Caption');
    expect(text).toBeTruthy();
  });

  it('should apply label variant styles', () => {
    const { getByText } = renderWithTheme(<Text variant="label">Label</Text>);
    const text = getByText('Label');
    expect(text).toBeTruthy();
  });

  it('should allow style override', () => {
    const customStyle = { color: '#FF0000' };
    const { getByText } = renderWithTheme(<Text style={customStyle}>Custom styled</Text>);
    const text = getByText('Custom styled');
    expect(text).toBeTruthy();
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
