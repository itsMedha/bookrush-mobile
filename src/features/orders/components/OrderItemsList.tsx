import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import type { OrderItem } from '@/types';
import { formatPrice } from '@/utils/format';

/** Ordered books with cover, quantity and line total. */
export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={item.bookId}>
          {index > 0 ? <Divider style={styles.divider} /> : null}
          <View style={styles.row}>
            <BookCover book={item} width={44} />
            <View style={styles.text}>
              <Text variant="bookTitle" numberOfLines={1}>
                {item.title}
              </Text>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {item.author} · Qty {item.quantity}
                {item.mode === 'rent' ? ` · Rented ${item.rentalDays ?? 30} days` : ''}
              </Text>
            </View>
            <Text variant="bodySmall" weight="700">
              {formatPrice(item.unitPrice * item.quantity)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  divider: { marginVertical: spacing.md },
});
