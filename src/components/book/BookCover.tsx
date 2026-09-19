import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/theme';
import type { Book } from '@/types';
import { coverSource, type CoverSize } from '@/utils/images';

/** Standard trade-paperback proportions. */
export const COVER_ASPECT = 1.5;

interface BookCoverProps {
  book: Pick<Book, 'coverUrl' | 'coverColor' | 'title' | 'author'>;
  width: number;
  size?: CoverSize;
  elevated?: boolean;
}

/**
 * Remote cover with an editorial typographic fallback (used offline, on 404s, and as the
 * colour behind the image while it decodes).
 */
function BookCoverBase({ book, width, size = 'thumb', elevated = false }: BookCoverProps) {
  // 0: requested size, 1: full-size retry (some ISBNs have no thumbnail), 2: typographic fallback
  const [attempt, setAttempt] = useState(0);
  const failed = attempt >= 2 || (attempt === 1 && size === 'full');
  const height = Math.round(width * COVER_ASPECT);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Cover of ${book.title} by ${book.author}`}
      style={[
        styles.frame,
        { width, height, backgroundColor: book.coverColor },
        elevated ? { boxShadow: shadows.cover } : null,
      ]}
    >
      {failed ? (
        <View style={styles.fallback}>
          <View style={styles.rule} />
          <Text
            variant="bookTitle"
            color="textInverse"
            numberOfLines={4}
            style={{ fontSize: Math.max(11, width * 0.13), lineHeight: Math.max(14, width * 0.16) }}
          >
            {book.title}
          </Text>
          <Text
            variant="caption"
            color="textInverseMuted"
            numberOfLines={2}
            style={{ fontSize: Math.max(9, width * 0.08) }}
          >
            {book.author}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: coverSource(book.coverUrl, attempt === 0 ? size : 'full') }}
          recyclingKey={`${book.coverUrl}-${attempt}`}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={StyleSheet.absoluteFill}
          onError={() => setAttempt((value) => value + 1)}
        />
      )}
      {/* Subtle spine highlight so flat covers read as physical books. */}
      <View style={styles.spine} />
    </View>
  );
}

export const BookCover = memo(BookCoverBase);

const styles = StyleSheet.create({
  frame: { borderRadius: radius.cover, overflow: 'hidden' },
  fallback: { flex: 1, padding: spacing.sm, justifyContent: 'flex-end', gap: spacing.xs },
  rule: { width: 18, height: 2, backgroundColor: colors.accent, marginBottom: spacing.xs },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    pointerEvents: 'none',
  },
});
