import React from "react";
import { View, StyleSheet } from "react-native";
import { DefaultFocus } from "react-tv-space-navigation";
import FocusablePressable from "../FocusablePressable";
import SeekBar from "./SeekBar";
import { scaledPixels } from "../../hooks/useScale";
import { safeZones } from "../../theme";

interface ControlsProps {
  paused: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
}

const Controls: React.FC<ControlsProps> = React.memo(({
  paused,
  onPlayPause,
  currentTime,
  duration,
}) => {
  const styles = controlsStyles;
  return (
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
  );
});

const controlsStyles = StyleSheet.create({
    bottomControls: {
      position: "absolute",
      bottom: scaledPixels(safeZones.actionSafe.vertical),
      start: scaledPixels(safeZones.actionSafe.horizontal),
      end: scaledPixels(safeZones.actionSafe.horizontal),
      flexDirection: "row",
      alignItems: "center",
    },
    controlButton: {
      marginEnd: scaledPixels(20),
    },
  });

export default Controls;
