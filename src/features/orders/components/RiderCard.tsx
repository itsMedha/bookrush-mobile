import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { toast } from '@/store/toastStore';
import { spacing } from '@/theme';
import type { Rider } from '@/types';
import { formatCount } from '@/utils/format';

/** Assigned rider with call/chat shortcuts (mocked in the demo). */
export function RiderCard({ rider }: { rider: Rider }) {
  return (
    <Card padding="lg" style={styles.card} testID="rider-card">
      <Avatar name={rider.name} size="md" />
      <View style={styles.text}>
        <Text variant="body" weight="700">
          {rider.name}
        </Text>
        <View style={styles.meta}>
          <Icon name="star" size={13} color="star" />
          <Text variant="caption" color="textSecondary">
            {rider.rating.toFixed(1)} · {formatCount(rider.deliveries)} deliveries
          </Text>
        </View>
        <Text variant="caption" color="textSecondary">
          {rider.vehicle}
        </Text>
      </View>
      <IconButton
        icon="chatbubble-ellipses-outline"
        variant="filled"
        accessibilityLabel={`Message ${rider.name}`}
        onPress={() => toast.show('Messaging is disabled in the demo')}
      />
      <IconButton
        icon="call-outline"
        variant="filled"
        accessibilityLabel={`Call ${rider.name}`}
        onPress={() => toast.show('Calling is disabled in the demo')}
      />
    </Card>
  );
}

export function RiderPlaceholder() {
  return (
    <Card padding="lg" tone="muted" bordered={false} style={styles.card}>
      <Icon name="bicycle-outline" size={24} color="textSecondary" />
      <Text variant="bodySmall" color="textSecondary" style={styles.text}>
        A delivery partner is assigned once your order is packed.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
