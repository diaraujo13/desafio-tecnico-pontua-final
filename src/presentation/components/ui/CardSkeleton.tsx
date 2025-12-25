import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Skeleton } from './Skeleton';

export interface CardSkeletonProps {
  /**
   * Number of skeleton cards to render
   */
  count?: number;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * CardSkeleton Component
 *
 * A preset skeleton component for card-like loading states.
 * Composed of multiple Skeleton components to match card layout.
 */
export function CardSkeleton({ count = 1, testID }: CardSkeletonProps) {
  const theme = useTheme();

  return (
    <View testID={testID}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md,
              padding: theme.spacing.md,
            },
          ]}
        >
          <Skeleton width="60%" height={16} borderRadius={4} testID={`${testID}_Title_${index}`} />
          <Skeleton
            width="100%"
            height={12}
            borderRadius={4}
            style={styles.line}
            testID={`${testID}_Line1_${index}`}
          />
          <Skeleton
            width="80%"
            height={12}
            borderRadius={4}
            style={styles.line}
            testID={`${testID}_Line2_${index}`}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Styles applied inline with theme
  },
  line: {
    marginTop: 8,
  },
});




