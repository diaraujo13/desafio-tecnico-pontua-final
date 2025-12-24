import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../../../../src/presentation/components/ui/Input';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Input Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render input without label', () => {
    const { getByPlaceholderText } = renderWithTheme(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render input with label', () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <Input label="Email" placeholder="Enter email" />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('should display error message when provided', () => {
    const { getByText } = renderWithTheme(
      <Input label="Email" errorMessage="Invalid email format" />
    );
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  it('should handle text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('should handle focus events', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" onFocus={onFocus} />
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should handle blur events', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" onBlur={onBlur} />
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should render with left icon', () => {
    const LeftIcon = () => <></>;
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" leftIcon={<LeftIcon />} />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const RightIcon = () => <></>;
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" rightIcon={<RightIcon />} />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });
});
