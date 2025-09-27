import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { useMenuContext } from '../../components/MenuContext';
import { useAuth } from '../../context/AuthContext';
import GamesGrid from '../../components/GamesGrid';
import GameLiftWebView from '../../modules/gamelift-streams/components/GameLiftWebView';
import { loadGamesConfig, Game } from '../../utils/gamesConfig';

export default function GamesScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log('Direction ' + movement);
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const handleGameSelect = useCallback((game: Game) => {
    setSelectedGame(game);
  }, []);

  const handleBackToGrid = useCallback(() => {
    setSelectedGame(null);
  }, []);

  // Load games configuration
  const gamesConfig = loadGamesConfig();

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={styles.container}>
        {selectedGame ? (
          <GameLiftWebView
            onError={(error) => console.error('GameLift WebView error:', error)}
            game={selectedGame}
            onBack={handleBackToGrid}
          />
        ) : (
          <GamesGrid games={gamesConfig.games} onGameSelect={handleGameSelect} isActive={isActive} />
        )}
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
