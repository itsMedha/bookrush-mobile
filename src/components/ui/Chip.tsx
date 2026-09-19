import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { haptics } from '@/utils/haptics';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  testID?: string;
}

/** Selectable pill for genres, filters and suggestions. */
export function Chip({ label, selected = false, onPress, icon, testID }: ChipProps) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={{ top: 4, bottom: 4 }}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      style={[styles.base, selected ? styles.selected : styles.idle]}
    >
      {icon ? (
        <Icon name={icon} size={14} color={selected ? 'textInverse' : 'textSecondary'} />
      ) : null}
      <Text variant="bodySmall" weight="600" color={selected ? 'textInverse' : 'textPrimary'}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  idle: { backgroundColor: colors.surface, borderColor: colors.border },
  selected: { backgroundColor: colors.ink, borderColor: colors.ink },
});
