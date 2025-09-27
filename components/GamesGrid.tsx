import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpatialNavigationFocusableView, SpatialNavigationScrollView, DefaultFocus } from 'react-tv-space-navigation';
import { scaledPixels } from '@/hooks/useScale';
import { Game } from '../utils/gamesConfig';

interface GamesGridProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  isActive?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HERO_HEIGHT = screenHeight * 0.4; // 40% of screen
const GAMES_ROW_HEIGHT = screenHeight * 0.6; // 60% of screen
const CARD_WIDTH = scaledPixels(400); // Wider for horizontal images
const CARD_HEIGHT = scaledPixels(300); // Shorter for horizontal layout
const CARD_MARGIN = scaledPixels(30);

export default function GamesGrid({ games, onGameSelect, isActive = true }: GamesGridProps) {
  const [focusedGame, setFocusedGame] = useState<Game | null>(games[0] || null);

  const renderGameCard = useCallback(
    (game: Game, index: number) => (
      <SpatialNavigationFocusableView
        key={game.id}
        onSelect={() => onGameSelect(game)}
        onFocus={() => setFocusedGame(game)}
      >
        {({ isFocused }) => (
          <View style={[styles.gameCard, isFocused && styles.gameCardFocused]}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: game.image }}
                style={styles.gameImage}
                defaultSource={require('../assets/games/images/placeholder.png')}
              />
              {isFocused && (
                <LinearGradient colors={['transparent', 'rgba(102, 126, 234, 0.3)']} style={styles.imageOverlay} />
              )}
            </View>
            <View style={styles.gameInfo}>
              <Text style={[styles.gameTitle, isFocused && styles.gameTitleFocused]} numberOfLines={2}>
                {game.name}
              </Text>
            </View>
          </View>
        )}
      </SpatialNavigationFocusableView>
    ),
    [onGameSelect],
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Hero Section - 40% of screen */}
      {focusedGame && (
        <View style={styles.heroSection}>
          <Image
            source={{ uri: focusedGame.image }}
            style={styles.heroImage}
            defaultSource={require('../assets/games/images/placeholder.png')}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']} style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{focusedGame.name}</Text>
            <Text style={styles.heroDescription}>{focusedGame.description}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaText}>Ready to Play • {focusedGame.region}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Horizontal Games Row - 60% of screen */}
      <View style={styles.gamesRowContainer}>
        <Text style={styles.sectionTitle}>Available Games</Text>
        <View style={styles.gamesWrapper}>
          <DefaultFocus>{games.map((game, index) => renderGameCard(game, index))}</DefaultFocus>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Enhanced Hero Section - 40% of screen
  heroSection: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: scaledPixels(60),
    left: scaledPixels(80),
    right: scaledPixels(80),
  },
  heroTitle: {
    fontSize: scaledPixels(64),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: scaledPixels(20),
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroDescription: {
    fontSize: scaledPixels(28),
    color: '#e0e0e0',
    lineHeight: scaledPixels(38),
    marginBottom: scaledPixels(24),
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroMeta: {
    flexDirection: 'row',
  },
  heroMetaText: {
    fontSize: scaledPixels(20),
    color: '#bbb',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Games Row Container - 60% of screen
  gamesRowContainer: {
    height: GAMES_ROW_HEIGHT,
    paddingTop: scaledPixels(50),
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: scaledPixels(36),
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: scaledPixels(80),
    marginBottom: scaledPixels(40),
  },
  gamesWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledPixels(80),
  },
  // Enhanced Game Cards - Horizontal Layout
  gameCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_MARGIN,
    borderRadius: scaledPixels(16),
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gameCardFocused: {
    transform: [{ scale: 1.05 }],
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  imageContainer: {
    width: '100%',
    height: '75%', // Image takes 75% of card height
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  gameInfo: {
    height: '25%', // Text takes 25% of card height
    padding: scaledPixels(16),
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: scaledPixels(20),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: scaledPixels(24),
  },
  gameTitleFocused: {
    color: '#667eea',
  },
});
