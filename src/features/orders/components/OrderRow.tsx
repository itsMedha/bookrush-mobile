import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Order } from '@/types';
import { formatShortDate } from '@/utils/date';
import { formatPrice, pluralize } from '@/utils/format';
import { routes } from '@/utils/routes';

function OrderRowBase({ order, onBuyAgain }: { order: Order; onBuyAgain: () => void }) {
  const router = useRouter();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const first = order.items[0];
  const extra = order.items.length - 1;
  const delivered = order.status === 'DELIVERED';

  return (
    <View style={styles.container}>
      <PressableScale
        testID={`order-row-${order.number}`}
        accessibilityRole="button"
        accessibilityLabel={`Order ${order.number}, ${pluralize(itemCount, 'book')}, ${formatPrice(
          order.pricing.total,
        )}, ${delivered ? 'delivered' : 'in progress'}`}
        onPress={() => router.push(routes.order(order.id))}
        scaleTo={0.985}
        style={styles.row}
      >
        <View style={styles.covers}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={item.bookId} style={[styles.cover, { marginLeft: index === 0 ? 0 : -18 }]}>
              <BookCover book={item} width={40} />
            </View>
          ))}
        </View>
        <View style={styles.text}>
          <Text variant="bodySmall" weight="700" numberOfLines={1}>
            {first?.title}
            {extra > 0 ? ` +${extra} more` : ''}
          </Text>
          <Text variant="caption" color="textSecondary">
            #{order.number} · {formatShortDate(order.placedAt)}
          </Text>
          <View style={styles.meta}>
            <Badge
              label={delivered ? 'Delivered' : 'In progress'}
              tone={delivered ? 'success' : 'accent'}
            />
          </View>
        </View>
        <View style={styles.trailing}>
          <Text variant="bodySmall" weight="700">
            {formatPrice(order.pricing.total)}
          </Text>
          <Icon name="chevron-forward" size={18} color="textTertiary" />
        </View>
      </PressableScale>

      {delivered ? (
        <Pressable
          testID={`buy-again-${order.number}`}
          accessibilityRole="button"
          accessibilityLabel={`Buy ${first?.title ?? 'these books'} again`}
          onPress={onBuyAgain}
          style={styles.buyAgain}
        >
          <Icon name="refresh" size={13} color="accentText" />
          <Text variant="caption" weight="700" color="accentText">
            Buy again
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const OrderRow = memo(OrderRowBase);

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  covers: { flexDirection: 'row', minWidth: 72 },
  cover: { borderWidth: 2, borderColor: colors.surface, borderRadius: radius.xs },
  text: { flex: 1, gap: spacing.xs },
  meta: { flexDirection: 'row' },
  trailing: { alignItems: 'flex-end', gap: spacing.sm },
  buyAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
