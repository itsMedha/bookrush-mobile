import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { booksById } from '@/data/books';
import { useRefresh } from '@/hooks/useRefresh';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/stores/toastStore';
import type { Order } from '@/types';
import { pluralize } from '@/utils/format';
import { errorMessage } from '@/services/http';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { ActiveOrderCard } from '../components/ActiveOrderCard';
import { OrderRow } from '../components/OrderRow';
import { isActiveOrder, useOrders } from '../hooks';

const REFRESH_ROOTS = [['orders']] as const;

function OrdersSkeleton() {
  return (
    <View style={styles.list}>
      <Skeleton height={230} radius="lg" />
      <Skeleton height={20} width="40%" />
      <Skeleton height={92} radius="lg" />
      <Skeleton height={92} radius="lg" />
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.add);

  // Reordering drops the previous lines back into the cart at today's price and
  // availability, then hands over to the normal checkout flow.
  const buyAgain = useCallback(
    (order: Order) => {
      const restored = order.items.flatMap((item) => {
        const book = booksById.get(item.bookId);
        return book && book.delivery.type !== 'UNAVAILABLE' ? [{ book, item }] : [];
      });

      if (restored.length === 0) {
        toast.error('These titles are out of stock right now');
        return;
      }

      restored.forEach(({ book, item }) => addToCart(book, item.mode, item.quantity));
      toast.success(`${pluralize(restored.length, 'item')} back in your cart`, {
        label: 'View cart',
        onPress: () => router.push(routes.cart),
      });
    },
    [addToCart, router],
  );
  const orders = useOrders({ poll: true });
  const { refreshing, onRefresh } = useRefresh(REFRESH_ROOTS);

  const renderBody = () => {
    if (orders.isPending) return <OrdersSkeleton />;

    if (orders.isError) {
      return (
        <ErrorState
          message={errorMessage(orders.error)}
          onRetry={() => void orders.refetch()}
          retrying={orders.isFetching}
        />
      );
    }

    const active = orders.data.filter(isActiveOrder);
    const previous = orders.data.filter((order) => !isActiveOrder(order));

    if (orders.data.length === 0) {
      return (
        <EmptyState
          testID="empty-orders"
          icon="cube-outline"
          title="No previous orders."
          message="When you order a book, you will be able to follow it here, minute by minute."
          actionLabel="Discover books"
          onAction={() => router.navigate(routes.discover)}
        />
      );
    }

    return (
      <View style={styles.list}>
        {active.length > 0 ? (
          active.map((order) => <ActiveOrderCard key={order.id} order={order} />)
        ) : (
          <Card tone="muted" bordered={false} padding="lg" style={styles.noActive}>
            <Icon name="checkmark-done-circle-outline" size={24} color="sageText" />
            <Text variant="bodySmall" color="textSecondary" style={styles.noActiveText}>
              No active orders. Your next delivery will show up here.
            </Text>
          </Card>
        )}

        {previous.length > 0 ? (
          <View style={styles.previous}>
            <SectionHeader title="Previous orders" inset={0} />
            {previous.map((order) => (
              <OrderRow key={order.id} order={order} onBuyAgain={() => buyAgain(order)} />
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Orders" large showBack={false} />
      <ScrollView
        testID="orders-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {renderBody()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.huge },
  list: { gap: spacing.lg },
  previous: { gap: spacing.md, marginTop: spacing.md },
  noActive: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  noActiveText: { flex: 1 },
});
