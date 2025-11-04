import React from "react";
import { View, StyleSheet } from "react-native";
import FocusablePressable from "../FocusablePressable";
import { scaledPixels } from "../../hooks/useScale";
import { safeZones } from "../../theme";

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
      top: scaledPixels(safeZones.actionSafe.vertical),
      left: scaledPixels(safeZones.actionSafe.horizontal),
      width: scaledPixels(100),
    },
  });

export default ExitButton;
