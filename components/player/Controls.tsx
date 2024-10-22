import React from "react";
import { View, StyleSheet } from "react-native";
import { DefaultFocus } from "react-tv-space-navigation";
import FocusablePressable from "@/components/FocusablePressable";
import SeekBar from "@/components/player/SeekBar";
import { scaledPixels } from "@/hooks/useScale";

interface ControlsProps {
  paused: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
}

const Controls: React.FC<ControlsProps> = ({
  paused,
  onPlayPause,
  currentTime,
  duration,
}) => {
  const styles = useControlsStyles();
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
};

const useControlsStyles = () => {
  return StyleSheet.create({
    bottomControls: {
      position: "absolute",
      bottom: scaledPixels(20),
      left: scaledPixels(20),
      right: scaledPixels(20),
      flexDirection: "row",
      alignItems: "center",
    },
    controlButton: {
      marginRight: scaledPixels(20),
      width: scaledPixels(100),
    },
  });
};

export default Controls;
