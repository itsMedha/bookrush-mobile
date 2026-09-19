import { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { layout, spacing } from '@/theme';
import type { Book } from '@/types';
import { BOOK_CARD_WIDTH, BookCard } from './BookCard';

interface BookRailProps {
  books: Book[];
  cardWidth?: number;
  showDelivery?: boolean;
}

const keyExtractor = (book: Book) => book.id;
const Separator = () => <View style={styles.separator} />;

function BookRailBase({ books, cardWidth = BOOK_CARD_WIDTH, showDelivery = false }: BookRailProps) {
  const renderItem = useCallback<ListRenderItem<Book>>(
    ({ item }) => <BookCard book={item} width={cardWidth} showDelivery={showDelivery} />,
    [cardWidth, showDelivery],
  );

  return (
    <FlatList
      horizontal
      data={books}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      initialNumToRender={4}
      windowSize={5}
    />
  );
}

export const BookRail = memo(BookRailBase);

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.screenPadding },
  separator: { width: spacing.lg },
});
