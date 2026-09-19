import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, layout, radius, spacing, type ColorToken } from '@/theme';
import { haptics } from '@/utils/haptics';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

const palette: Record<
  ButtonVariant,
  { background: ColorToken; foreground: ColorToken; border?: ColorToken }
> = {
  primary: { background: 'ink', foreground: 'textInverse' },
  accent: { background: 'accent', foreground: 'ink' },
  secondary: { background: 'surface', foreground: 'ink', border: 'borderStrong' },
  ghost: { background: 'transparent', foreground: 'ink' },
  danger: { background: 'dangerSoft', foreground: 'danger' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const inactive = disabled || loading;
  const { background, foreground, border } = palette[variant];

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      style={[
        styles.base,
        size === 'md' ? styles.md : styles.sm,
        fullWidth ? styles.fullWidth : styles.hug,
        {
          backgroundColor: colors[background],
          borderColor: border ? colors[border] : colors.transparent,
          opacity: disabled && !loading ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[foreground]} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <Icon name={leftIcon} size={18} color={foreground} /> : null}
          <Text variant="button" color={foreground} numberOfLines={1}>
            {label}
          </Text>
          {rightIcon ? <Icon name={rightIcon} size={18} color={foreground} /> : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: { minHeight: 52, paddingHorizontal: spacing.xl },
  sm: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.lg },
  fullWidth: { alignSelf: 'stretch' },
  hug: { alignSelf: 'flex-start' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
