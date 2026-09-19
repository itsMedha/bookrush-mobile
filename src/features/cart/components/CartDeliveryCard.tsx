import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { colors, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { FREE_EXPRESS_THRESHOLD, STANDARD_ETA_LABEL } from '@/utils/pricing';

interface CartDeliveryCardProps {
  expressAvailable: boolean;
  payableTotal: number;
}

const CART_EXPRESS_ETA = '35–45 min';

export function CartDeliveryCard({ expressAvailable, payableTotal }: CartDeliveryCardProps) {
  const address = useUserStore(selectSelectedAddress);
  const remaining = Math.max(0, FREE_EXPRESS_THRESHOLD - payableTotal);

  return (
    <Card padding="lg" style={styles.card} testID="cart-delivery">
      <View style={styles.row}>
        <View style={[styles.icon, expressAvailable ? styles.express : styles.standard]}>
          <Icon
            name={expressAvailable ? 'flash' : 'car-outline'}
            size={20}
            color={expressAvailable ? 'accentText' : 'sageText'}
          />
        </View>
        <View style={styles.text}>
          <Text variant="heading3">
            {expressAvailable ? 'Delivery available' : 'Standard delivery'}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            {expressAvailable
              ? `Arrives in ${CART_EXPRESS_ETA}`
              : `Some books ship in ${STANDARD_ETA_LABEL}`}
            {address ? ` · ${address.label}, ${address.line2}` : ''}
          </Text>
        </View>
      </View>

      {expressAvailable ? (
        <View style={styles.progress}>
          <ProgressBar
            value={Math.min(1, payableTotal / FREE_EXPRESS_THRESHOLD)}
            fill={remaining === 0 ? 'sage' : 'accent'}
          />
          <Text
            variant="caption"
            color={remaining === 0 ? 'success' : 'textSecondary'}
            weight="600"
          >
            {remaining === 0
              ? 'You unlocked free express delivery'
              : `Add ${formatPrice(remaining)} more for free express delivery`}
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
  express: { backgroundColor: colors.accentSoft },
  standard: { backgroundColor: colors.sageSoft },
  progress: { gap: spacing.sm },
});
