import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookRail } from '@/components/books/BookRail';
import { BookRailSkeleton } from '@/components/books/BookSkeletons';
import { ContinueReadingCard } from '@/components/books/ContinueReadingCard';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Screen } from '@/components/ui/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useContinueReading, useRecommendedBooks, useTrendingBooks } from '@/features/books/hooks';
import { PostCard } from '@/features/community/components/PostCard';
import { PostListSkeleton } from '@/features/community/components/PostSkeleton';
import { useFeed } from '@/features/community/hooks';
import { useRefresh } from '@/hooks/useRefresh';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { HomeHeader } from '../components/HomeHeader';
import { QuickDeliveryBanner } from '../components/QuickDeliveryBanner';
import { TrendingList } from '../components/TrendingList';

const REFRESH_ROOTS = [['books'], ['community', 'posts']] as const;
const TRENDING_LIMIT = 5;

const ContinueSeparator = () => <View style={styles.continueGap} />;

function Section({ children, index }: { children: ReactNode; index: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(380).delay(index * 70)} style={styles.section}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const continueReading = useContinueReading();
  const recommended = useRecommendedBooks();
  const trending = useTrendingBooks();
  const feed = useFeed('for-you');
  const { refreshing, onRefresh } = useRefresh(REFRESH_ROOTS);
  const hasContinueReading = !(continueReading.isSuccess && continueReading.data.length === 0);

  return (
    <Screen>
      <ScrollView
        testID="home-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <HomeHeader />

        <View style={styles.search}>
          <SearchBar
            testID="home-search"
            onPress={() => router.navigate(routes.discoverWith({ focus: true }))}
          />
        </View>

        {hasContinueReading ? (
          <Section index={0}>
            <SectionHeader title="Continue reading" />
            <AsyncBoundary
              query={continueReading}
              skeleton={
                <View style={styles.continueSkeleton}>
                  <Skeleton width={280} height={112} radius="lg" />
                  <Skeleton width={280} height={112} radius="lg" />
                </View>
              }
            >
              {(entries) => (
                <FlatList
                  horizontal
                  data={entries}
                  keyExtractor={(entry) => entry.book.id}
                  renderItem={({ item }) => (
                    <ContinueReadingCard book={item.book} progress={item.progress} />
                  )}
                  ItemSeparatorComponent={ContinueSeparator}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rail}
                />
              )}
            </AsyncBoundary>
          </Section>
        ) : null}

        <Section index={1}>
          <QuickDeliveryBanner />
        </Section>

        <Section index={2}>
          <SectionHeader
            title="Recommended for you"
            subtitle="Picked from what you have been reading"
            actionLabel="See all"
            onAction={() => router.navigate(routes.discoverWith({ sort: 'rating' }))}
          />
          <AsyncBoundary query={recommended} skeleton={<BookRailSkeleton />}>
            {(books) => <BookRail books={books} />}
          </AsyncBoundary>
        </Section>

        <Section index={3}>
          <SectionHeader
            title="Trending now"
            actionLabel="See all"
            onAction={() => router.navigate(routes.discoverWith({ sort: 'popular' }))}
          />
          <AsyncBoundary
            query={trending}
            skeleton={
              <View style={styles.trendingSkeleton}>
                {[0, 1, 2].map((key) => (
                  <Skeleton key={key} height={72} radius="lg" />
                ))}
              </View>
            }
          >
            {(books) => <TrendingList books={books.slice(0, TRENDING_LIMIT)} />}
          </AsyncBoundary>
        </Section>

        <Section index={4}>
          <SectionHeader
            title="From the community"
            subtitle="What readers are talking about"
            actionLabel="Join in"
            onAction={() => router.navigate(routes.community)}
          />
          <View style={styles.posts}>
            <AsyncBoundary query={feed} skeleton={<PostListSkeleton />}>
              {(posts) => (
                <>
                  {posts.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              )}
            </AsyncBoundary>
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.huge, gap: spacing.xxl },
  search: { paddingHorizontal: layout.screenPadding, marginTop: -spacing.xs },
  section: { gap: spacing.lg },
  rail: { paddingHorizontal: layout.screenPadding },
  continueGap: { width: spacing.md },
  continueSkeleton: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
  },
  trendingSkeleton: { gap: spacing.md, paddingHorizontal: layout.screenPadding },
  posts: { gap: spacing.md, paddingHorizontal: layout.screenPadding },
});
