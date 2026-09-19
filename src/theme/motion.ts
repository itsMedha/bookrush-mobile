/** Shared animation constants so motion feels consistent across the app. */
export const duration = {
  instant: 90,
  fast: 160,
  base: 240,
  slow: 380,
} as const;

export const spring = {
  /** Quick, tight — press feedback, toggles. */
  snappy: { damping: 20, stiffness: 320, mass: 0.7 },
  /** Soft settle — sheets, cards. */
  gentle: { damping: 22, stiffness: 190, mass: 0.9 },
  /** Playful overshoot — likes, cart badge. */
  bouncy: { damping: 9, stiffness: 320, mass: 0.7 },
} as const;

export const pressScale = 0.97;
