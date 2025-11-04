import React from "react";
import { View, StyleSheet } from "react-native";
import FocusablePressable from "../FocusablePressable";
import { scaledPixels } from "../../hooks/useScale";

interface GoBackButtonProps {
  onSelect: () => void;
}

const ExitButton: React.FC<GoBackButtonProps> = React.memo(({ onSelect }) => {
  const styles = exitButtonStyles;

  return (
    <FocusablePressable
      text={"Exit"}
      onSelect={onSelect}
      style={styles.exitBtn}
    />
  );
});

const exitButtonStyles = StyleSheet.create({
    exitBtn: {
      position: "absolute",
      top: scaledPixels(20),
      left: scaledPixels(20),
      width: scaledPixels(100),
    },
  });

export default ExitButton;
