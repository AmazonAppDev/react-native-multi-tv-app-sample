import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '@/hooks/useScale';
import { Game } from '../utils/gamesConfig';

interface StreamingInterfaceProps {
  game: Game;
  onBack: () => void;
  onStartStream: (game: Game) => void;
  onEndStream: () => void;
  onFullscreen: () => void;
  isStreaming: boolean;
  isLoading: boolean;
}

export default function StreamingInterface({
  game,
  onBack,
  onStartStream,
  onEndStream,
  onFullscreen,
  isStreaming,
  isLoading,
}: StreamingInterfaceProps) {
  const handleBack = useCallback(() => {
    if (isStreaming) {
      Alert.alert('End Stream', 'End stream and return to games?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            onEndStream();
            onBack();
          },
        },
      ]);
    } else {
      onBack();
    }
  }, [isStreaming, onEndStream, onBack]);

  const handleStartStream = useCallback(() => {
    onStartStream(game);
  }, [game, onStartStream]);

  return (
    <SpatialNavigationRoot isActive={true}>
      <View style={styles.container}>
        {/* Control Bar */}
        <View style={styles.controlBar}>
          <View style={styles.controlsLeft}>
            <SpatialNavigationFocusableView onSelect={handleBack}>
              {({ isFocused }) => (
                <LinearGradient
                  colors={isFocused ? ['#e74c3c', '#c0392b'] : ['#34495e', '#2c3e50']}
                  style={[styles.controlButton, isFocused && styles.controlButtonFocused]}
                >
                  <Text style={styles.controlButtonText}>← Back</Text>
                </LinearGradient>
              )}
            </SpatialNavigationFocusableView>
          </View>

          <View style={styles.controlsCenter}>
            <Text style={styles.gameTitle}>{game.name}</Text>
            {isLoading && <Text style={styles.statusText}>Starting...</Text>}
            {isStreaming && <Text style={styles.statusText}>Streaming</Text>}
          </View>

          <View style={styles.controlsRight}>
            {!isStreaming && !isLoading && (
              <SpatialNavigationFocusableView onSelect={handleStartStream}>
                {({ isFocused }) => (
                  <LinearGradient
                    colors={isFocused ? ['#27ae60', '#229954'] : ['#2ecc71', '#27ae60']}
                    style={[styles.controlButton, isFocused && styles.controlButtonFocused]}
                  >
                    <Text style={styles.controlButtonText}>▶ Start Stream</Text>
                  </LinearGradient>
                )}
              </SpatialNavigationFocusableView>
            )}

            {isStreaming && (
              <>
                <SpatialNavigationFocusableView onSelect={onEndStream}>
                  {({ isFocused }) => (
                    <LinearGradient
                      colors={isFocused ? ['#e74c3c', '#c0392b'] : ['#e67e22', '#d35400']}
                      style={[styles.controlButton, isFocused && styles.controlButtonFocused]}
                    >
                      <Text style={styles.controlButtonText}>⏹ End Stream</Text>
                    </LinearGradient>
                  )}
                </SpatialNavigationFocusableView>

                <SpatialNavigationFocusableView onSelect={onFullscreen}>
                  {({ isFocused }) => (
                    <LinearGradient
                      colors={isFocused ? ['#3498db', '#2980b9'] : ['#34495e', '#2c3e50']}
                      style={[styles.controlButton, isFocused && styles.controlButtonFocused]}
                    >
                      <Text style={styles.controlButtonText}>⛶ Fullscreen</Text>
                    </LinearGradient>
                  )}
                </SpatialNavigationFocusableView>
              </>
            )}
          </View>
        </View>

        {/* Video Area */}
        <View style={styles.videoContainer}>
          {!isStreaming && !isLoading && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Ready to stream {game.name}</Text>
              <Text style={styles.placeholderSubtext}>Press "Start Stream" to begin</Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Starting Stream...</Text>
              <Text style={styles.placeholderSubtext}>Connecting to {game.region}</Text>
            </View>
          )}

          {/* GameLift WebView will be injected here */}
          <div id="gamelift-container" style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaledPixels(40),
    paddingVertical: scaledPixels(20),
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  controlsLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  controlsCenter: {
    flex: 2,
    alignItems: 'center',
  },
  controlsRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: scaledPixels(12),
  },
  gameTitle: {
    fontSize: scaledPixels(24),
    fontWeight: 'bold',
    color: '#fff',
  },
  statusText: {
    fontSize: scaledPixels(16),
    color: '#4facfe',
    marginTop: scaledPixels(4),
  },
  controlButton: {
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(12),
    borderRadius: scaledPixels(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonFocused: {
    transform: [{ scale: 1.05 }],
  },
  controlButtonText: {
    color: '#fff',
    fontSize: scaledPixels(16),
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: scaledPixels(12),
  },
  placeholderSubtext: {
    fontSize: scaledPixels(20),
    color: '#bbb',
    textAlign: 'center',
  },
});
