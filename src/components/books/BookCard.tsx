import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';
import { Rating } from '@/components/ui/Rating';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import type { Book } from '@/types';
import { formatPrice } from '@/utils/format';
import { routes } from '@/utils/routes';
import { BookCover } from './BookCover';
import { DeliveryAvailability } from './DeliveryAvailability';

interface BookCardProps {
  book: Book;
  width?: number;
  /** Off only in dense grids (the profile shelf) where the badge would crowd the layout. */
  showDelivery?: boolean;
}

export const BOOK_CARD_WIDTH = 132;

function BookCardBase({ book, width = BOOK_CARD_WIDTH, showDelivery = true }: BookCardProps) {
  const router = useRouter();
  const open = useCallback(() => router.push(routes.book(book.id)), [router, book.id]);

  return (
    <PressableScale
      testID={`book-card-${book.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${book.title} by ${book.author}, ${formatPrice(book.purchasePrice)}, rated ${book.rating}`}
      onPress={open}
      scaleTo={0.97}
      style={{ width }}
    >
      <BookCover book={book} width={width} elevated />
      <View style={styles.meta}>
        <Text variant="bookTitle" numberOfLines={2} style={styles.title}>
          {book.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.footer}>
          <Rating value={book.rating} compact />
          <Text variant="bodySmall" weight="700">
            {formatPrice(book.purchasePrice)}
          </Text>
        </View>
        {showDelivery ? <DeliveryAvailability delivery={book.delivery} /> : null}
      </View>
    </PressableScale>
  );
}

export const BookCard = memo(BookCardBase);

const styles = StyleSheet.create({
  meta: { marginTop: spacing.md, gap: spacing.xs },
  title: { minHeight: 40 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
