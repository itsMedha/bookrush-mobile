/** 4pt spacing scale. Use these instead of raw numbers. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Layout constants shared across screens. */
export const layout = {
  screenPadding: spacing.xl,
  minTouchTarget: 44,
  tabBarHeight: 60,
  purchaseBarHeight: 76,
  maxContentWidth: 560,
} as const;
