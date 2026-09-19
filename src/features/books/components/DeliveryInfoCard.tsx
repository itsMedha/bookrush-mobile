import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import {
  availabilityOf,
  EXPRESS_DELIVERY_FEE,
  EXPRESS_ETA_LABEL,
  FREE_EXPRESS_THRESHOLD,
  STANDARD_ETA_LABEL,
} from '@/utils/pricing';
import { formatPrice } from '@/utils/format';

/** Where and how fast this book can reach the reader, plus availability. */
export function DeliveryInfoCard({ book }: { book: Book }) {
  const address = useUserStore(selectSelectedAddress);
  const availability = availabilityOf(book);
  const express = book.expressDelivery && availability !== 'out-of-stock';

  return (
    <Card padding="lg" style={styles.card} testID="delivery-info">
      <View style={styles.row}>
        <View style={[styles.icon, express ? styles.iconExpress : styles.iconStandard]}>
          <Icon
            name={express ? 'flash' : 'car-outline'}
            size={20}
            color={express ? 'accentText' : 'sageText'}
          />
        </View>
        <View style={styles.text}>
          <Text variant="heading3">
            {availability === 'out-of-stock'
              ? 'Currently unavailable'
              : express
                ? `Delivery in ${EXPRESS_ETA_LABEL}`
                : `Delivery in ${STANDARD_ETA_LABEL}`}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            {availability === 'out-of-stock'
              ? 'We will restock this title soon.'
              : express
                ? `${formatPrice(EXPRESS_DELIVERY_FEE)} — free above ${formatPrice(FREE_EXPRESS_THRESHOLD)}`
                : 'Free standard delivery'}
          </Text>
        </View>
      </View>

      {address ? (
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

      <View style={styles.row}>
        <View style={styles.pin}>
          <Icon
            name={
              availability === 'out-of-stock' ? 'close-circle-outline' : 'checkmark-circle-outline'
            }
            size={18}
            color={
              availability === 'out-of-stock'
                ? 'danger'
                : availability === 'low-stock'
                  ? 'accentText'
                  : 'success'
            }
          />
        </View>
        <Text
          testID="availability"
          variant="bodySmall"
          weight="700"
          color={
            availability === 'out-of-stock'
              ? 'danger'
              : availability === 'low-stock'
                ? 'accentText'
                : 'success'
          }
        >
          {availability === 'out-of-stock'
            ? 'Out of stock'
            : availability === 'low-stock'
              ? `Only ${book.stock} left in stock`
              : 'In stock'}
        </Text>
      </View>
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
  iconExpress: { backgroundColor: colors.accentSoft },
  iconStandard: { backgroundColor: colors.sageSoft },
  pin: { width: 40, alignItems: 'center' },
});
