import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';
import { Rating } from '@/components/ui/Rating';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import { formatPrice } from '@/utils/format';
import { routes } from '@/utils/routes';
import { BookCover } from './BookCover';
import { DeliveryBadge } from './DeliveryBadge';
import { Price } from './Price';

interface BookRowProps {
  book: Book;
  onPress?: (book: Book) => void;
}

const COVER_WIDTH = 76;

function BookRowBase({ book, onPress }: BookRowProps) {
  const router = useRouter();
  const open = useCallback(() => {
    onPress?.(book);
    router.push(routes.book(book.id));
  }, [router, book, onPress]);

  return (
    <PressableScale
      testID={`book-row-${book.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${book.title} by ${book.author}, ${formatPrice(book.price)}`}
      onPress={open}
      scaleTo={0.985}
      style={styles.row}
    >
      <BookCover book={book} width={COVER_WIDTH} elevated />
      <View style={styles.details}>
        <Text variant="bookTitle" numberOfLines={2}>
          {book.title}
        </Text>
        <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
          {book.author}
        </Text>
        <Rating value={book.rating} count={book.ratingCount} />
        <View style={styles.spacer} />
        <Price price={book.price} mrp={book.mrp} />
        <DeliveryBadge book={book} />
      </View>
    </PressableScale>
  );
}

export const BookRow = memo(BookRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  details: { flex: 1, gap: spacing.xs, justifyContent: 'flex-start' },
  spacer: { flexGrow: 1 },
});
