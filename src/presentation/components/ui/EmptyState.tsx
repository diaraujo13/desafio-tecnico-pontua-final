import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';

export interface EmptyStateProps {
  /**
   * Icon component or element to display
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onPress: () => void;
  };
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
 * EmptyState Component
 *
 * A component for displaying empty states in lists or screens.
 * Provides visual feedback when there is no data to display.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
  testID,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text variant="h3" style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>

      {description && (
        <Text variant="bodySmall" style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      )}

      {action && (
        <Button
          label={action.label}
          variant="primary"
          onPress={action.onPress}
          style={styles.actionButton}
          testID={testID ? `${testID}_ActionButton` : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    marginTop: 24,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
});



