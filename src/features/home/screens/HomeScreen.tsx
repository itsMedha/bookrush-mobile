import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookRail } from '@/components/books/BookRail';
import { BookRailSkeleton } from '@/components/books/BookSkeletons';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Screen } from '@/components/ui/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useBestSellers,
  useDeals,
  useInstantBooks,
  useRecommendedBooks,
  useTrendingBooks,
} from '@/features/books/hooks';
import { PostCard } from '@/features/community/components/PostCard';
import { PostListSkeleton } from '@/features/community/components/PostSkeleton';
import { useFeed } from '@/features/community/hooks';
import { useRefresh } from '@/hooks/useRefresh';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { CategoryRail } from '../components/CategoryRail';
import { InstantDeliveryBanner } from '../components/InstantDeliveryBanner';
import { LocationBar } from '../components/LocationBar';
import { TrendingList } from '../components/TrendingList';

const REFRESH_ROOTS = [['books'], ['community', 'posts']] as const;

function Section({ children, index }: { children: ReactNode; index: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(380).delay(index * 60)} style={styles.section}>
      {children}
    </Animated.View>
  );
}

function RailSection({
  title,
  subtitle,
  action,
  onAction,
  query,
  index,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  query: ReturnType<typeof useInstantBooks>;
  index: number;
}) {
  return (
    <Section index={index}>
      <SectionHeader title={title} subtitle={subtitle} actionLabel={action} onAction={onAction} />
      <AsyncBoundary query={query} skeleton={<BookRailSkeleton />}>
        {(books) => <BookRail books={books} />}
      </AsyncBoundary>
    </Section>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const instant = useInstantBooks();
  const bestSellers = useBestSellers();
  const deals = useDeals();
  const recommended = useRecommendedBooks();
  const trending = useTrendingBooks();
  const feed = useFeed('for-you');
  const { refreshing, onRefresh } = useRefresh(REFRESH_ROOTS);

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
        <LocationBar />

        <View style={styles.search}>
          <SearchBar
            testID="home-search"
            placeholder="Search books, authors, ISBN..."
            onPress={() => router.navigate(routes.discoverWith({ focus: true }))}
          />
        </View>

        <Section index={0}>
          <InstantDeliveryBanner />
        </Section>

        <Section index={1}>
          <SectionHeader title="Shop by category" />
          <CategoryRail />
        </Section>

        <RailSection
          index={2}
          title="Available near you"
          subtitle="In stock at a store close by"
          action="See all"
          onAction={() => router.navigate(routes.discoverWith({ instant: true }))}
          query={instant}
        />

        <RailSection
          index={3}
          title="Best sellers"
          action="See all"
          onAction={() => router.navigate(routes.discoverWith({ sort: 'popular' }))}
          query={bestSellers}
        />

        <RailSection index={4} title="Deals" subtitle="Biggest savings this week" query={deals} />

        <Section index={5}>
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
            {(books) => <TrendingList books={books.slice(0, 5)} />}
          </AsyncBoundary>
        </Section>

        <RailSection
          index={6}
          title="Recommended for you"
          subtitle="Based on what you have been reading"
          query={recommended}
        />

        <Section index={7}>
          <SectionHeader
            title="From the community"
            subtitle="What readers are talking about"
            actionLabel="Join in"
            onAction={() => router.navigate(routes.community)}
          />
          <View style={styles.posts}>
            <AsyncBoundary query={feed} skeleton={<PostListSkeleton count={1} />}>
              {(posts) => (
                <>
                  {posts.slice(0, 1).map((post) => (
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
  trendingSkeleton: { gap: spacing.md, paddingHorizontal: layout.screenPadding },
  posts: { gap: spacing.md, paddingHorizontal: layout.screenPadding },
});
