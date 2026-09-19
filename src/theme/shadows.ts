/**
 * Soft, warm shadows expressed with the cross-platform `boxShadow` style.
 * Kept very light: hierarchy comes from spacing and borders first.
 */
export const shadows = {
  none: undefined,
  sm: '0px 1px 2px rgba(60, 40, 20, 0.06)',
  md: '0px 4px 14px rgba(60, 40, 20, 0.08)',
  lg: '0px 12px 32px rgba(60, 40, 20, 0.14)',
  cover: '0px 8px 20px rgba(40, 25, 10, 0.22)',
  bar: '0px -4px 20px rgba(60, 40, 20, 0.07)',
  /** Warm glow under the moving delivery rider. */
  riderGlow: '0px 4px 12px rgba(217, 119, 50, 0.45)',
} as const;

export type ShadowToken = keyof typeof shadows;
