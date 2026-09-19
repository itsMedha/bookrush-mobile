import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, layout, radius, type ColorToken } from '@/theme';
import { haptics } from '@/utils/haptics';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

export interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  /** Required: icon-only controls must be announced by screen readers. */
  accessibilityLabel: string;
  variant?: 'plain' | 'filled' | 'inverse';
  color?: ColorToken;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const backgrounds = {
  plain: colors.transparent,
  filled: colors.surface,
  inverse: colors.overlay,
} as const;

/** 44pt circular icon target. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
  color = 'textPrimary',
  size = 22,
  disabled,
  style,
  testID,
}: IconButtonProps) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={4}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      style={[
        styles.base,
        { backgroundColor: backgrounds[variant] },
        variant === 'filled' ? styles.bordered : null,
        style,
      ]}
    >
      <Icon name={icon} size={size} color={variant === 'inverse' ? 'textInverse' : color} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: { borderWidth: 1, borderColor: colors.border },
});
