import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
} from "react-native";
import { scaledPixels } from "@/hooks/useScale";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";

interface CustomPressableProps extends PressableProps {
  text: string;
  onSelect: () => void;
  style?: ViewStyle;
}

const FocusablePressable = ({
  text,
  onSelect,
  style,
  ...props
}: CustomPressableProps) => {
  return (
    <SpatialNavigationFocusableView onSelect={onSelect}>
      {({ isFocused }) => (
        <Pressable
          {...props}
          style={[
            styles.watchButton,
            isFocused && styles.watchButtonFocused,
            style,
          ]}
          onPress={onSelect}
        >
          <Text
            style={[
              isFocused
                ? styles.watchButtonTextFocused
                : styles.watchButtonText,
            ]}
          >
            {text}
          </Text>
        </Pressable>
      )}
    </SpatialNavigationFocusableView>
  );
};

const styles = StyleSheet.create({
  watchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: scaledPixels(15),
    borderRadius: scaledPixels(5),
    alignItems: "center",
    alignSelf: "flex-start",
  },
  watchButtonFocused: {
    backgroundColor: "#fff",
  },
  watchButtonText: {
    color: "#fff",
    fontSize: scaledPixels(18),
    fontWeight: "bold",
  },
  watchButtonTextFocused: {
    color: "#000",
    fontSize: scaledPixels(18),
    fontWeight: "bold",
  },
});

export default FocusablePressable;
