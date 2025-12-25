import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Input } from '../../../../../src/presentation/components/ui/Input';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Input Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render input without label', () => {
    renderWithTheme(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render input with label', () => {
    renderWithTheme(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('should display error message when provided', () => {
    renderWithTheme(<Input label="Email" errorMessage="Invalid email format" />);
    expect(screen.getByText('Invalid email format')).toBeTruthy();
  });

  it('should handle text input', () => {
    const onChangeText = jest.fn();
    renderWithTheme(<Input placeholder="Enter text" onChangeText={onChangeText} />);

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('should handle focus events', () => {
    const onFocus = jest.fn();
    renderWithTheme(<Input placeholder="Enter text" onFocus={onFocus} />);

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should handle blur events', () => {
    const onBlur = jest.fn();
    renderWithTheme(<Input placeholder="Enter text" onBlur={onBlur} />);

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should render with left icon', () => {
    const LeftIcon = () => <></>;
    renderWithTheme(<Input placeholder="Enter text" leftIcon={<LeftIcon />} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const RightIcon = () => <></>;
    renderWithTheme(<Input placeholder="Enter text" rightIcon={<RightIcon />} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });
});
