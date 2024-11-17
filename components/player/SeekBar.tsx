import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { scaledPixels } from "@/hooks/useScale";

const { width } = Dimensions.get("window");

interface SeekBarProps {
  currentTime: number;
  duration: number;
}

const SeekBar = ({ currentTime, duration }: SeekBarProps) => {
  const styles = useSeekBarStyles();

  const getThumbPosition = () => {
    if (!duration) return 0;
    const percentage = (currentTime / duration) * 100;
    return (percentage * (width - scaledPixels(180))) / 100;
  };

  return (
    <View style={styles.seekbarContainer}>
      <View style={styles.seekbarTrack} />
      <View style={[styles.seekbarThumb, { left: getThumbPosition() }]} />
    </View>
  );
};

const useSeekBarStyles = () => {
  return StyleSheet.create({
    seekbarContainer: {
      flex: 1,
      height: scaledPixels(40),
      justifyContent: "center",
    },
    seekbarTrack: {
      height: scaledPixels(5),
      backgroundColor: "#888",
      borderRadius: scaledPixels(2.5),
      position: "absolute",
      width: width - scaledPixels(170),
    },
    seekbarThumb: {
      position: "absolute",
      width: scaledPixels(20),
      height: scaledPixels(20),
      borderRadius: scaledPixels(10),
      backgroundColor: "#fff",
    },
  });
};

export default SeekBar;
