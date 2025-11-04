import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { scaledPixels } from "../../hooks/useScale";

interface SeekBarProps {
  currentTime: number;
  duration: number;
}

const SeekBar = React.memo(({ currentTime, duration }: SeekBarProps) => {
  const { width } = useWindowDimensions();

  const thumbPosition = React.useMemo(() => {
    if (!duration) return 0;
    const percentage = (currentTime / duration) * 100;
    return (percentage * (width - scaledPixels(180))) / 100;
  }, [currentTime, duration, width]);

  const seekbarTrackStyle = React.useMemo(
    () => [seekBarStyles.seekbarTrack, { width: width - scaledPixels(170) }],
    [width],
  );

  const seekbarThumbStyle = React.useMemo(
    () => [seekBarStyles.seekbarThumb, { left: thumbPosition }],
    [thumbPosition],
  );

  return (
    <View style={seekBarStyles.seekbarContainer}>
      <View style={seekbarTrackStyle} />
      <View style={seekbarThumbStyle} />
    </View>
  );
});

const seekBarStyles = StyleSheet.create({
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
