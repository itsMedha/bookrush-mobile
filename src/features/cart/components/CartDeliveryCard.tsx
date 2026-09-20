import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { colors, radius, spacing } from '@/theme';
import type { CartItem } from '@/types';
import { formatPrice, pluralize } from '@/utils/format';
import { FREE_INSTANT_THRESHOLD, instantEtaRange, splitByDelivery } from '@/utils/pricing';

interface CartDeliveryCardProps {
  items: CartItem[];
  payableTotal: number;
}

/** Summarises how this basket will arrive, including when it splits across both speeds. */
export function CartDeliveryCard({ items, payableTotal }: CartDeliveryCardProps) {
  const address = useUserStore(selectSelectedAddress);
  const { instant, standard } = splitByDelivery(items);
  const eta = instantEtaRange(instant);
  const remaining = Math.max(0, FREE_INSTANT_THRESHOLD - payableTotal);
  const mixed = instant.length > 0 && standard.length > 0;

  return (
    <Card padding="lg" style={styles.card} testID="cart-delivery">
      {instant.length > 0 && eta ? (
        <View style={styles.row}>
          <View style={[styles.icon, styles.instant]}>
            <Icon name="flash" size={20} color="accentText" />
          </View>
          <View style={styles.text}>
            <Text variant="heading3">
              {mixed ? `${pluralize(instant.length, 'item')} arriving fast` : 'Instant delivery'}
            </Text>
            <Text variant="bodySmall" color="textSecondary">
              Arrives in {eta.min}–{eta.max} min
              {address ? ` · ${address.label}, ${address.line2}` : ''}
            </Text>
          </View>
        </View>
      ) : null}

      {standard.length > 0 ? (
        <View style={styles.row}>
          <View style={[styles.icon, styles.standard]}>
            <Icon name="cube-outline" size={20} color="sageText" />
          </View>
          <View style={styles.text}>
            <Text variant="heading3">
              {mixed ? `${pluralize(standard.length, 'item')} shipping` : 'Standard delivery'}
            </Text>
            <Text variant="bodySmall" color="textSecondary">
              Arrives in 2–4 days
            </Text>
          </View>
        </View>
      ) : null}

      {instant.length > 0 ? (
        <View style={styles.progress}>
          <ProgressBar
            value={Math.min(1, payableTotal / FREE_INSTANT_THRESHOLD)}
            fill={remaining === 0 ? 'sage' : 'accent'}
          />
          <Text
            variant="caption"
            color={remaining === 0 ? 'success' : 'textSecondary'}
            weight="600"
          >
            {remaining === 0
              ? 'Free instant delivery unlocked'
              : `Add ${formatPrice(remaining)} more for free instant delivery`}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instant: { backgroundColor: colors.accentSoft },
  standard: { backgroundColor: colors.sageSoft },
  progress: { gap: spacing.sm },
});
