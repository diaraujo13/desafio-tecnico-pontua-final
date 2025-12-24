import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../../../../../src/presentation/components/ui/EmptyState';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('EmptyState', () => {
  it('should render with title', () => {
    renderWithTheme(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('should render with description', () => {
    renderWithTheme(<EmptyState title="No data" description="Try again later" />);
    expect(screen.getByText('No data')).toBeTruthy();
    expect(screen.getByText('Try again later')).toBeTruthy();
  });

  it('should render with icon', () => {
    const { Text } = require('react-native');
    const icon = <Text>Icon</Text>;
    renderWithTheme(<EmptyState title="No data" icon={icon} />);
    expect(screen.getByText('No data')).toBeTruthy();
    expect(screen.getByText('Icon')).toBeTruthy();
  });

  it('should render action button when provided', () => {
    const action = {
      label: 'Retry',
      onPress: jest.fn(),
    };
    renderWithTheme(<EmptyState title="No data" action={action} />);
    const button = screen.getByText('Retry');
    expect(button).toBeTruthy();
  });

  it('should call action onPress when button is pressed', () => {
    const action = {
      label: 'Retry',
      onPress: jest.fn(),
    };
    renderWithTheme(<EmptyState title="No data" action={action} />);
    const button = screen.getByText('Retry');
    fireEvent.press(button);
    expect(action.onPress).toHaveBeenCalledTimes(1);
  });

  it('should apply testID', () => {
    renderWithTheme(<EmptyState title="No data" testID="empty-state" />);
    expect(screen.getByTestId('empty-state')).toBeTruthy();
  });

  it('should not render description when not provided', () => {
    renderWithTheme(<EmptyState title="No data" />);
    expect(screen.queryByText('Description')).toBeNull();
  });

  it('should not render action button when not provided', () => {
    renderWithTheme(<EmptyState title="No data" />);
    expect(screen.queryByText('Action')).toBeNull();
  });
});

