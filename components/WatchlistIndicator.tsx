/**
 * WatchlistIndicator Component
 *
 * A small bookmark icon overlay that appears on grid items to indicate
 * when content is saved in the user's watchlist.
 *
 * Features:
 * - Positioned in top-right corner of thumbnails
 * - TV-safe colors and sizing using scaledPixels
 * - Non-interactive but visible during focus states
 * - Bookmark icon design optimized for TV viewing
 *
 * Requirements: 6.1, 6.4, 6.5
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scaledPixels } from '../hooks/useScale';

interface WatchlistIndicatorProps {
  /**
   * Whether the indicator should be visible
   * Typically controlled by checking if item is in watchlist
   */
  isVisible: boolean;

  /**
   * Whether the parent item is currently focused
   * Used to adjust visibility during focus states
   */
  isFocused?: boolean;
}

export const WatchlistIndicator: React.FC<WatchlistIndicatorProps> = React.memo(
  ({ isVisible, isFocused = false }) => {
    if (!isVisible) {
      return null;
    }

    return (
      <View style={[styles.container, isFocused && styles.containerFocused]} testID="watchlist-indicator">
        <View style={styles.bookmark} testID="watchlist-bookmark">
          <View style={styles.bookmarkNotch} testID="watchlist-bookmark-notch" />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return prevProps.isVisible === nextProps.isVisible && prevProps.isFocused === nextProps.isFocused;
  },
);

WatchlistIndicator.displayName = 'WatchlistIndicator';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaledPixels(8),
    right: scaledPixels(8),
    zIndex: 10,
    // Ensure indicator is visible on various backgrounds
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scaledPixels(2),
    },
    shadowOpacity: 0.8,
    shadowRadius: scaledPixels(4),
    elevation: 5, // Android shadow
  },
  containerFocused: {
    // Slightly more prominent during focus states
    shadowOpacity: 1.0,
    shadowRadius: scaledPixels(6),
  },
  bookmark: {
    width: scaledPixels(24),
    height: scaledPixels(32),
    backgroundColor: '#FFD700', // Gold color for high visibility on TV
    borderRadius: scaledPixels(2),
    position: 'relative',
    // TV-safe border for better definition
    borderWidth: scaledPixels(1),
    borderColor: '#FFA500', // Slightly darker gold for border
  },
  bookmarkNotch: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: scaledPixels(-6), // Half of width to center
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: scaledPixels(6),
    borderRightWidth: scaledPixels(6),
    borderBottomWidth: scaledPixels(8),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700', // Match bookmark color
    transform: [{ rotate: '180deg' }], // Point upward to create notch effect
  },
});

export default WatchlistIndicator;
