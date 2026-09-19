import { Platform, type TextStyle } from 'react-native';

/**
 * Two voices: a refined serif for editorial moments (display, headings, book titles)
 * and the platform sans (SF Pro / Roboto) for everything functional.
 */
export const fontFamily = {
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia, "Times New Roman", serif',
  }),
} as const;

type TypographyStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing' | 'textTransform'
>;

export const typography = {
  display: {
    fontFamily: fontFamily.serif,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  heading1: {
    fontFamily: fontFamily.serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heading2: {
    fontFamily: fontFamily.serif,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  heading3: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  bookTitle: {
    fontFamily: fontFamily.serif,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TypographyStyle>;

export type TypographyVariant = keyof typeof typography;

/** Upper bound for Dynamic Type scaling so dense layouts do not break. */
export const maxFontSizeMultiplier = 1.35;
