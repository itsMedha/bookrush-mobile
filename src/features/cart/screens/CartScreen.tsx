import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StickyBar } from '@/components/ui/StickyBar';
import { Text } from '@/components/ui/Text';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/stores/toastStore';
import { layout, spacing } from '@/theme';
import type { CartItem } from '@/types';
import { formatPrice, pluralize } from '@/utils/format';
import {
  canDeliverInstant,
  computePricing,
  instantEtaRange,
  splitByDelivery,
} from '@/utils/pricing';
import { routes } from '@/utils/routes';
import { CartDeliveryCard } from '../components/CartDeliveryCard';
import { CartItemRow } from '../components/CartItemRow';

interface CartGroupProps {
  title: string;
  caption: string;
  instant: boolean;
  items: CartItem[];
  onQuantityChange: (bookId: string, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onModeChange: React.ComponentProps<typeof CartItemRow>['onModeChange'];
  onOpen: (id: string) => void;
}

/** A fulfilment group. Mixed baskets render one of these per delivery speed. */
function CartGroup({ title, caption, instant, items, ...handlers }: CartGroupProps) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Icon
          name={instant ? 'flash' : 'cube-outline'}
          size={14}
          color={instant ? 'accentText' : 'sageText'}
        />
        <Text variant="overline" color={instant ? 'accentText' : 'sageText'}>
          {title}
        </Text>
        <Text variant="caption" color="textSecondary">
          · {caption}
        </Text>
      </View>
      <Card padding="none" style={styles.list}>
        {items.map((item, index) => (
          <View key={item.book.id}>
            {index > 0 ? <Divider /> : null}
            <CartItemRow item={item} {...handlers} />
          </View>
        ))}
      </Card>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const setMode = useCartStore((state) => state.setMode);

  const instantAvailable = canDeliverInstant(items);
  const pricing = useMemo(
    () => computePricing(items, instantAvailable ? 'instant' : 'standard'),
    [items, instantAvailable],
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const { instant, standard } = splitByDelivery(items);
  const eta = instantEtaRange(instant);

  const removeWithUndo = useCallback(
    (item: CartItem) => {
      remove(item.book.id);
      toast.show(`Removed “${item.book.title}”`, {
        action: { label: 'Undo', onPress: () => add(item.book, item.mode, item.quantity) },
      });
    },
    [remove, add],
  );

  const openBook = useCallback((id: string) => router.push(routes.book(id)), [router]);

  if (items.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Your cart" />
        <View style={styles.empty}>
          <EmptyState
            testID="empty-cart"
            icon="bag-outline"
            title="No books in your cart yet."
            message="Find something worth staying up for — your next read is a tap away."
            actionLabel="Browse books"
            onAction={() => router.navigate(routes.discover)}
          />
        </View>
      </Screen>
    );
  }

  const handlers = {
    onQuantityChange: setQuantity,
    onRemove: removeWithUndo,
    onModeChange: setMode,
    onOpen: openBook,
  };

  return (
    <Screen edges={['top']}>
      <ScreenHeader title="Your cart" subtitle={pluralize(count, 'item')} />
      <ScrollView
        testID="cart-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {instant.length > 0 ? (
          <CartGroup
            title="Instant delivery"
            caption={eta ? `arriving in ${eta.min}–${eta.max} min` : 'from a store near you'}
            instant
            items={instant}
            {...handlers}
          />
        ) : null}

        {standard.length > 0 ? (
          <CartGroup
            title="Standard delivery"
            caption="arriving in 2–4 days"
            instant={false}
            items={standard}
            {...handlers}
          />
        ) : null}

        <CartDeliveryCard items={items} payableTotal={pricing.itemsTotal - pricing.discount} />
        <OrderSummary pricing={pricing} />
      </ScrollView>

      <StickyBar>
        <View style={styles.total}>
          <Text variant="caption" color="textSecondary">
            Total
          </Text>
          <Text variant="heading2" testID="cart-total">
            {formatPrice(pricing.total)}
          </Text>
        </View>
        <Button
          testID="checkout-button"
          label="Proceed to Checkout"
          rightIcon="arrow-forward"
          style={styles.cta}
          onPress={() => router.push(routes.checkout)}
        />
      </StickyBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  group: { gap: spacing.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  list: { overflow: 'hidden' },
  empty: { flex: 1, justifyContent: 'center' },
  total: { minWidth: 88 },
  cta: { flex: 1 },
});
