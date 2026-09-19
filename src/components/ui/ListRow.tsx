import type { ReactNode } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { colors, layout, radius, spacing, type ColorToken } from '@/theme';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

interface ListRowProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  destructive?: boolean;
  testID?: string;
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  destructive,
  testID,
}: ListRowProps) {
  const tone: ColorToken = destructive ? 'danger' : 'textPrimary';
  const body = (
    <>
      {icon ? (
        <View style={[styles.iconTile, destructive ? styles.iconDestructive : null]}>
          <Icon name={icon} size={18} color={destructive ? 'danger' : 'textPrimary'} />
        </View>
      ) : null}
      <View style={styles.text}>
        <Text variant="body" weight="500" color={tone}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {/* A chevron implies navigation, so destructive actions (log out) go without one. */}
      {trailing ??
        (onPress && !destructive ? (
          <Icon name="chevron-forward" size={18} color="textTertiary" />
        ) : null)}
    </>
  );

  if (!onPress) return <View style={styles.row}>{body}</View>;

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      scaleTo={0.99}
      style={styles.row}
    >
      {body}
    </PressableScale>
  );
}

interface ToggleRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: IconName;
  testID?: string;
}

export function ToggleRow({ title, subtitle, value, onValueChange, icon, testID }: ToggleRowProps) {
  return (
    <ListRow
      icon={icon}
      title={title}
      subtitle={subtitle}
      trailing={
        <Switch
          testID={testID}
          accessibilityLabel={title}
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.borderStrong, true: colors.sage }}
          thumbColor={colors.surface}
          ios_backgroundColor={colors.borderStrong}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget + spacing.md,
    paddingVertical: spacing.sm,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDestructive: { backgroundColor: colors.dangerSoft },
  text: { flex: 1, gap: 2 },
});
