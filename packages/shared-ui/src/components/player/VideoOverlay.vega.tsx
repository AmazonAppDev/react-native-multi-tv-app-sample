import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { DefaultFocus } from "react-tv-space-navigation";
import FocusablePressable from "../FocusablePressable";
import SeekBar from "./SeekBar";
import LoadingIndicator from "../LoadingIndicator";
import { scaledPixels } from "../../hooks/useScale";
import { safeZones } from "../../theme";

interface VideoOverlayProps {
  visible: boolean;
  paused: boolean;
  onPlayPause: () => void;
  onExit: () => void;
  currentTime: number;
  duration: number;
  isBuffering?: boolean;
}

/**
 * VideoOverlay for Vega/Kepler Platform
 *
 * This overlay component provides video playback controls with spatial navigation
 * for Fire TV devices. It appears on video start, auto-hides after 5 seconds,
 * and reappears when the user presses any remote button.
 *
 * Key features:
 * - Auto-hide/show with smooth fade animations (300ms)
 * - Spatial navigation support for remote control
 * - Exit button (top-left) and playback controls (bottom-center)
 * - Loading indicator during buffering
 * - Z-index: 10 (overlays above video surface and captions)
 */
const VideoOverlay: React.FC<VideoOverlayProps> = React.memo(({
  visible,
  paused,
  onPlayPause,
  onExit,
  currentTime,
  duration,
  isBuffering = false,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, opacity]);

  if (!visible) {
    return null;
  }

  const styles = overlayStyles;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {isBuffering && <LoadingIndicator />}

      <FocusablePressable
        text="Exit"
        onSelect={onExit}
        style={styles.exitButton}
      />

      <View style={styles.bottomControls}>
        <DefaultFocus>
          <FocusablePressable
            text={paused ? "Play" : "Pause"}
            onSelect={onPlayPause}
            style={styles.controlButton}
          />
        </DefaultFocus>
        <SeekBar currentTime={currentTime} duration={duration} />
      </View>
    </Animated.View>
  );
});

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "space-between",
    zIndex: 10,
  },
  exitButton: {
    position: "absolute",
    top: scaledPixels(safeZones.actionSafe.vertical),
    left: scaledPixels(safeZones.actionSafe.horizontal),
  },
  bottomControls: {
    position: "absolute",
    bottom: scaledPixels(safeZones.actionSafe.vertical),
    left: scaledPixels(safeZones.actionSafe.horizontal),
    right: scaledPixels(safeZones.actionSafe.horizontal),
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    marginRight: scaledPixels(20),
  },
});

export default VideoOverlay;
