import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scaledPixels } from '@/hooks/useScale';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { useRouter } from 'expo-router';

interface EmptyWatchlistStateProps {
  onNavigateToHome?: () => void;
}

const EmptyWatchlistState: React.FC<EmptyWatchlistStateProps> = React.memo(({ onNavigateToHome }) => {
  const router = useRouter();

  const handleBrowseContent = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      router.push('/(drawer)/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon placeholder - using text for now since we don't have icon assets */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📺</Text>
        </View>

        <Text style={styles.title}>Your Watchlist is Empty</Text>

        <Text style={styles.description}>
          Start building your personal collection by adding movies and shows you want to watch later.
        </Text>

        <Text style={styles.instructions}>
          Browse content and select "Add to Watchlist" on any movie or show details page.
        </Text>

        <SpatialNavigationFocusableView onSelect={handleBrowseContent}>
          {({ isFocused }) => (
            <View style={[styles.browseButton, isFocused && styles.browseButtonFocused]}>
              <Text style={[styles.browseButtonText, isFocused && styles.browseButtonTextFocused]}>Browse Content</Text>
            </View>
          )}
        </SpatialNavigationFocusableView>
      </View>
    </View>
  );
});

EmptyWatchlistState.displayName = 'EmptyWatchlistState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledPixels(40),
  },
  content: {
    alignItems: 'center',
    maxWidth: scaledPixels(800),
  },
  iconContainer: {
    marginBottom: scaledPixels(40),
  },
  icon: {
    fontSize: scaledPixels(120),
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scaledPixels(24),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    color: '#fff',
    fontSize: scaledPixels(24),
    textAlign: 'center',
    marginBottom: scaledPixels(20),
    lineHeight: scaledPixels(32),
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  instructions: {
    color: '#fff',
    fontSize: scaledPixels(20),
    textAlign: 'center',
    marginBottom: scaledPixels(40),
    lineHeight: scaledPixels(28),
    opacity: 0.7,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  browseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: scaledPixels(15),
    paddingHorizontal: scaledPixels(40),
    borderRadius: scaledPixels(5),
    alignItems: 'center',
  },
  browseButtonFocused: {
    backgroundColor: '#fff',
  },
  browseButtonText: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
  },
  browseButtonTextFocused: {
    color: '#000',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
  },
});

export default EmptyWatchlistState;
