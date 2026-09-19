import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius, spacing } from '@/theme';
import { GENRES, type Genre } from '@/types';
import { pluralize } from '@/utils/format';

interface ResultsHeaderProps {
  count: number | undefined;
  genre: Genre | undefined;
  onGenre: (genre: Genre | undefined) => void;
  activeFilters: number;
  onOpenFilters: () => void;
  gridMode: boolean;
  onToggleLayout: () => void;
}

/** Genre quick-switch row + result count + filter/layout controls. */
export function ResultsHeader({
  count,
  genre,
  onGenre,
  activeFilters,
  onOpenFilters,
  gridMode,
  onToggleLayout,
}: ResultsHeaderProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        <Chip label="All" selected={!genre} onPress={() => onGenre(undefined)} />
        {GENRES.map((item) => (
          <Chip
            key={item}
            testID={`chip-${item}`}
            label={item}
            selected={genre === item}
            onPress={() => onGenre(genre === item ? undefined : item)}
          />
        ))}
      </ScrollView>

      <View style={styles.bar}>
        <Text variant="bodySmall" color="textSecondary" testID="result-count" style={styles.count}>
          {count === undefined ? 'Searching…' : pluralize(count, 'result')}
        </Text>
        <IconButton
          testID="layout-toggle"
          icon={gridMode ? 'list-outline' : 'grid-outline'}
          accessibilityLabel={gridMode ? 'Switch to list view' : 'Switch to grid view'}
          variant="filled"
          size={18}
          onPress={onToggleLayout}
        />
        <View>
          <IconButton
            testID="open-filters"
            icon="options-outline"
            accessibilityLabel={
              activeFilters > 0 ? `Sort and filter, ${activeFilters} active` : 'Sort and filter'
            }
            variant="filled"
            size={18}
            onPress={onOpenFilters}
          />
          {activeFilters > 0 ? (
            <View style={styles.badge}>
              <Text variant="caption" color="ink" weight="700" style={styles.badgeText}>
                {activeFilters}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.md },
  chips: { gap: spacing.sm, paddingHorizontal: layout.screenPadding },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
  },
  count: { flex: 1 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  badgeText: { fontSize: 10, lineHeight: 12 },
});
