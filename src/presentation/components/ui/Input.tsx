import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Error message displayed below the input (when present, shows error state)
   */
  errorMessage?: string;
  /**
   * Optional left icon component
   */
  leftIcon?: React.ReactNode;
  /**
   * Optional right icon component
   */
  rightIcon?: React.ReactNode;
  /**
   * Optional style override for container
   */
  containerStyle?: ViewStyle;
  /**
   * Optional style override for input
   */
  inputStyle?: TextStyle;
}

/**
 * Input Component
 *
 * A reusable text input component integrated with the design system.
 * Supports label, error message, and left/right icons.
 * Handles focus state styling automatically.
 */
export function Input({
  label,
  errorMessage,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!errorMessage;
  const borderColor = hasError
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.regular,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {errorMessage && (
        <Text variant="caption" style={[styles.errorText, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    marginTop: 4,
  },
  input: {
    flex: 1,
    margin: 0,
    padding: 0, // Remove default padding
  },
  inputContainer: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
  },
  label: {
    marginBottom: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
