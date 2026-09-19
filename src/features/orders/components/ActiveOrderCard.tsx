import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/book/BookCover';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { Order } from '@/types';
import { pluralize } from '@/utils/format';
import { routes } from '@/utils/routes';
import { arrivalLabel, progressOf, STATUS_COPY } from '../status';
import { PulsingDot } from './PulsingDot';

/** The large, dark "your order is on its way" card at the top of Orders. */
export function ActiveOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View testID={`active-order-${order.number}`} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.live}>
          <PulsingDot size={8} />
          <Text variant="overline" color="accent">
            Active order
          </Text>
        </View>
        <Text variant="caption" color="textInverseMuted">
          #{order.number}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.text}>
          <Text variant="heading2" color="textInverse" testID="active-status">
            {STATUS_COPY[order.status].title}
          </Text>
          <Text variant="heading3" color="accent" testID="active-eta">
            {arrivalLabel(order)}
          </Text>
          <Text variant="bodySmall" color="textInverseMuted">
            {pluralize(itemCount, 'book')}
          </Text>
        </View>
        <View style={styles.covers}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={item.bookId} style={[styles.cover, { marginLeft: index === 0 ? 0 : -22 }]}>
              <BookCover book={item} width={52} />
            </View>
          ))}
        </View>
      </View>

      <ProgressBar value={progressOf(order.status)} height={6} track="inkSoft" />

      <Button
        testID={`track-${order.number}`}
        label="Track order"
        variant="accent"
        rightIcon="arrow-forward"
        onPress={() => router.push(routes.order(order.id))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  live: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  body: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: spacing.xs },
  covers: { flexDirection: 'row' },
  cover: { borderWidth: 2, borderColor: colors.ink, borderRadius: radius.xs },
});
