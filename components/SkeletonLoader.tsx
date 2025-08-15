/**
 * SkeletonLoader Component
 *
 * Provides skeleton loading placeholders for better perceived performance
 * while content is loading. Optimized for TV viewing with appropriate sizing.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { scaledPixels } from '../hooks/useScale';

interface SkeletonLoaderProps {
  /**
   * Width of the skeleton element
   */
  width?: number | string;

  /**
   * Height of the skeleton element
   */
  height?: number | string;

  /**
   * Border radius for rounded corners
   */
  borderRadius?: number;

  /**
   * Whether to show the shimmer animation
   */
  animated?: boolean;

  /**
   * Custom style overrides
   */
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = React.memo(
  ({ width = '100%', height = scaledPixels(20), borderRadius = scaledPixels(4), animated = true, style }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (animated) {
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnimation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnimation, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        );
        animation.start();
        return () => animation.stop();
      }
    }, [animated, shimmerAnimation]);

    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View
        style={[
          styles.skeleton,
          {
            width,
            height,
            borderRadius,
          },
          style,
        ]}
      >
        {animated && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                opacity: shimmerOpacity,
                borderRadius,
              },
            ]}
          />
        )}
      </View>
    );
  },
);

SkeletonLoader.displayName = 'SkeletonLoader';

interface WatchlistSkeletonProps {
  /**
   * Number of skeleton items to show
   */
  itemCount?: number;
}

export const WatchlistSkeleton: React.FC<WatchlistSkeletonProps> = React.memo(({ itemCount = 8 }) => {
  const styles = useSkeletonStyles();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={scaledPixels(300)} height={scaledPixels(48)} style={styles.titleSkeleton} />
        <SkeletonLoader width={scaledPixels(200)} height={scaledPixels(24)} style={styles.subtitleSkeleton} />
      </View>

      <View style={styles.grid}>
        {Array.from({ length: itemCount }, (_, index) => (
          <View key={index} style={styles.gridItem}>
            <SkeletonLoader
              width={scaledPixels(300)}
              height={scaledPixels(200)}
              borderRadius={scaledPixels(5)}
              style={styles.imageSkeleton}
            />
            <View style={styles.textContainer}>
              <SkeletonLoader width="80%" height={scaledPixels(18)} style={styles.textSkeleton} />
              <SkeletonLoader width="60%" height={scaledPixels(14)} style={styles.durationSkeleton} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

WatchlistSkeleton.displayName = 'WatchlistSkeleton';

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const useSkeletonStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    header: {
      paddingHorizontal: scaledPixels(40),
      paddingVertical: scaledPixels(60),
    },
    titleSkeleton: {
      marginBottom: scaledPixels(16),
    },
    subtitleSkeleton: {
      // No additional styles needed
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: scaledPixels(20),
    },
    gridItem: {
      width: scaledPixels(300),
      marginRight: scaledPixels(20),
      marginBottom: scaledPixels(20),
    },
    imageSkeleton: {
      marginBottom: scaledPixels(10),
    },
    textContainer: {
      padding: scaledPixels(15),
    },
    textSkeleton: {
      marginBottom: scaledPixels(8),
    },
    durationSkeleton: {
      // No additional styles needed
    },
  });
};

export default SkeletonLoader;
