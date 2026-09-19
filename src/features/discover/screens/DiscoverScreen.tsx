import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View, type ListRenderItem } from 'react-native';
import { BookCard } from '@/components/books/BookCard';
import { BookRow } from '@/components/books/BookRow';
import { BookListSkeleton } from '@/components/books/BookSkeletons';
import { CartButton } from '@/components/ui/CartButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSearchBooks } from '@/features/books/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { errorMessage } from '@/services/http';
import { useSearchStore } from '@/stores/searchStore';
import { layout, spacing } from '@/theme';
import { GENRES, type Book, type Genre } from '@/types';
import { DiscoverIdle } from '../components/DiscoverIdle';
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  FilterSheet,
  type BrowseFilters,
} from '../components/FilterSheet';
import { ResultsHeader } from '../components/ResultsHeader';
import { isSortOption } from '../constants';

const GRID_GAP = spacing.md;
const keyExtractor = (book: Book) => book.id;
const RowSeparator = () => <View style={styles.rowGap} />;

const isGenre = (value: string | undefined): value is Genre =>
  GENRES.some((genre) => genre === value);

export default function DiscoverScreen() {
  const params = useLocalSearchParams<{
    focus?: string;
    genre?: string;
    sort?: string;
    express?: string;
    q?: string;
  }>();
  const { width } = useWindowDimensions();
  const addRecent = useSearchStore((state) => state.addRecent);

  const [query, setQuery] = useState(params.q ?? '');
  const [genre, setGenre] = useState<Genre | undefined>(
    isGenre(params.genre) ? params.genre : undefined,
  );
  const [filters, setFilters] = useState<BrowseFilters>({
    ...DEFAULT_FILTERS,
    sort: isSortOption(params.sort) ? params.sort : 'relevance',
    expressOnly: params.express === '1',
  });
  const [gridMode, setGridMode] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [focusToken, setFocusToken] = useState(params.focus ? 1 : 0);

  // Tabs stay mounted, so incoming deep links (Home → "See all") must re-apply their params.
  // Adjusting state while rendering (instead of in an effect) avoids a wasted render pass.
  const paramsKey = `${params.q}|${params.genre}|${params.sort}|${params.express}|${params.focus}`;
  const [appliedKey, setAppliedKey] = useState(paramsKey);
  if (paramsKey !== appliedKey) {
    setAppliedKey(paramsKey);
    if (params.q || params.genre || params.sort || params.express || params.focus) {
      setQuery(params.q ?? '');
      setGenre(isGenre(params.genre) ? params.genre : undefined);
      setFilters({
        ...DEFAULT_FILTERS,
        sort: isSortOption(params.sort) ? params.sort : 'relevance',
        expressOnly: params.express === '1',
      });
      if (params.focus) setFocusToken((token) => token + 1);
    }
  }

  const debouncedQuery = useDebouncedValue(query, 250);
  const activeFilters = countActiveFilters(filters);
  const browsing = query.trim().length > 0 || genre !== undefined || activeFilters > 0;

  const search = useSearchBooks({ query: debouncedQuery, genre, ...filters }, browsing);

  const submitSearch = useCallback(
    (term: string) => {
      setQuery(term);
      addRecent(term);
    },
    [addRecent],
  );

  const clearAll = useCallback(() => {
    setQuery('');
    setGenre(undefined);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const cardWidth = useMemo(() => {
    const usable = Math.min(width, layout.maxContentWidth) - layout.screenPadding * 2;
    return Math.floor((usable - GRID_GAP) / 2);
  }, [width]);

  const renderItem = useCallback<ListRenderItem<Book>>(
    ({ item }) =>
      gridMode ? (
        <BookCard book={item} width={cardWidth} showDelivery />
      ) : (
        <View style={styles.rowItem}>
          <BookRow book={item} onPress={() => addRecent(query)} />
        </View>
      ),
    [gridMode, cardWidth, addRecent, query],
  );

  const header = (
    <ResultsHeader
      count={search.data?.length}
      genre={genre}
      onGenre={setGenre}
      activeFilters={activeFilters}
      onOpenFilters={() => setFiltersOpen(true)}
      gridMode={gridMode}
      onToggleLayout={() => setGridMode((value) => !value)}
    />
  );

  return (
    <Screen>
      <ScreenHeader title="Discover" large showBack={false} right={<CartButton />} />
      <View style={styles.search}>
        <SearchBar
          key={focusToken}
          testID="discover-search"
          value={query}
          onChangeText={setQuery}
          onSubmit={() => submitSearch(query)}
          autoFocus={focusToken > 0}
        />
      </View>

      {browsing ? (
        search.isError ? (
          <View>
            {header}
            <ErrorState
              message={errorMessage(search.error)}
              onRetry={() => void search.refetch()}
              retrying={search.isFetching}
            />
          </View>
        ) : (
          <FlatList
            key={gridMode ? 'grid' : 'list'}
            testID="results-list"
            data={search.data ?? []}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={gridMode ? 2 : 1}
            columnWrapperStyle={gridMode ? styles.column : undefined}
            ItemSeparatorComponent={gridMode ? GridSeparator : RowSeparator}
            ListHeaderComponent={header}
            ListEmptyComponent={
              search.isPending ? (
                <BookListSkeleton />
              ) : (
                <EmptyState
                  icon="search-outline"
                  title="No books found"
                  message="Try a different title, author or genre — or clear your filters."
                  actionLabel="Clear search"
                  onAction={clearAll}
                />
              )
            }
            contentContainerStyle={styles.results}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            style={search.isPlaceholderData ? styles.stale : undefined}
          />
        )
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={<DiscoverIdle onSearch={submitSearch} onGenre={setGenre} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterSheet
        visible={filtersOpen}
        value={filters}
        onApply={setFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </Screen>
  );
}

const GridSeparator = () => <View style={styles.gridGap} />;

const styles = StyleSheet.create({
  search: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.lg },
  results: { paddingBottom: spacing.huge, paddingHorizontal: 0 },
  rowItem: { paddingHorizontal: layout.screenPadding },
  rowGap: { height: spacing.md },
  gridGap: { height: spacing.xl },
  column: { gap: GRID_GAP, paddingHorizontal: layout.screenPadding },
  stale: { opacity: 0.6 },
});
