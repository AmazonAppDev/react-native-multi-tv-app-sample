import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated } from 'react-native';
import { scaledPixels } from '../hooks/useScale';

interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   */
  size?: 'small' | 'large';

  /**
   * Color of the loading indicator
   */
  color?: string;

  /**
   * Optional loading message to display
   */
  message?: string;

  /**
   * Whether to show a progress bar (0-100)
   */
  progress?: number;

  /**
   * Loading state type for different visual styles
   */
  type?: 'default' | 'overlay' | 'inline' | 'minimal';

  /**
   * Whether to show animated dots
   */
  showAnimatedDots?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(
  ({ size = 'large', color = '#ffffff', message, progress, type = 'default', showAnimatedDots = false }) => {
    const styles = useLoadingIndicatorStyles();
    const [dotAnimation] = React.useState(new Animated.Value(0));

    // Animate dots if enabled
    React.useEffect(() => {
      if (showAnimatedDots) {
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(dotAnimation, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(dotAnimation, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        );
        animation.start();
        return () => animation.stop();
      }
    }, [showAnimatedDots, dotAnimation]);

    const renderProgressBar = () => {
      if (typeof progress !== 'number') return null;

      return (
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${Math.max(0, Math.min(100, progress))}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      );
    };

    const renderAnimatedDots = () => {
      if (!showAnimatedDots) return null;

      return (
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: dotAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: index === 0 ? [0.3, 1, 0.3] : index === 1 ? [0.3, 0.3, 1] : [1, 0.3, 0.3],
                  }),
                  transform: [
                    {
                      scale: dotAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: index === 0 ? [0.8, 1.2, 0.8] : index === 1 ? [0.8, 0.8, 1.2] : [1.2, 0.8, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      );
    };

    const getContainerStyle = () => {
      switch (type) {
        case 'overlay':
          return [styles.loadingContainer, styles.overlayContainer];
        case 'inline':
          return styles.inlineContainer;
        case 'minimal':
          return styles.minimalContainer;
        default:
          return styles.loadingContainer;
      }
    };

    return (
      <View style={getContainerStyle()}>
        <View style={styles.contentContainer}>
          <ActivityIndicator size={size} color={color} />

          {message && <Text style={[styles.loadingText, { color }]}>{message}</Text>}

          {renderProgressBar()}
          {renderAnimatedDots()}
        </View>
      </View>
    );
  },
);

LoadingIndicator.displayName = 'LoadingIndicator';

const useLoadingIndicatorStyles = () => {
  return StyleSheet.create({
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    overlayContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
    },
    inlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaledPixels(20),
    },
    minimalContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledPixels(10),
    },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: scaledPixels(18),
      fontWeight: '600',
      marginTop: scaledPixels(16),
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    progressContainer: {
      marginTop: scaledPixels(20),
      alignItems: 'center',
      width: scaledPixels(200),
    },
    progressBackground: {
      width: '100%',
      height: scaledPixels(6),
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: scaledPixels(3),
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: scaledPixels(3),
    },
    progressText: {
      color: '#fff',
      fontSize: scaledPixels(14),
      fontWeight: '600',
      marginTop: scaledPixels(8),
    },
    dotsContainer: {
      flexDirection: 'row',
      marginTop: scaledPixels(16),
      alignItems: 'center',
    },
    dot: {
      width: scaledPixels(8),
      height: scaledPixels(8),
      borderRadius: scaledPixels(4),
      backgroundColor: '#fff',
      marginHorizontal: scaledPixels(4),
    },
  });
};

export default LoadingIndicator;
