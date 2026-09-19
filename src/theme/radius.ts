/** Corner radii. Deliberately restrained — books have crisp corners. */
export const radius = {
  none: 0,
  cover: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
