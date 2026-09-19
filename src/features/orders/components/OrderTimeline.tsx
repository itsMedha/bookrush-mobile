import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors, duration, radius, spacing } from '@/theme';
import type { Order } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { formatTime } from '@/utils/date';
import { statusIndexOf, STATUS_COPY } from '../status';
import { PulsingDot } from './PulsingDot';

const NODE = 24;

function Connector({ filled }: { filled: boolean }) {
  const fill = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fill.value = withTiming(filled ? 1 : 0, { duration: duration.slow });
  }, [filled, fill]);

  const fillStyle = useAnimatedStyle(() => ({ height: `${fill.value * 100}%` }));

  return (
    <View style={styles.connector}>
      <Animated.View style={[styles.connectorFill, fillStyle]} />
    </View>
  );
}

/** Six-step vertical timeline. The current step pulses; completed steps show their time. */
export function OrderTimeline({ order }: { order: Order }) {
  const current = statusIndexOf(order.status);

  return (
    <View testID="order-timeline" style={styles.list}>
      {ORDER_STATUSES.map((status, index) => {
        const done = index < current || order.status === 'DELIVERED';
        const active = index === current && order.status !== 'DELIVERED';
        const reached = index <= current;
        const timestamp = order.timeline[status];
        const isLast = index === ORDER_STATUSES.length - 1;
        const copy = STATUS_COPY[status];

        return (
          <View
            key={status}
            accessible
            accessibilityLabel={`${copy.title}. ${
              done ? 'Completed' : active ? 'In progress' : 'Upcoming'
            }${timestamp ? `, ${formatTime(timestamp)}` : ''}`}
            style={styles.step}
          >
            <View style={styles.rail}>
              <View
                style={[
                  styles.node,
                  done ? styles.nodeDone : null,
                  active ? styles.nodeActive : null,
                ]}
              >
                {done ? (
                  <Icon name="checkmark" size={14} color="textInverse" />
                ) : active ? (
                  <PulsingDot size={10} />
                ) : null}
              </View>
              {!isLast ? <Connector filled={index < current} /> : null}
            </View>
            <View style={[styles.text, isLast ? null : styles.textGap]}>
              <View style={styles.titleRow}>
                <Text
                  variant="body"
                  weight={active ? '700' : '600'}
                  color={reached ? 'textPrimary' : 'textTertiary'}
                  style={styles.title}
                >
                  {copy.title}
                </Text>
                {timestamp ? (
                  <Text variant="caption" color="textSecondary">
                    {formatTime(timestamp)}
                  </Text>
                ) : null}
              </View>
              <Text variant="bodySmall" color={reached ? 'textSecondary' : 'textTertiary'}>
                {copy.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  step: { flexDirection: 'row', gap: spacing.lg },
  rail: { width: NODE, alignItems: 'center' },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: { backgroundColor: colors.ink, borderColor: colors.ink },
  nodeActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  connector: {
    flex: 1,
    width: 2,
    minHeight: spacing.xl,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  connectorFill: { width: '100%', backgroundColor: colors.ink },
  text: { flex: 1, gap: 2, paddingTop: 1 },
  textGap: { paddingBottom: spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1 },
});
