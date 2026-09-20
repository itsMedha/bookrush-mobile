import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { trendingSearches } from '@/data/books';
import type { IconName } from '@/components/ui/Icon';
import { useGenreCounts } from '@/features/books/hooks';
import { useSearchStore } from '@/stores/searchStore';
import { colors, layout, radius, spacing } from '@/theme';
import type { Genre } from '@/types';
import { pluralize } from '@/utils/format';
import { routes } from '@/utils/routes';
import { GENRE_ICONS } from '../constants';

interface DiscoverIdleProps {
  onSearch: (term: string) => void;
  onGenre: (genre: Genre) => void;
}

/** What Discover shows before the reader types: recents, trending searches and categories. */
const SHELVES: {
  testId: string;
  label: string;
  icon: IconName;
  tint: string;
  iconColor: 'accentText' | 'sageText';
  href: string;
}[] = [
  {
    testId: 'instant',
    label: 'Instant delivery',
    icon: 'flash',
    tint: colors.accentSoft,
    iconColor: 'accentText',
    href: routes.discoverWith({ instant: true }),
  },
  {
    testId: 'bestsellers',
    label: 'Best sellers',
    icon: 'trophy-outline',
    tint: colors.sageSoft,
    iconColor: 'sageText',
    href: routes.discoverWith({ sort: 'popular' }),
  },
  {
    testId: 'toprated',
    label: 'Top rated',
    icon: 'star-outline',
    tint: colors.accentSoft,
    iconColor: 'accentText',
    href: routes.discoverWith({ sort: 'rating' }),
  },
  {
    testId: 'budget',
    label: 'Under ₹299',
    icon: 'pricetag-outline',
    tint: colors.sageSoft,
    iconColor: 'sageText',
    href: routes.discoverWith({ sort: 'price-asc' }),
  },
];

export function DiscoverIdle({ onSearch, onGenre }: DiscoverIdleProps) {
  const router = useRouter();
  const recent = useSearchStore((state) => state.recent);
  const removeRecent = useSearchStore((state) => state.removeRecent);
  const clearRecent = useSearchStore((state) => state.clearRecent);
  const genres = useGenreCounts();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text variant="heading3">Shop by</Text>
        <View style={styles.shelves}>
          {SHELVES.map((shelf) => (
            <PressableScale
              key={shelf.label}
              testID={`shelf-${shelf.testId}`}
              accessibilityRole="button"
              accessibilityLabel={shelf.label}
              onPress={() => router.navigate(shelf.href)}
              scaleTo={0.97}
              style={styles.shelf}
            >
              <View style={[styles.shelfIcon, { backgroundColor: shelf.tint }]}>
                <Icon name={shelf.icon} size={18} color={shelf.iconColor} />
              </View>
              <Text variant="bodySmall" weight="700" numberOfLines={1}>
                {shelf.label}
              </Text>
            </PressableScale>
          ))}
        </View>
      </View>

      {recent.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="heading3">Recent searches</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear recent searches"
              hitSlop={12}
              onPress={clearRecent}
            >
              <Text variant="bodySmall" weight="600" color="accentText">
                Clear
              </Text>
            </Pressable>
          </View>
          {recent.map((term) => (
            <View key={term} style={styles.recentRow}>
              <PressableScale
                testID={`recent-${term}`}
                accessibilityRole="button"
                accessibilityLabel={`Search ${term}`}
                onPress={() => onSearch(term)}
                scaleTo={0.99}
                style={styles.recentMain}
              >
                <Icon name="time-outline" size={18} color="textSecondary" />
                <Text variant="body">{term}</Text>
              </PressableScale>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${term} from recent searches`}
                hitSlop={12}
                onPress={() => removeRecent(term)}
              >
                <Icon name="close" size={18} color="textTertiary" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text variant="heading3">Trending searches</Text>
        <View style={styles.chips}>
          {trendingSearches.map((term) => (
            <Chip key={term} icon="trending-up" label={term} onPress={() => onSearch(term)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="heading3">Browse by category</Text>
        <AsyncBoundary
          query={genres}
          skeleton={
            <View style={styles.grid}>
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} height={72} radius="lg" style={styles.tileSkeleton} />
              ))}
            </View>
          }
        >
          {(items) => (
            <View style={styles.grid}>
              {items.map(({ genre, count }) => (
                <PressableScale
                  key={genre}
                  testID={`genre-${genre}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${genre}, ${pluralize(count, 'book')}`}
                  onPress={() => onGenre(genre)}
                  scaleTo={0.97}
                  style={styles.tile}
                >
                  <View style={styles.tileIcon}>
                    <Icon name={GENRE_ICONS[genre]} size={20} color="accentText" />
                  </View>
                  <View style={styles.tileText}>
                    <Text variant="bodySmall" weight="700" numberOfLines={1}>
                      {genre}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      {pluralize(count, 'book')}
                    </Text>
                  </View>
                </PressableScale>
              ))}
            </View>
          )}
        </AsyncBoundary>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.huge,
  },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recentMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  shelves: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  shelf: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shelfIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileSkeleton: { flexBasis: '47%', flexGrow: 1 },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { flex: 1 },
});
