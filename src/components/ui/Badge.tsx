import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type BadgeTone = 'accent' | 'sage' | 'neutral' | 'ink' | 'danger' | 'success';

const tones: Record<BadgeTone, { background: ColorToken; foreground: ColorToken }> = {
  accent: { background: 'accentSoft', foreground: 'accentText' },
  sage: { background: 'sageSoft', foreground: 'sageText' },
  neutral: { background: 'surfaceMuted', foreground: 'textSecondary' },
  ink: { background: 'ink', foreground: 'textInverse' },
  danger: { background: 'dangerSoft', foreground: 'danger' },
  success: { background: 'successSoft', foreground: 'success' },
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
}

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const { background, foreground } = tones[tone];
  return (
    <View style={[styles.base, { backgroundColor: colors[background] }]}>
      {icon ? <Icon name={icon} size={12} color={foreground} /> : null}
      <Text variant="caption" color={foreground} weight="700" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
});
