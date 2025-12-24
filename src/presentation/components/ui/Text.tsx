import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';

export interface TextProps extends RNTextProps {
  /**
   * Typography variant that maps to theme tokens
   */
  variant?: TextVariant;
  /**
   * Optional style override
   */
  style?: RNTextProps['style'];
}

/**
 * Text Component
 *
 * A reusable text component that consumes typography tokens from the theme.
 * Supports multiple variants (h1, h2, body, etc.) and allows style overrides.
 */
export function Text({ variant = 'body', style, children, ...props }: TextProps) {
  const theme = useTheme();

  const variantStyles = getVariantStyles(variant, theme);

  return (
    <RNText style={[variantStyles, style]} {...props}>
      {children}
    </RNText>
  );
}

/**
 * Maps variant to theme typography tokens
 */
function getVariantStyles(variant: TextVariant, theme: ReturnType<typeof useTheme>) {
  const { typography, colors } = theme;

  switch (variant) {
    case 'h1':
      return {
        fontSize: typography.fontSize['3xl'],
        fontFamily: typography.fontFamily.bold,
        lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
        color: colors.textPrimary,
      };
    case 'h2':
      return {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.bold,
        lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
        color: colors.textPrimary,
      };
    case 'h3':
      return {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.semibold,
        lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
        color: colors.textPrimary,
      };
    case 'body':
      return {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.base * typography.lineHeight.normal,
        color: colors.textPrimary,
      };
    case 'bodySmall':
      return {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
        color: colors.textSecondary,
      };
    case 'caption':
      return {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
        color: colors.textSecondary,
      };
    case 'label':
      return {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.medium,
        lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
        color: colors.textPrimary,
      };
    default:
      return {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.base * typography.lineHeight.normal,
        color: colors.textPrimary,
      };
  }
}
