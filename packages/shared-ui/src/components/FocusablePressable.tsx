import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { scaledPixels } from '../hooks/useScale';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { Theme } from '../theme/accessibility';
import { useTheme } from './AccessibilityContext';

interface CustomPressableProps extends PressableProps {
  text: string;
  onSelect: () => void;
  style?: StyleProp<ViewStyle>;
}

const FocusablePressable = React.memo(({ text, onSelect, style, ...props }: CustomPressableProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // The focused style comes last so a caller's background (a selected option, say) can never
  // hide focus or leave the focused text on a colour it was not checked against.
  return (
    <SpatialNavigationFocusableView onSelect={onSelect}>
      {({ isFocused }) => (
        <Pressable
          {...props}
          style={[styles.watchButton, style, isFocused && styles.watchButtonFocused]}
          onPress={onSelect}
        >
          <Text style={[styles.watchButtonText, isFocused && styles.watchButtonTextFocused]}>{text}</Text>
        </Pressable>
      )}
    </SpatialNavigationFocusableView>
  );
});

const createStyles = ({ colors, focus, fontSize }: Theme) =>
  StyleSheet.create({
    watchButton: {
      backgroundColor: colors.cardElevated,
      paddingVertical: scaledPixels(20),
      paddingHorizontal: scaledPixels(40),
      borderRadius: scaledPixels(8),
      borderWidth: focus.borderWidth,
      borderColor: focus.restingBorderColor,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      minWidth: scaledPixels(200),
      minHeight: scaledPixels(60),
      maxWidth: '90%',
    },
    watchButtonFocused: {
      backgroundColor: colors.focusBackground,
      borderColor: focus.borderColor,
      transform: [{ scale: focus.scale }],
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
      fontSize: fontSize(24),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    watchButtonTextFocused: {
      color: colors.textOnPrimary,
      fontSize: fontSize(24),
      fontWeight: 'bold',
    },
  });

export default FocusablePressable;
