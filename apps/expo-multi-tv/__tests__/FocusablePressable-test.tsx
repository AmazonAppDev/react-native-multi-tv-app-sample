import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import FocusablePressable from '../../../packages/shared-ui/src/components/FocusablePressable';
import { AccessibilityProvider } from '../../../packages/shared-ui/src/components/AccessibilityContext';
import { AccessibilityPreferences, highContrastColors } from '../../../packages/shared-ui/src/theme/accessibility';
import { colors } from '../../../packages/shared-ui/src/theme/colors';
import { AAA_CONTRAST, contrastRatio } from '../../../packages/shared-ui/src/theme/contrast';
import { scaledPixels } from '../../../packages/shared-ui/src/hooks/useScale';

// The spatial navigation engine decides focus; here the test does.
let mockFocused = false;
jest.mock('react-tv-space-navigation', () => ({
  SpatialNavigationFocusableView: ({ children }: { children: (state: { isFocused: boolean }) => React.ReactNode }) =>
    children({ isFocused: mockFocused }),
}));

const render = async (overrides: Partial<AccessibilityPreferences>, style?: ViewStyle) => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;
  await act(async () => {
    renderer = TestRenderer.create(
      <AccessibilityProvider initialOverrides={overrides}>
        <FocusablePressable testID="button" text="Watch now" onSelect={() => {}} style={style} />
      </AccessibilityProvider>,
    );
  });
  // The Pressable that FocusablePressable rendered, with the style list it chose.
  const [pressable] = renderer!.root.findAll(
    (node) => node.props.testID === 'button' && Array.isArray(node.props.style),
  );
  const [text] = renderer!.root.findAll((node) => node.props.children === 'Watch now');
  const button = StyleSheet.flatten(pressable.props.style) as ViewStyle;
  const label = StyleSheet.flatten(text.props.style) as TextStyle;
  return { button, label };
};

describe('FocusablePressable', () => {
  beforeEach(() => {
    mockFocused = false;
  });

  it('looks exactly as before with the switches off', async () => {
    mockFocused = true;
    const { button, label } = await render({ highContrast: false, largerText: false, reduceMotion: false });
    expect(button.backgroundColor).toBe(colors.focusBackground);
    expect(button.borderColor).toBe(colors.focusBorder);
    expect(button.borderWidth).toBe(scaledPixels(3));
    expect(button.transform).toEqual([{ scale: 1.05 }]);
    expect(label.fontSize).toBe(scaledPixels(24));
  });

  it('shows focus at 10 feet in high contrast: a thick yellow ring, dark text at 7:1 or more', async () => {
    mockFocused = true;
    const { button, label } = await render({ highContrast: true });
    expect(button.borderWidth).toBe(scaledPixels(6));
    expect(button.borderColor).toBe(highContrastColors.focusBorder);
    expect(contrastRatio(label.color as string, button.backgroundColor as string)).toBeGreaterThanOrEqual(AAA_CONTRAST);
  });

  it('gives a resting button a visible edge in high contrast, the same width as the ring so focus never moves the layout', async () => {
    const { button, label } = await render({ highContrast: true });
    expect(button.borderColor).toBe(highContrastColors.border);
    expect(button.borderWidth).toBe(scaledPixels(6));
    expect(contrastRatio(label.color as string, button.backgroundColor as string)).toBeGreaterThanOrEqual(AAA_CONTRAST);
  });

  it('does not grow on focus when reduce motion is on', async () => {
    mockFocused = true;
    const { button } = await render({ reduceMotion: true });
    expect(button.transform).toEqual([{ scale: 1 }]);
  });

  it('draws larger text when larger text is on', async () => {
    const { label } = await render({ largerText: true });
    expect(label.fontSize).toBeCloseTo(scaledPixels(24 * 1.25), 5);
  });

  it('keeps the focused look even when the caller sets its own background (a selected option)', async () => {
    mockFocused = true;
    const { button, label } = await render({ highContrast: true }, { backgroundColor: highContrastColors.primary });
    expect(button.backgroundColor).toBe(highContrastColors.focusBackground);
    expect(contrastRatio(label.color as string, button.backgroundColor as string)).toBeGreaterThanOrEqual(AAA_CONTRAST);
  });
});
