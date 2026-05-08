import React from "react";
import { View, StyleSheet, I18nManager } from "react-native";
import { scaledPixels } from "../../hooks/useScale";

interface SeekBarProps {
  currentTime: number;
  duration: number;
}

const SeekBar = React.memo(({ currentTime, duration }: SeekBarProps) => {
  const percentage = React.useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const thumbPosition = I18nManager.isRTL
    ? { right: `${percentage}%` }
    : { left: `${percentage}%` };

  return (
    <View style={seekBarStyles.seekbarContainer}>
      <View style={seekBarStyles.seekbarTrack} />
      <View style={[seekBarStyles.seekbarThumb, thumbPosition]} />
    </View>
  );
});

const seekBarStyles = StyleSheet.create({
  seekbarContainer: {
    flex: 1,
    height: scaledPixels(40),
    justifyContent: "center",
    marginEnd: scaledPixels(80),
  },
  seekbarTrack: {
    width: "100%",
    height: scaledPixels(5),
    backgroundColor: "#888",
    borderRadius: scaledPixels(2.5),
  },
  seekbarThumb: {
    position: "absolute",
    width: scaledPixels(20),
    height: scaledPixels(20),
    borderRadius: scaledPixels(10),
    backgroundColor: "#fff",
  },
});

export default SeekBar;
