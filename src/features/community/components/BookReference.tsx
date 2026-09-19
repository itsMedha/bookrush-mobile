import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Rating } from '@/components/ui/Rating';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import { formatPrice } from '@/utils/format';
import { routes } from '@/utils/routes';

/** Compact "this post is about…" card shown under a post that references one book. */
export function BookReference({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <PressableScale
      testID={`book-reference-${book.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${book.title} by ${book.author}. Open book`}
      onPress={() => router.push(routes.book(book.id))}
      scaleTo={0.985}
      style={styles.card}
    >
      <BookCover book={book} width={44} />
      <View style={styles.details}>
        <Text variant="bookTitle" numberOfLines={1}>
          {book.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.meta}>
          <Rating value={book.rating} compact />
          <Text variant="caption" color="textSecondary">
            · {formatPrice(book.price)}
          </Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={18} color="textTertiary" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  details: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
