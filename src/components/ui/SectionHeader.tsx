import { Pressable, StyleSheet, View } from 'react-native';
import { layout, spacing } from '@/theme';
import { Icon } from './Icon';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Horizontal padding; pass 0 when the parent already pads. */
  inset?: number;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  inset = layout.screenPadding,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, { paddingHorizontal: inset }]}>
      <View style={styles.titles}>
        <Text variant="heading2" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}, ${title}`}
          hitSlop={12}
          onPress={onAction}
          style={styles.action}
        >
          <Text variant="bodySmall" weight="600" color="accentText">
            {actionLabel}
          </Text>
          <Icon name="chevron-forward" size={14} color="accentText" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  titles: { flex: 1, gap: spacing.xxs },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingBottom: spacing.xxs },
});
