import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { BookCover } from '@/components/book/BookCover';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Text } from '@/components/ui/Text';
import { MAX_QUANTITY_PER_BOOK } from '@/store/cartStore';
import { colors, spacing } from '@/theme';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/format';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (bookId: string, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onOpen: (bookId: string) => void;
}

function CartItemRowBase({ item, onQuantityChange, onRemove, onOpen }: CartItemRowProps) {
  const { book, quantity } = item;
  const max = Math.min(MAX_QUANTITY_PER_BOOK, book.stock);

  return (
    <ReanimatedSwipeable
      overshootRight={false}
      friction={2}
      rightThreshold={48}
      renderRightActions={() => (
        <PressableScale
          testID={`swipe-remove-${book.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${book.title} from cart`}
          onPress={() => onRemove(item)}
          style={styles.removeAction}
        >
          <Icon name="trash-outline" size={22} color="danger" />
          <Text variant="caption" color="danger" weight="700">
            Remove
          </Text>
        </PressableScale>
      )}
    >
      <View testID={`cart-item-${book.id}`} style={styles.row}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Open ${book.title}`}
          onPress={() => onOpen(book.id)}
          scaleTo={0.97}
        >
          <BookCover book={book} width={64} elevated />
        </PressableScale>
        <View style={styles.details}>
          <View style={styles.titleBlock}>
            <Text variant="bookTitle" numberOfLines={2}>
              {book.title}
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={1}>
              {book.author}
            </Text>
          </View>
          <View style={styles.footer}>
            <QuantityStepper
              label={`Quantity of ${book.title}`}
              value={quantity}
              max={max}
              onChange={(next) => (next === 0 ? onRemove(item) : onQuantityChange(book.id, next))}
            />
            <View style={styles.prices}>
              <Text variant="heading3" testID={`line-total-${book.id}`}>
                {formatPrice(book.price * quantity)}
              </Text>
              {quantity > 1 ? (
                <Text variant="caption" color="textSecondary">
                  {formatPrice(book.price)} each
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

export const CartItemRow = memo(CartItemRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  details: { flex: 1, justifyContent: 'space-between', gap: spacing.md },
  titleBlock: { gap: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prices: { alignItems: 'flex-end' },
  removeAction: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerSoft,
  },
});
