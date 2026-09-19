/**
 * BookRush colour tokens.
 * Warm off-white paper, deep ink, one amber accent and a muted sage secondary.
 * Every "*Text" colour is chosen to reach WCAG AA on its intended background.
 */
export const colors = {
  ink: '#171717',
  inkSoft: '#35322E',

  background: '#FAF8F4',
  surface: '#FFFFFF',
  surfaceMuted: '#F3EFE7',
  border: '#E8E3D9',
  borderStrong: '#D3CDC0',

  accent: '#D97732',
  accentPressed: '#C4681F',
  accentSoft: '#FBEBDD',
  accentText: '#B04F12',

  sage: '#7A8B78',
  sageSoft: '#E7ECE5',
  sageText: '#4B5D49',

  textPrimary: '#171717',
  textSecondary: '#6B6B6B',
  textTertiary: '#8A857B',
  textInverse: '#FAF8F4',
  textInverseMuted: 'rgba(250, 248, 244, 0.68)',

  danger: '#B3372B',
  dangerSoft: '#F8E4E1',
  success: '#3F7A4F',
  successSoft: '#E4F0E6',
  star: '#E0A11B',

  overlay: 'rgba(23, 23, 23, 0.48)',
  /** Translucent layers that sit on top of ink or artwork rather than the page. */
  coverHighlight: 'rgba(255, 255, 255, 0.18)',
  onInkSurface: 'rgba(250, 248, 244, 0.16)',
  onInkTrack: 'rgba(250, 248, 244, 0.2)',
  skeleton: '#ECE7DC',
  skeletonHighlight: '#F6F2EA',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;

/** Muted, bookish tones used behind initials avatars. */
export const avatarTones = [
  '#D97732',
  '#7A8B78',
  '#3E5C76',
  '#8C3B4C',
  '#5C7A4F',
  '#6B5B95',
] as const;
