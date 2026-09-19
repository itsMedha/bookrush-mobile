import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import type { User } from '@/types';
import { formatCount } from '@/utils/format';
import { Avatar } from './Avatar';
import { Text } from './Text';

interface AvatarStackProps {
  users: User[];
  /** Total members, to render "+2.4k" beside the stack. */
  total?: number;
  max?: number;
}

export function AvatarStack({ users, total, max = 4 }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const extra = total !== undefined ? total - visible.length : 0;

  return (
    <View style={styles.row}>
      <View style={styles.stack}>
        {visible.map((user, index) => (
          <View key={user.id} style={[styles.item, index > 0 ? styles.overlap : null]}>
            <Avatar name={user.name} uri={user.avatarUrl} size="sm" />
          </View>
        ))}
      </View>
      {extra > 0 ? (
        <Text variant="caption" color="textSecondary" weight="600">
          +{formatCount(extra)} readers
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stack: { flexDirection: 'row' },
  item: { borderRadius: 999, borderWidth: 2, borderColor: colors.surface },
  overlap: { marginLeft: -10 },
});
