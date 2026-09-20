import { StyleSheet, View } from 'react-native';
import { deliveryHeadline } from '@/components/books/DeliveryAvailability';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import { formatPrice } from '@/utils/format';
import {
  availabilityOf,
  FREE_INSTANT_THRESHOLD,
  INSTANT_DELIVERY_FEE,
  isInstant,
} from '@/utils/pricing';

/** How fast this book can reach the reader, and where it would go. */
export function DeliveryInfoCard({ book }: { book: Book }) {
  const address = useUserStore(selectSelectedAddress);
  const availability = availabilityOf(book);
  const instant = isInstant(book);
  const unavailable = availability === 'out-of-stock';

  const subtitle = unavailable
    ? 'We will restock this title soon.'
    : instant
      ? `${formatPrice(INSTANT_DELIVERY_FEE)} — free over ${formatPrice(FREE_INSTANT_THRESHOLD)}`
      : 'Free standard delivery';

  return (
    <Card padding="lg" style={styles.card} testID="delivery-info">
      <View style={styles.row}>
        <View
          style={[
            styles.icon,
            unavailable
              ? styles.iconUnavailable
              : instant
                ? styles.iconInstant
                : styles.iconStandard,
          ]}
        >
          <Icon
            name={unavailable ? 'close-circle' : instant ? 'flash' : 'cube-outline'}
            size={20}
            color={unavailable ? 'danger' : instant ? 'accentText' : 'sageText'}
          />
        </View>
        <View style={styles.text}>
          <Text variant="heading3" testID="delivery-headline">
            {deliveryHeadline(book.delivery)}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            {subtitle}
          </Text>
        </View>
      </View>

      {address && !unavailable ? (
        <View style={styles.row}>
          <View style={styles.pin}>
            <Icon name="location-outline" size={18} color="textSecondary" />
          </View>
          <Text variant="bodySmall" color="textSecondary" style={styles.text}>
            Deliver to{' '}
            <Text variant="bodySmall" weight="700">
              {address.label}
            </Text>{' '}
            · {address.line2}, {address.city} {address.pincode}
          </Text>
        </View>
      ) : null}

      {availability === 'low-stock' ? (
        <View style={styles.row}>
          <View style={styles.pin}>
            <Icon name="alert-circle-outline" size={18} color="accentText" />
          </View>
          <Text variant="bodySmall" weight="700" color="accentText" testID="availability">
            Only {book.stock} left nearby
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInstant: { backgroundColor: colors.accentSoft },
  iconStandard: { backgroundColor: colors.sageSoft },
  iconUnavailable: { backgroundColor: colors.dangerSoft },
  pin: { width: 40, alignItems: 'center' },
});
