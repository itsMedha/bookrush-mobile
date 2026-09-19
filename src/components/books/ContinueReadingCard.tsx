import { useRouter } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';
import { routes } from '@/utils/routes';
import { BookCover } from './BookCover';

interface ContinueReadingCardProps {
  book: Book;
  /** 0 – 1 */
  progress: number;
}

export const CONTINUE_CARD_WIDTH = 280;

function ContinueReadingCardBase({ book, progress }: ContinueReadingCardProps) {
  const router = useRouter();
  const percent = Math.round(progress * 100);
  const pagesRead = Math.round(book.pages * progress);

  return (
    <PressableScale
      testID={`continue-${book.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Continue reading ${book.title}, ${percent} percent complete`}
      onPress={() => router.push(routes.book(book.id))}
      scaleTo={0.98}
      style={styles.card}
    >
      <BookCover book={book} width={64} elevated />
      <View style={styles.details}>
        <Text variant="bookTitle" numberOfLines={2}>
          {book.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.progress}>
          <ProgressBar value={progress} />
          <View style={styles.progressLabels}>
            <Text variant="caption" color="accentText" weight="700">
              {percent}%
            </Text>
            <Text variant="caption" color="textSecondary">
              {pagesRead} / {book.pages} pages
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

export const ContinueReadingCard = memo(ContinueReadingCardBase);

const styles = StyleSheet.create({
  card: {
    width: CONTINUE_CARD_WIDTH,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  details: { flex: 1, justifyContent: 'space-between', gap: spacing.xs },
  progress: { gap: spacing.xs },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
});
