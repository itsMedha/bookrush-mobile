import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import { discountPercent, formatPrice } from '@/utils/format';

interface PriceProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'lg';
  showDiscount?: boolean;
}

export function Price({ price, mrp, size = 'sm', showDiscount = false }: PriceProps) {
  const off = mrp ? discountPercent(price, mrp) : 0;
  const struck = mrp !== undefined && mrp > price;
  const label = struck
    ? `${formatPrice(price)}, was ${formatPrice(mrp)}, ${off} percent off`
    : formatPrice(price);

  return (
    <View accessible accessibilityLabel={label} style={styles.row}>
      <Text
        variant={size === 'lg' ? 'heading1' : 'heading3'}
        style={size === 'lg' ? styles.lg : null}
      >
        {formatPrice(price)}
      </Text>
      {struck ? (
        <Text variant="bodySmall" color="textTertiary" style={styles.strike}>
          {formatPrice(mrp)}
        </Text>
      ) : null}
      {showDiscount && off > 0 ? (
        <Text variant="bodySmall" color="success" weight="700">
          {off}% off
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  lg: { fontFamily: undefined, fontWeight: '700' },
  strike: { textDecorationLine: 'line-through' },
});
