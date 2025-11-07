export const typography = {
  fontFamily: {
    regular: 'System',
    mono: 'SpaceMono',
  },
  // Optimized for 10-foot viewing distance (TV best practices)
  fontSize: {
    xs: 16,    // Minimum readable size for TV
    sm: 20,    // Small text, captions
    md: 24,    // Body text
    lg: 28,    // Subheadings
    xl: 36,    // Headings
    xxl: 48,   // Large headings
    xxxl: 56,  // Hero titles
  },
  // Line heights for better readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
