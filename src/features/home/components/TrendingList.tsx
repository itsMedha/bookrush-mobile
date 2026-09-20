import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { Divider } from '@/components/ui/Divider';
import { PressableScale } from '@/components/ui/PressableScale';
import { Rating } from '@/components/ui/Rating';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import { formatPrice } from '@/utils/format';
import { routes } from '@/utils/routes';

/** Editorial ranked list: serif numerals give trending its own voice next to the rails. */
export function TrendingList({ books }: { books: Book[] }) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {books.map((book, index) => (
          <View key={book.id}>
            {index > 0 ? <Divider /> : null}
            <PressableScale
              testID={`trending-${book.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Number ${index + 1} trending: ${book.title} by ${book.author}`}
              onPress={() => router.push(routes.book(book.id))}
              scaleTo={0.99}
              style={styles.row}
            >
              <Text variant="heading1" color="accentText" style={styles.rank}>
                {index + 1}
              </Text>
              <BookCover book={book} width={48} />
              <View style={styles.details}>
                <Text variant="bookTitle" numberOfLines={1}>
                  {book.title}
                </Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {book.author}
                </Text>
                <Rating value={book.rating} compact />
              </View>
              <Text variant="bodySmall" weight="700">
                {formatPrice(book.purchasePrice)}
              </Text>
            </PressableScale>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: layout.screenPadding },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rank: { width: 26, textAlign: 'center' },
  details: { flex: 1, gap: 2 },
});
