import { colors } from '../../../packages/shared-ui/src/theme/colors';
import {
  LARGER_TEXT_SCALE,
  createTheme,
  defaultAccessibilityPreferences,
  highContrastColors,
} from '../../../packages/shared-ui/src/theme/accessibility';
import { AAA_CONTRAST, blend, contrastRatio } from '../../../packages/shared-ui/src/theme/contrast';
import { scaledPixels } from '../../../packages/shared-ui/src/hooks/useScale';

const highContrast = createTheme({ ...defaultAccessibilityPreferences, highContrast: true });
const hc = highContrast.colors;

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#000', '#FFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
    // #767676 on white is the well-known smallest grey that passes AA (4.5:1)
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });

  it('refuses a colour it cannot read rather than guessing', () => {
    expect(() => contrastRatio('rgba(0, 0, 0, 0.5)', '#FFFFFF')).toThrow();
  });
});

describe('standard theme', () => {
  it('is exactly the existing tokens, so nothing changes for anyone who leaves the switches off', () => {
    const standard = createTheme(defaultAccessibilityPreferences);
    expect(standard.colors).toBe(colors);
    expect(standard.fontScale).toBe(1);
    expect(standard.fontSize(24)).toBe(scaledPixels(24));
    expect(standard.focus).toEqual({
      borderWidth: scaledPixels(3),
      borderColor: colors.focusBorder,
      restingBorderColor: 'transparent',
      scale: 1.05,
    });
  });
});

describe('high-contrast preset', () => {
  it('defines every colour token the standard palette has', () => {
    expect(Object.keys(hc).sort()).toEqual(Object.keys(colors).sort());
  });

  // Every text colour a screen draws, on every surface it is drawn on.
  const textPairs: [keyof typeof hc, keyof typeof hc][] = [
    ['text', 'background'],
    ['text', 'backgroundElevated'],
    ['text', 'card'],
    ['text', 'cardElevated'],
    ['text', 'overlay'],
    ['text', 'primary'],
    ['text', 'secondary'],
    ['textSecondary', 'background'],
    ['textSecondary', 'card'],
    ['textSecondary', 'cardElevated'],
    ['textTertiary', 'background'],
    ['textTertiary', 'card'],
    ['textOnPrimary', 'focusBackground'],
    ['notification', 'background'],
    ['error', 'background'],
    ['success', 'background'],
    ['warning', 'background'],
    ['info', 'background'],
  ];

  it.each(textPairs)('%s on %s is at least 7:1 (WCAG AAA)', (foreground, background) => {
    expect(contrastRatio(hc[foreground], hc[background])).toBeGreaterThanOrEqual(AAA_CONTRAST);
  });

  it('draws a focus ring that stands out at 7:1 from every surface a focusable item sits on', () => {
    for (const surface of ['background', 'backgroundElevated', 'card', 'cardElevated'] as const) {
      expect(contrastRatio(highContrast.focus.borderColor, hc[surface])).toBeGreaterThanOrEqual(AAA_CONTRAST);
    }
  });

  it('makes the ring twice as thick as the standard one, so focus is not shown by colour or size alone', () => {
    expect(highContrast.focus.borderWidth).toBe(scaledPixels(6));
    expect(highContrast.focus.borderWidth).toBeGreaterThan(
      createTheme(defaultAccessibilityPreferences).focus.borderWidth,
    );
  });

  it('gives resting buttons and cards a visible edge (WCAG 1.4.11, 3:1)', () => {
    expect(contrastRatio(highContrast.focus.restingBorderColor, hc.background)).toBeGreaterThanOrEqual(3);
    for (const edge of ['border', 'borderLight', 'divider'] as const) {
      expect(contrastRatio(hc[edge], hc.background)).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps text over the Details backdrop at 7:1 even where the artwork is pure white', () => {
    const brightestBackdrop = blend('#FFFFFF', hc.background, highContrast.backdropOpacity);
    expect(contrastRatio(hc.text, brightestBackdrop)).toBeGreaterThanOrEqual(AAA_CONTRAST);
    expect(contrastRatio(hc.textSecondary, brightestBackdrop)).toBeGreaterThanOrEqual(AAA_CONTRAST);
  });
});

describe('larger text and reduced motion', () => {
  it('scales every themed font size by 25%', () => {
    const larger = createTheme({ ...defaultAccessibilityPreferences, largerText: true });
    expect(larger.fontScale).toBe(LARGER_TEXT_SCALE);
    expect(larger.fontSize(24)).toBeCloseTo(scaledPixels(24 * 1.25), 5);
    expect(larger.fontSize(24)).toBeGreaterThan(scaledPixels(24));
  });

  it('stops focused items from growing', () => {
    expect(createTheme({ ...defaultAccessibilityPreferences, reduceMotion: true }).focus.scale).toBe(1);
  });

  it('keeps the three switches independent of one another', () => {
    const largerOnly = createTheme({ highContrast: false, largerText: true, reduceMotion: false });
    expect(largerOnly.colors).toBe(colors);
    expect(largerOnly.focus.scale).toBe(1.05);

    const all = createTheme({ highContrast: true, largerText: true, reduceMotion: true });
    expect(all.colors).toBe(highContrastColors);
    expect(all.fontScale).toBe(LARGER_TEXT_SCALE);
    expect(all.focus.scale).toBe(1);
  });
});
