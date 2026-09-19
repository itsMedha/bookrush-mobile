import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BookCard } from '@/components/books/BookCard';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { BookCover } from '@/components/books/BookCover';
import { useBooksByIds, useMyReviews } from '@/features/books/hooks';
import { ClubCard } from '@/features/community/components/ClubCard';
import { PostCard } from '@/features/community/components/PostCard';
import { PostListSkeleton } from '@/features/community/components/PostSkeleton';
import { useClubs, usePostsByAuthor } from '@/features/community/hooks';
import { CURRENT_USER_ID } from '@/data/users';
import { useCommunityStore } from '@/stores/communityStore';
import { useUserStore } from '@/stores/userStore';
import { layout, spacing } from '@/theme';
import { timeAgo } from '@/utils/date';
import { routes } from '@/utils/routes';

const COLUMNS = 3;
const GAP = spacing.md;

export type ProfileTabKey = 'books' | 'reviews' | 'posts' | 'clubs';

export function MyBooksTab() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const saved = useUserStore((state) => state.savedBookIds);
  const reading = useUserStore((state) => state.readingProgress);
  const ids = useMemo(() => [...new Set([...saved, ...Object.keys(reading)])], [saved, reading]);
  const books = useBooksByIds(ids);
  const cardWidth = Math.floor(
    (Math.min(width, layout.maxContentWidth) - layout.screenPadding * 2 - GAP * (COLUMNS - 1)) /
      COLUMNS,
  );

  return (
    <AsyncBoundary
      query={books}
      skeleton={
        <View style={styles.grid}>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} width={cardWidth} height={cardWidth * 1.5} radius="cover" />
          ))}
        </View>
      }
      empty={
        <EmptyState
          icon="library-outline"
          title="Your shelf is empty"
          message="Save books you want to read and they will live here."
          actionLabel="Discover books"
          onAction={() => router.navigate(routes.discover)}
        />
      }
      isEmpty={(items) => items.length === 0}
    >
      {(items) => (
        <View style={styles.grid} testID="my-books">
          {items.map((book) => (
            <BookCard key={book.id} book={book} width={cardWidth} />
          ))}
        </View>
      )}
    </AsyncBoundary>
  );
}

export function ReviewsTab() {
  const reviews = useMyReviews();

  return (
    <AsyncBoundary
      query={reviews}
      skeleton={
        <View style={styles.list}>
          <Skeleton height={110} radius="lg" />
          <Skeleton height={110} radius="lg" />
        </View>
      }
      empty={
        <EmptyState
          icon="star-outline"
          title="No reviews yet"
          message="Reviews you write appear here."
        />
      }
      isEmpty={(items) => items.length === 0}
    >
      {(items) => (
        <View style={styles.list}>
          {items.map((review) => (
            <Card key={review.id} padding="lg" style={styles.review}>
              <View style={styles.reviewBook}>
                <BookCover book={review.book} width={40} />
                <View style={styles.reviewMeta}>
                  <Text variant="bookTitle" numberOfLines={1}>
                    {review.book.title}
                  </Text>
                  <Rating value={review.rating} compact />
                </View>
                <Text variant="caption" color="textSecondary">
                  {timeAgo(review.createdAt)} ago
                </Text>
              </View>
              <Text variant="bodySmall" weight="700">
                {review.title}
              </Text>
              <Text variant="bodySmall" color="textSecondary">
                {review.body}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </AsyncBoundary>
  );
}

export function PostsTab() {
  const router = useRouter();
  const posts = usePostsByAuthor(CURRENT_USER_ID);

  return (
    <AsyncBoundary
      query={posts}
      skeleton={<PostListSkeleton />}
      empty={
        <EmptyState
          icon="create-outline"
          title="Share your first post"
          message="Tell readers what you are reading right now."
          actionLabel="Create a post"
          onAction={() => router.push(routes.createPost)}
        />
      }
      isEmpty={(items) => items.length === 0}
    >
      {(items) => (
        <View style={styles.list} testID="my-posts">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      )}
    </AsyncBoundary>
  );
}

export function ClubsTab() {
  const router = useRouter();
  const clubs = useClubs();
  const joined = useCommunityStore((state) => state.joinedClubIds);

  return (
    <AsyncBoundary
      query={clubs}
      skeleton={
        <View style={styles.list}>
          <Skeleton height={92} radius="lg" />
        </View>
      }
      empty={
        <EmptyState
          icon="people-outline"
          title="No clubs yet"
          message="Join a book club to read alongside others."
          actionLabel="Browse clubs"
          onAction={() => router.navigate(routes.community)}
        />
      }
      isEmpty={(items) => items.every((club) => !joined.includes(club.id))}
    >
      {(items) => (
        <View style={styles.list} testID="my-clubs">
          {items
            .filter((club) => joined.includes(club.id))
            .map((club) => (
              <ClubCard key={club.id} club={club} fullWidth />
            ))}
        </View>
      )}
    </AsyncBoundary>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, rowGap: spacing.xl },
  list: { gap: spacing.md },
  review: { gap: spacing.sm },
  reviewBook: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reviewMeta: { flex: 1, gap: spacing.xs },
});
