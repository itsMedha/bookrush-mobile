import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useSearchBooks } from '@/features/books/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { colors, radius, spacing } from '@/theme';
import type { Book } from '@/types';

export const MAX_ATTACHED_BOOKS = 5;

interface BookPickerSheetProps {
  visible: boolean;
  selected: Book[];
  onDone: (books: Book[]) => void;
  onClose: () => void;
}

/** Search the catalogue and attach up to five books to a post. */
export function BookPickerSheet({ visible, selected, onDone, onClose }: BookPickerSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add books" scrollable>
      <PickerBody initial={selected} onDone={onDone} />
    </BottomSheet>
  );
}

// Mounted fresh each time the sheet opens so the draft selection starts from the post's books.
function PickerBody({ initial, onDone }: { initial: Book[]; onDone: (books: Book[]) => void }) {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(initial);
  const debounced = useDebouncedValue(query, 200);
  const results = useSearchBooks({ query: debounced, sort: query ? 'relevance' : 'popular' });

  const toggle = (book: Book) =>
    setDraft((current) =>
      current.some((item) => item.id === book.id)
        ? current.filter((item) => item.id !== book.id)
        : current.length < MAX_ATTACHED_BOOKS
          ? [...current, book]
          : current,
    );

  return (
    <View style={styles.body}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search for a book..." />
      <View style={styles.list}>
        {results.isPending ? (
          <>
            <Skeleton height={64} radius="md" />
            <Skeleton height={64} radius="md" />
            <Skeleton height={64} radius="md" />
          </>
        ) : (
          (results.data ?? []).slice(0, 12).map((book) => {
            const isSelected = draft.some((item) => item.id === book.id);
            return (
              <PressableScale
                key={book.id}
                testID={`pick-book-${book.id}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${book.title} by ${book.author}`}
                onPress={() => toggle(book)}
                scaleTo={0.99}
                style={[styles.row, isSelected ? styles.rowSelected : null]}
              >
                <BookCover book={book} width={36} />
                <View style={styles.text}>
                  <Text variant="bookTitle" numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {book.author}
                  </Text>
                </View>
                <Icon
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? 'accent' : 'textTertiary'}
                />
              </PressableScale>
            );
          })
        )}
      </View>
      <Button
        testID="books-done"
        label={
          draft.length > 0 ? `Add ${draft.length} ${draft.length === 1 ? 'book' : 'books'}` : 'Done'
        }
        onPress={() => onDone(draft)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingBottom: spacing.sm },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowSelected: { borderColor: colors.ink },
  text: { flex: 1, gap: 2 },
});
