import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Skeleton } from '../../../../../src/presentation/components/ui/Skeleton';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Skeleton', () => {
  it('should render with default props', () => {
    renderWithTheme(<Skeleton testID="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });

  it('should apply custom width and height', () => {
    renderWithTheme(<Skeleton width={100} height={50} testID="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });

  it('should apply custom borderRadius', () => {
    renderWithTheme(<Skeleton borderRadius={8} testID="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });

  it('should apply testID', () => {
    renderWithTheme(<Skeleton testID="test-skeleton" />);
    expect(screen.getByTestId('test-skeleton')).toBeTruthy();
  });

  it('should accept percentage width', () => {
    renderWithTheme(<Skeleton width="50%" testID="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });
});
