import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
} from "react-native";
import { scaledPixels } from "../hooks/useScale";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { colors } from "../theme/colors";

interface CustomPressableProps extends PressableProps {
  text: string;
  onSelect: () => void;
  style?: ViewStyle;
}

const FocusablePressable = React.memo(({
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
              styles.watchButtonText,
              isFocused && styles.watchButtonTextFocused,
            ]}
          >
            {text}
          </Text>
        </Pressable>
      )}
    </SpatialNavigationFocusableView>
  );
});

const styles = StyleSheet.create({
  watchButton: {
    backgroundColor: colors.cardElevated,
    paddingVertical: scaledPixels(20),
    paddingHorizontal: scaledPixels(40),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minWidth: scaledPixels(200),
    minHeight: scaledPixels(60),
    maxWidth: '90%',
  },
  watchButtonFocused: {
    backgroundColor: colors.focusBackground,
    borderColor: colors.focusBackground,
    transform: [{ scale: 1.05 }],
    // Shadow for depth
    shadowColor: colors.focus,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  watchButtonText: {
    color: colors.text,
    fontSize: scaledPixels(24),
    fontWeight: "bold",
    textAlign: "center",
  },
  watchButtonTextFocused: {
    color: colors.textOnPrimary,
    fontSize: scaledPixels(24),
    fontWeight: "bold",
  },
});

export default FocusablePressable;
