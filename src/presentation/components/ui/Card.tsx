import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface CardProps extends ViewProps {
  /**
   * Optional style override for container
   */
  style?: ViewStyle;
}

/**
 * Card Container Component
 *
 * Base container with shadow/elevation and border-radius from theme.
 * Uses Compound Component pattern for flexibility.
 */
export function Card({ style, children, ...props }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Card Header Component
 *
 * Displays a title in the card header section.
 */
export function CardHeader({ title, style, ...props }: ViewProps & { title?: string }) {
  const theme = useTheme();

  if (!title) {
    return null;
  }

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
        },
        style,
      ]}
      {...props}
    >
      <Text variant="h3">{title}</Text>
    </View>
  );
}

/**
 * Card Content Component
 *
 * Main content area of the card.
 */
export function CardContent({ style, children, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Card Footer Component
 *
 * Footer section for actions or additional information.
 */
export function CardFooter({ style, children, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
          borderTopColor: theme.colors.borderLight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
});

// Attach subcomponents to Card for compound component pattern
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
