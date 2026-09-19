import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors, type ColorToken } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorToken;
}

/** Single icon entry point (Ionicons) so size and colour always come from tokens. */
export function Icon({ name, size = 20, color = 'textPrimary' }: IconProps) {
  return <Ionicons name={name} size={size} color={colors[color]} accessible={false} />;
}
