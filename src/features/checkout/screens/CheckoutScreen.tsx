import { Redirect, useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { OptionCard } from '@/components/commerce/OptionCard';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StickyBar } from '@/components/ui/StickyBar';
import { Text } from '@/components/ui/Text';
import { paymentMethods } from '@/data/users';
import { AddressPickerSheet } from '@/features/addresses/AddressPickerSheet';
import { useCreateOrder } from '@/features/orders/hooks';
import { errorMessage } from '@/services/http';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/stores/toastStore';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { layout, spacing } from '@/theme';
import type { DeliveryMethod, PaymentMethodId } from '@/types';
import { formatPrice, pluralize } from '@/utils/format';
import {
  canDeliverInstant,
  computePricing,
  deliveryFee,
  instantEtaRange,
  splitByDelivery,
  STANDARD_ETA_LABEL,
} from '@/utils/pricing';
import { routes } from '@/utils/routes';
import type { IconName } from '@/components/ui/Icon';

const paymentIcons: Record<PaymentMethodId, IconName> = {
  upi: 'logo-apple',
  card: 'card-outline',
  cod: 'cash-outline',
};

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="heading2" accessibilityRole="header">
          {title}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const address = useUserStore(selectSelectedAddress);
  const paymentMethod = useUserStore((state) => state.paymentMethod);
  const setPaymentMethod = useUserStore((state) => state.setPaymentMethod);
  const createOrder = useCreateOrder();

  const [requestedMethod, setRequestedMethod] = useState<DeliveryMethod>('instant');
  const [addressOpen, setAddressOpen] = useState(false);
  const [placed, setPlaced] = useState(false);

  const instantAvailable = canDeliverInstant(items);
  const deliveryMethod: DeliveryMethod = instantAvailable ? requestedMethod : 'standard';
  const { instant: instantItems, standard: standardItems } = splitByDelivery(items);
  const eta = instantEtaRange(instantItems);
  const pricing = useMemo(() => computePricing(items, deliveryMethod), [items, deliveryMethod]);
  const payable = pricing.itemsTotal - pricing.discount;
  const instantFee = deliveryFee('instant', payable);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  // An empty basket has nothing to check out — unless we just emptied it by placing the order.
  if (items.length === 0 && !placed) return <Redirect href={routes.cart} />;

  const placeOrder = () => {
    if (!address) {
      setAddressOpen(true);
      return;
    }
    createOrder.mutate(
      { items, address, deliveryMethod, paymentMethod },
      {
        onSuccess: (order) => {
          setPlaced(true);
          clearCart();
          router.replace(routes.confirmation(order.id));
        },
        onError: (error) => toast.error(errorMessage(error, 'We could not place your order.')),
      },
    );
  };

  return (
    <Screen edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title="Checkout" />
        <ScrollView
          testID="checkout-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Section
            title="Delivery address"
            action={
              <Button
                testID="change-address"
                label="Change"
                size="sm"
                variant="ghost"
                fullWidth={false}
                onPress={() => setAddressOpen(true)}
              />
            }
          >
            <Card padding="lg" style={styles.addressCard} testID="checkout-address">
              <View style={styles.addressIcon}>
                <Icon name="location" size={20} color="accentText" />
              </View>
              <View style={styles.addressText}>
                {address ? (
                  <>
                    <Badge label={address.label} tone="neutral" />
                    <Text variant="body" weight="700">
                      {address.line1}
                    </Text>
                    <Text variant="bodySmall" color="textSecondary">
                      {address.line2}, {address.city} {address.pincode}
                    </Text>
                  </>
                ) : (
                  <Text variant="body">Add a delivery address to continue</Text>
                )}
              </View>
            </Card>
          </Section>

          <Section title="Delivery option">
            <View style={styles.options}>
              <OptionCard
                testID="delivery-instant"
                icon="flash"
                title="Instant"
                subtitle={
                  instantAvailable && eta
                    ? `Arrives in ${eta.min}–${eta.max} min`
                    : `${standardItems.length} of ${items.length} items are not stocked nearby`
                }
                trailing={
                  <Text variant="body" weight="700">
                    {instantFee === 0 ? 'Free' : formatPrice(instantFee)}
                  </Text>
                }
                selected={deliveryMethod === 'instant'}
                disabled={!instantAvailable}
                onPress={() => setRequestedMethod('instant')}
              />
              <OptionCard
                testID="delivery-standard"
                icon="car-outline"
                title="Standard"
                subtitle={STANDARD_ETA_LABEL}
                trailing={
                  <Text variant="body" weight="700" color="success">
                    Free
                  </Text>
                }
                selected={deliveryMethod === 'standard'}
                onPress={() => setRequestedMethod('standard')}
              />
            </View>
          </Section>

          <Section title="Payment">
            <View style={styles.options}>
              {paymentMethods.map((method) => (
                <OptionCard
                  key={method.id}
                  testID={`payment-${method.id}`}
                  icon={paymentIcons[method.id]}
                  title={method.title}
                  subtitle={method.subtitle}
                  selected={paymentMethod === method.id}
                  onPress={() => setPaymentMethod(method.id)}
                />
              ))}
            </View>
          </Section>

          <Section title="Your books">
            <Card padding="lg" style={styles.itemsCard}>
              <View style={styles.covers}>
                {items.slice(0, 4).map(({ book }) => (
                  <BookCover key={book.id} book={book} width={44} />
                ))}
              </View>
              <Text variant="bodySmall" color="textSecondary">
                {pluralize(count, 'book')} · {items.map((item) => item.book.title).join(', ')}
              </Text>
            </Card>
          </Section>

          <OrderSummary pricing={pricing} />
        </ScrollView>

        <StickyBar>
          <View style={styles.total}>
            <Text variant="caption" color="textSecondary">
              Pay
            </Text>
            <Text variant="heading2" testID="checkout-total">
              {formatPrice(pricing.total)}
            </Text>
          </View>
          <Button
            testID="place-order"
            label="Place Order"
            leftIcon="lock-closed"
            loading={createOrder.isPending}
            style={styles.cta}
            onPress={placeOrder}
          />
        </StickyBar>
      </KeyboardAvoidingView>

      <AddressPickerSheet visible={addressOpen} onClose={() => setAddressOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    gap: spacing.xxl,
    padding: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressCard: { flexDirection: 'row', gap: spacing.md },
  addressIcon: { paddingTop: spacing.xs },
  addressText: { flex: 1, gap: spacing.xs },
  options: { gap: spacing.md },
  itemsCard: { gap: spacing.md },
  covers: { flexDirection: 'row', gap: spacing.sm },
  total: { minWidth: 88 },
  cta: { flex: 1 },
});
