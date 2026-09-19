import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import type { ColorToken } from '@/theme';
import type { Pricing } from '@/types';
import { formatPrice } from '@/utils/format';

interface RowProps {
  label: string;
  value: ReactNode;
  tone?: ColorToken;
  strong?: boolean;
  testID?: string;
}

function Row({ label, value, tone = 'textPrimary', strong = false, testID }: RowProps) {
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'heading3' : 'body'} color={strong ? 'textPrimary' : 'textSecondary'}>
        {label}
      </Text>
      <Text
        testID={testID}
        variant={strong ? 'heading3' : 'body'}
        color={tone}
        weight={strong ? '700' : '500'}
      >
        {value}
      </Text>
    </View>
  );
}

/** Item total → discount → delivery → total. Shared by Cart, Checkout and order details. */
export function OrderSummary({
  pricing,
  title = 'Order summary',
}: {
  pricing: Pricing;
  title?: string;
}) {
  return (
    <Card padding="lg" style={styles.card}>
      <Text variant="heading3">{title}</Text>
      <View style={styles.rows}>
        <Row label="Item total" value={formatPrice(pricing.itemsTotal)} />
        {pricing.discount > 0 ? (
          <Row label="Discount" value={`−${formatPrice(pricing.discount)}`} tone="success" />
        ) : null}
        <Row
          label="Delivery"
          value={pricing.delivery === 0 ? 'Free' : formatPrice(pricing.delivery)}
          tone={pricing.delivery === 0 ? 'success' : 'textPrimary'}
        />
      </View>
      <Divider />
      <Row testID="summary-total" label="Total" value={formatPrice(pricing.total)} strong />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  rows: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});
