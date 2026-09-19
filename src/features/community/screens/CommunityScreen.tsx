import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, type ListRenderItem } from 'react-native';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedTabs, type TabItem } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useRefresh } from '@/hooks/useRefresh';
import { errorMessage } from '@/services/http';
import { colors, layout, radius, shadows, spacing } from '@/theme';
import type { FeedPost, FeedTab } from '@/types';
import { routes } from '@/utils/routes';
import { ClubCard } from '../components/ClubCard';
import { PostCard } from '../components/PostCard';
import { PostListSkeleton } from '../components/PostSkeleton';
import { useClubs, useFeed } from '../hooks';

const TABS: readonly TabItem<FeedTab>[] = [
  { key: 'for-you', label: 'For You' },
  { key: 'following', label: 'Following' },
  { key: 'trending', label: 'Trending' },
];

const REFRESH_ROOTS = [['community']] as const;
const keyExtractor = (post: FeedPost) => post.id;
const Separator = () => <View style={styles.separator} />;
const ClubSeparator = () => <View style={styles.clubGap} />;

function ClubsSection() {
  const clubs = useClubs();

  return (
    <View style={styles.clubs}>
      <SectionHeader title="Book clubs" subtitle="Read together, one book at a time" />
      <AsyncBoundary
        query={clubs}
        skeleton={
          <View style={styles.clubSkeleton}>
            <Skeleton width={236} height={92} radius="lg" />
            <Skeleton width={236} height={92} radius="lg" />
          </View>
        }
      >
        {(items) => (
          <FlatList
            horizontal
            data={items}
            keyExtractor={(club) => club.id}
            renderItem={({ item }) => <ClubCard club={item} />}
            ItemSeparatorComponent={ClubSeparator}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clubList}
          />
        )}
      </AsyncBoundary>
    </View>
  );
}

export default function CommunityScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<FeedTab>('for-you');
  const feed = useFeed(tab);
  const { refreshing, onRefresh } = useRefresh(REFRESH_ROOTS);

  const renderItem = useCallback<ListRenderItem<FeedPost>>(
    ({ item }) => (
      <View style={styles.post}>
        <PostCard post={item} />
      </View>
    ),
    [],
  );

  const listEmpty = () => {
    if (feed.isPending) {
      return (
        <View style={styles.post}>
          <PostListSkeleton />
        </View>
      );
    }
    if (feed.isError) {
      return (
        <ErrorState
          message={errorMessage(feed.error)}
          onRetry={() => void feed.refetch()}
          retrying={feed.isFetching}
        />
      );
    }
    return tab === 'following' ? (
      <EmptyState
        testID="empty-following"
        icon="people-outline"
        title="Your reading community is waiting."
        message="Follow readers to see what they are reading, reviewing and recommending."
        actionLabel="Find readers"
        onAction={() => setTab('for-you')}
      />
    ) : (
      <EmptyState
        icon="chatbubbles-outline"
        title="Nothing here yet"
        message="Be the first to share."
      />
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Community" large showBack={false} />
      <View style={styles.tabs}>
        <SegmentedTabs items={TABS} value={tab} onChange={setTab} />
      </View>

      <FlatList
        testID="feed-list"
        data={feed.data ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          tab === 'for-you' ? <ClubsSection /> : <View style={styles.headerGap} />
        }
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        windowSize={7}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      />

      <View style={styles.fabWrap}>
        <PressableScale
          testID="create-post-fab"
          accessibilityRole="button"
          accessibilityLabel="Create a post"
          onPress={() => router.push(routes.createPost)}
          scaleTo={0.94}
          style={styles.fab}
        >
          <Icon name="create-outline" size={20} color="textInverse" />
          <Text variant="button" color="textInverse">
            Post
          </Text>
        </PressableScale>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { paddingHorizontal: layout.screenPadding },
  list: { paddingBottom: 110 },
  headerGap: { height: spacing.lg },
  separator: { height: spacing.md },
  post: { paddingHorizontal: layout.screenPadding },
  clubs: { gap: spacing.lg, paddingVertical: spacing.xl },
  clubList: { paddingHorizontal: layout.screenPadding },
  clubGap: { width: spacing.md },
  clubSkeleton: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: layout.screenPadding },
  fabWrap: {
    position: 'absolute',
    right: layout.screenPadding,
    bottom: spacing.xl,
    pointerEvents: 'box-none',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    boxShadow: shadows.lg,
  },
});
