import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface SkeletonProps {
  /**
   * Width of the skeleton (number or '100%')
   */
  width?: number | string;
  /**
   * Height of the skeleton
   */
  height?: number;
  /**
   * Border radius of the skeleton
   */
  borderRadius?: number;
  /**
   * Optional style override
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Skeleton Component
 *
 * A loading placeholder component with shimmer animation.
 * Used to indicate content is loading.
 */
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  testID,
}: SkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  const staticStyles: ViewStyle = {
    backgroundColor: theme.colors.border,
    borderRadius,
    height,
    width: width as ViewStyle['width'],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        staticStyles,
        {
          opacity,
        },
        style,
      ]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles applied inline with theme
  },
});

