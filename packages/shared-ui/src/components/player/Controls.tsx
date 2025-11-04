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
      left: scaledPixels(safeZones.actionSafe.horizontal),
      right: scaledPixels(safeZones.actionSafe.horizontal),
      flexDirection: "row",
      alignItems: "center",
    },
    controlButton: {
      marginRight: scaledPixels(20),
      width: scaledPixels(100),
    },
  });

export default Controls;
