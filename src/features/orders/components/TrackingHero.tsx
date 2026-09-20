import { StyleSheet, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Order } from '@/types';
import { arrivalLabel, progressOf, STATUS_COPY } from '../status';
import { DeliveryTrack } from './DeliveryTrack';
import { PulsingDot } from './PulsingDot';

/** The dark status panel at the top of tracking: current stage, ETA and the rider's route. */
export function TrackingHero({ order }: { order: Order }) {
  const delivered = order.status === 'DELIVERED';
  const instant = order.deliveryMethod === 'instant';

  return (
    <View style={[styles.hero, delivered ? styles.heroDelivered : null]} testID="tracking-hero">
      <View style={styles.top}>
        <View style={styles.live}>
          {delivered ? (
            <Icon name="checkmark-circle" size={14} color="sage" />
          ) : (
            <PulsingDot size={8} />
          )}
          <Text variant="overline" color={delivered ? 'sage' : 'accent'}>
            {delivered ? 'Completed' : 'Live tracking'}
          </Text>
        </View>
        {!instant && !delivered ? <Badge label="Standard shipping" tone="neutral" /> : null}
      </View>

      <Text variant="heading1" color="textInverse" testID="tracking-status">
        {STATUS_COPY[order.status].title}
      </Text>
      <Text variant="heading3" color="accent" testID="tracking-eta">
        {arrivalLabel(order)}
      </Text>

      <View style={styles.track}>
        <DeliveryTrack progress={progressOf(order.status)} delivered={delivered} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
  },
  heroDelivered: { backgroundColor: colors.inkSoft },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  live: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  track: { marginTop: spacing.lg },
});
