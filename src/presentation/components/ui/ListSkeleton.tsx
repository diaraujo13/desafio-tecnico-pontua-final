import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Skeleton } from './Skeleton';

export interface ListSkeletonProps {
  /**
   * Number of skeleton list items to render
   */
  count?: number;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * ListSkeleton Component
 *
 * A preset skeleton component for list-like loading states.
 * Composed of multiple Skeleton components to match list item layout.
 */
export function ListSkeleton({ count = 3, testID }: ListSkeletonProps) {
  const theme = useTheme();

  return (
    <View testID={testID}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.item,
            {
              marginBottom: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
            },
          ]}
        >
          <Skeleton width="70%" height={16} borderRadius={4} testID={`${testID}_Title_${index}`} />
          <Skeleton
            width="50%"
            height={12}
            borderRadius={4}
            style={styles.subtitle}
            testID={`${testID}_Subtitle_${index}`}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    // Styles applied inline with theme
  },
  subtitle: {
    marginTop: 4,
  },
});




