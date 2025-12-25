import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Button label text
   */
  label: string;
  /**
   * Visual variant of the button
   */
  variant?: ButtonVariant;
  /**
   * Shows loading indicator and disables interaction
   */
  loading?: boolean;
  /**
   * Disables the button
   */
  disabled?: boolean;
  /**
   * Optional style override for container
   */
  style?: ViewStyle;
  /**
   * Optional style override for label text
   */
  labelStyle?: TextStyle;
  /**
   * Test ID for E2E testing
   */
  testID?: string;
}

/**
 * Button Component
 *
 * A reusable button component with multiple variants and loading/disabled states.
 * Consumes colors and spacing from the theme system.
 */
export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  style,
  labelStyle,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;
  const buttonStyles = getButtonStyles(variant, isDisabled, theme);
  const labelColor = getLabelColor(variant, isDisabled, theme);

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[buttonStyles.container, style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <Text variant="label" style={[{ color: labelColor }, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/**
 * Gets button container styles based on variant and state
 */
function getButtonStyles(
  variant: ButtonVariant,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>,
): { container: ViewStyle } {
  const { colors, spacing, borderRadius } = theme;

  const baseStyle: ViewStyle = {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  };

  switch (variant) {
    case 'primary':
      return {
        container: {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.primary,
          opacity: disabled ? 0.5 : 1,
        },
      };
    case 'secondary':
      return {
        container: {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.secondary,
          opacity: disabled ? 0.5 : 1,
        },
      };
    case 'outline':
      return {
        container: {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.border : colors.primary,
          opacity: disabled ? 0.5 : 1,
        },
      };
    case 'ghost':
      return {
        container: {
          ...baseStyle,
          backgroundColor: 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      };
    default:
      return {
        container: {
          ...baseStyle,
          backgroundColor: colors.primary,
        },
      };
  }
}

/**
 * Gets label text color based on variant and state
 */
function getLabelColor(
  variant: ButtonVariant,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>,
): string {
  const { colors } = theme;

  if (disabled) {
    return colors.textDisabled;
  }

  switch (variant) {
    case 'primary':
      return colors.textOnPrimary;
    case 'secondary':
      return colors.textOnSecondary;
    case 'outline':
    case 'ghost':
      return colors.primary;
    default:
      return colors.textOnPrimary;
  }
}
