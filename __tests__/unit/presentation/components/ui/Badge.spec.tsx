import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '../../../../../src/presentation/components/ui/Badge';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Badge', () => {
  it('should render with label', () => {
    renderWithTheme(<Badge label="Test Badge" />);
    expect(screen.getByText('Test Badge')).toBeTruthy();
  });

  it('should render with success variant', () => {
    renderWithTheme(<Badge label="Success" variant="success" />);
    const badge = screen.getByText('Success').parent;
    expect(badge).toBeTruthy();
  });

  it('should render with error variant', () => {
    renderWithTheme(<Badge label="Error" variant="error" />);
    const badge = screen.getByText('Error').parent;
    expect(badge).toBeTruthy();
  });

  it('should render with warning variant', () => {
    renderWithTheme(<Badge label="Warning" variant="warning" />);
    const badge = screen.getByText('Warning').parent;
    expect(badge).toBeTruthy();
  });

  it('should render with info variant (default)', () => {
    renderWithTheme(<Badge label="Info" />);
    const badge = screen.getByText('Info').parent;
    expect(badge).toBeTruthy();
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 };
    renderWithTheme(<Badge label="Test" style={customStyle} />);
    // Component should render without errors when custom style is provided
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('should apply testID', () => {
    renderWithTheme(<Badge label="Test" testID="test-badge" />);
    expect(screen.getByTestId('test-badge')).toBeTruthy();
  });
});

