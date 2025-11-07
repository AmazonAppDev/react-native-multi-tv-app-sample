import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

/**
 * Simple gradient replacement component
 * Uses the last color in the gradient array as a solid background
 * Does NOT use expo-linear-gradient to avoid platform compatibility issues
 */

interface PlatformLinearGradientProps {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  children?: ReactNode;
}

const PlatformLinearGradient: React.FC<PlatformLinearGradientProps> = ({
  colors,
  style,
  children,
}) => {
  // Use the last color in the gradient array as the solid background
  const fallbackColor = colors && colors.length > 0
    ? colors[colors.length - 1]
    : 'rgba(0, 0, 0, 0.6)';

  return (
    <View
      style={[
        style as StyleProp<ViewStyle>,
        { backgroundColor: fallbackColor },
      ]}
    >
      {children}
    </View>
  );
};

export default PlatformLinearGradient;
