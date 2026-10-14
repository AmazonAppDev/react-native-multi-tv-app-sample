import { colors } from './colors';
import { scaledPixels } from '../hooks/useScale';

export type ThemeColors = { [K in keyof typeof colors]: string };

/** The three switches in Settings > Accessibility. Each one can be turned on separately. */
export interface AccessibilityPreferences {
  /** Every text/background pair at 7:1 or more (WCAG AAA), and a thick yellow focus ring. */
  highContrast: boolean;
  /** All text drawn through the theme is 25% larger. */
  largerText: boolean;
  /** Focused items no longer grow or move. */
  reduceMotion: boolean;
}

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  highContrast: false,
  largerText: false,
  reduceMotion: false,
};

/**
 * High-contrast palette. Same keys as `colors`, so any screen can switch to it.
 * Every pair a screen draws text with is checked at 7:1 or more in
 * apps/expo-multi-tv/__tests__/AccessibilityTheme-test.ts.
 */
export const highContrastColors: ThemeColors = {
  // Primary colors
  primary: '#0040A0', // white text on it: 9.4:1
  secondary: '#3A35A8',

  // Backgrounds
  background: '#000000',
  backgroundElevated: '#0D0D0D',
  card: '#141414',
  cardElevated: '#1C1C1C',
  overlay: '#0D0D0D',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#E6E6E6',
  textTertiary: '#D1D1D6',
  textOnPrimary: '#000000',

  // Border and dividers: visible edges for buttons and cards (3:1 or more)
  border: '#BDBDBD',
  borderLight: '#9E9E9E',
  divider: '#9E9E9E',

  // Status colors, light enough to read on black
  notification: '#FF9F9A',
  error: '#FF9F9A',
  success: '#7DE59A',
  warning: '#FFC266',
  info: '#8CC8FF',

  // Focus: a yellow ring is the most visible cue on a dark TV screen
  focus: '#FFD60A',
  focusBorder: '#FFD60A',
  focusBackground: '#FFFFFF',
  focusBackgroundSecondary: 'rgba(255, 214, 10, 0.25)',
  focusGlow: 'rgba(255, 214, 10, 0.6)',

  // Interactive states
  pressedOverlay: 'rgba(255, 255, 255, 0.2)',
  hoverOverlay: 'rgba(255, 255, 255, 0.15)',

  // Scrim and overlays: darker, so text over artwork keeps its contrast
  scrimLight: 'rgba(0, 0, 0, 0.7)',
  scrimMedium: 'rgba(0, 0, 0, 0.85)',
  scrimDark: 'rgba(0, 0, 0, 0.95)',
};

export const LARGER_TEXT_SCALE = 1.25;

export interface Theme {
  preferences: AccessibilityPreferences;
  colors: ThemeColors;
  /** 1, or LARGER_TEXT_SCALE when larger text is on. */
  fontScale: number;
  /** A font size from the 1920x1080 design, scaled to the screen and to the text-size preference. */
  fontSize: (designSize: number) => number;
  focus: {
    /** Border width of focusable items, resting and focused, so focus never shifts the layout. */
    borderWidth: number;
    /** Ring colour of the focused item. */
    borderColor: string;
    /** Border colour of a focusable item that is not focused. */
    restingBorderColor: string;
    /** How much the focused item grows. 1 when reduce motion is on. */
    scale: number;
  };
  /** Opacity of artwork drawn behind text (Details screen backdrop). */
  backdropOpacity: number;
}

export const createTheme = (preferences: AccessibilityPreferences): Theme => {
  const palette = preferences.highContrast ? highContrastColors : colors;
  const fontScale = preferences.largerText ? LARGER_TEXT_SCALE : 1;
  return {
    preferences,
    colors: palette,
    fontScale,
    fontSize: (designSize: number) => scaledPixels(designSize * fontScale),
    focus: {
      borderWidth: scaledPixels(preferences.highContrast ? 6 : 3),
      borderColor: palette.focusBorder,
      restingBorderColor: preferences.highContrast ? palette.border : 'transparent',
      scale: preferences.reduceMotion ? 1 : 1.05,
    },
    backdropOpacity: preferences.highContrast ? 0.15 : 0.25,
  };
};

export const defaultTheme = createTheme(defaultAccessibilityPreferences);
