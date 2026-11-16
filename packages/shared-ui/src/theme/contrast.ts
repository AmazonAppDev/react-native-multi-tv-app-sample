// WCAG 2.x contrast helpers, used to check the theme tokens rather than trust them.
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio

type RGB = [number, number, number];

const parseHex = (hex: string): RGB => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) {
    throw new Error(`Expected a #RGB or #RRGGBB colour, got "${hex}"`);
  }
  const digits =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((d) => d + d)
          .join('')
      : match[1];
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as RGB;
};

const toHex = (rgb: RGB): string =>
  '#' +
  rgb
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

/** Relative luminance of an sRGB colour, 0 (black) to 1 (white). */
export const relativeLuminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Contrast ratio between two colours, from 1 (identical) to 21 (black on white). */
export const contrastRatio = (a: string, b: string): number => {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

/** The colour you see when `foreground` is drawn at `opacity` over `background`. */
export const blend = (foreground: string, background: string, opacity: number): string => {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  return toHex(fg.map((channel, i) => channel * opacity + bg[i] * (1 - opacity)) as RGB);
};

/** WCAG level AAA for normal text (1.4.6). */
export const AAA_CONTRAST = 7;
