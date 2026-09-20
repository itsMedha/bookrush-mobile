import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { DeliveryAvailability } from '@/components/books/DeliveryAvailability';
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
      <BookCover book={book} width={48} />
      <View style={styles.details}>
        <Text variant="bookTitle" numberOfLines={1}>
          {book.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.meta}>
          <Text variant="bodySmall" weight="700">
            {formatPrice(book.purchasePrice)}
          </Text>
          <Rating value={book.rating} compact />
        </View>
        <DeliveryAvailability delivery={book.delivery} />
      </View>
      <View style={styles.cta}>
        <Text variant="caption" weight="700" color="accentText">
          View
        </Text>
        <Icon name="chevron-forward" size={14} color="accentText" />
      </View>
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
  details: { flex: 1, gap: spacing.xs },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
