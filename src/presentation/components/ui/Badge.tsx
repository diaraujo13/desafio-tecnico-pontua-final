import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info';

export interface BadgeProps {
  /**
   * Badge label text
   */
  label: string;
  /**
   * Visual variant of the badge
   */
  variant?: BadgeVariant;
  /**
   * Optional style override for container
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Badge Component
 *
 * A reusable badge component for displaying status or labels.
 * Uses semantic colors from the theme system.
 */
export function Badge({ label, variant = 'info', style, testID }: BadgeProps) {
  const theme = useTheme();

  const badgeStyles = getBadgeStyles(variant, theme);
  const textColor = getTextColor(variant, theme);

  return (
    <View style={[styles.container, badgeStyles, style]} testID={testID}>
      <Text variant="caption" style={[styles.text, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Gets badge container styles based on variant
 */
function getBadgeStyles(variant: BadgeVariant, theme: ReturnType<typeof useTheme>): ViewStyle {
  const { colors, spacing, borderRadius } = theme;

  const baseStyle: ViewStyle = {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  };

  switch (variant) {
    case 'success':
      return {
        ...baseStyle,
        backgroundColor: colors.success,
      };
    case 'error':
      return {
        ...baseStyle,
        backgroundColor: colors.error,
      };
    case 'warning':
      return {
        ...baseStyle,
        backgroundColor: colors.warning,
      };
    case 'info':
      return {
        ...baseStyle,
        backgroundColor: colors.info,
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: colors.info,
      };
  }
}

/**
 * Gets text color based on variant
 */
function getTextColor(variant: BadgeVariant, theme: ReturnType<typeof useTheme>): string {
  const { colors } = theme;

  // All badges use white text for contrast
  return colors.textOnPrimary;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
