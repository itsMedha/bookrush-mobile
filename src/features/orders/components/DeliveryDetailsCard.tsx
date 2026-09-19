import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import type { Address, PaymentMethodId } from '@/types';
import { paymentLabel } from '../status';

interface DeliveryDetailsCardProps {
  address: Address;
  paymentMethod: PaymentMethodId;
}

export function DeliveryDetailsCard({ address, paymentMethod }: DeliveryDetailsCardProps) {
  return (
    <Card padding="lg" style={styles.card} testID="tracking-address">
      <View style={styles.row}>
        <Icon name="location-outline" size={20} color="textSecondary" />
        <View style={styles.text}>
          <Text variant="bodySmall" color="textSecondary">
            Delivering to {address.label}
          </Text>
          <Text variant="body" weight="600">
            {address.line1}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            {address.line2}, {address.city} {address.pincode}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Icon name="wallet-outline" size={20} color="textSecondary" />
        <View style={styles.text}>
          <Text variant="bodySmall" color="textSecondary">
            Payment
          </Text>
          <Text variant="body" weight="600">
            {paymentLabel(paymentMethod)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  text: { flex: 1, gap: 2 },
});
