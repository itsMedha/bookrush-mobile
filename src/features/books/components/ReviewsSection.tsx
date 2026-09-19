import { StyleSheet, View } from 'react-native';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Rating } from '@/components/ui/Rating';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { ratingDistribution } from '@/data/reviews';
import { spacing } from '@/theme';
import type { Book } from '@/types';
import { timeAgo } from '@/utils/date';
import { formatCount } from '@/utils/format';
import { useBookReviews } from '../hooks';

function RatingSummary({ book }: { book: Book }) {
  const distribution = ratingDistribution(book.rating);

  return (
    <View style={styles.summary}>
      <View style={styles.score}>
        <Text variant="display">{book.rating.toFixed(1)}</Text>
        <Rating value={book.rating} size={13} />
        <Text variant="caption" color="textSecondary">
          {formatCount(book.ratingCount)} ratings
        </Text>
      </View>
      <View style={styles.bars}>
        {distribution.map((share, index) => (
          <View key={index} style={styles.barRow}>
            <Text variant="caption" color="textSecondary" style={styles.star}>
              {5 - index}
            </Text>
            <View style={styles.bar}>
              <ProgressBar value={share * 2.4} height={6} fill="star" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ReviewsSection({ book }: { book: Book }) {
  const reviews = useBookReviews(book.id);

  return (
    <View style={styles.container}>
      <SectionHeader title="Ratings & reviews" inset={0} />
      <RatingSummary book={book} />
      <AsyncBoundary
        query={reviews}
        skeleton={
          <View style={styles.list}>
            <Skeleton height={96} radius="lg" />
            <Skeleton height={96} radius="lg" />
          </View>
        }
      >
        {(items) => (
          <View style={styles.list}>
            {items.map((review) => (
              <Card key={review.id} padding="lg" style={styles.review}>
                <View style={styles.reviewHeader}>
                  <Avatar name={review.author.name} uri={review.author.avatarUrl} size="sm" />
                  <View style={styles.reviewer}>
                    <Text variant="bodySmall" weight="700">
                      {review.author.name}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      {timeAgo(review.createdAt)} ago
                    </Text>
                  </View>
                  <Rating value={review.rating} compact />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxl },
  score: { alignItems: 'center', gap: spacing.xs },
  bars: { flex: 1, gap: spacing.xs },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bar: { flex: 1 },
  star: { width: 10 },
  list: { gap: spacing.md },
  review: { gap: spacing.sm },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reviewer: { flex: 1 },
});
