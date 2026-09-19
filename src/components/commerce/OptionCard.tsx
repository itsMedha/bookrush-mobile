import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import { haptics } from '@/utils/haptics';

interface OptionCardProps {
  title: string;
  subtitle?: string;
  icon: IconName;
  trailing?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

export function OptionCard({
  title,
  subtitle,
  icon,
  trailing,
  selected,
  disabled = false,
  onPress,
  testID,
}: OptionCardProps) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="radio"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      scaleTo={0.985}
      style={[styles.card, selected ? styles.selected : null, disabled ? styles.disabled : null]}
    >
      <View style={[styles.icon, selected ? styles.iconSelected : null]}>
        <Icon name={icon} size={20} color={selected ? 'accentText' : 'textPrimary'} />
      </View>
      <View style={styles.text}>
        <Text variant="body" weight="700">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      <View style={[styles.radio, selected ? styles.radioSelected : null]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.ink, borderWidth: 1.5 },
  disabled: { opacity: 0.5 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: { backgroundColor: colors.accentSoft },
  text: { flex: 1, gap: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.ink },
  radioDot: { width: 12, height: 12, borderRadius: radius.pill, backgroundColor: colors.ink },
});
