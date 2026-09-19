import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { StickyBar } from '@/components/ui/StickyBar';
import { Text } from '@/components/ui/Text';
import { OrderItemsList } from '@/features/orders/components/OrderItemsList';
import { useOrder } from '@/features/orders/hooks';
import { errorMessage } from '@/services/http';
import { colors, layout, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { haptics } from '@/utils/haptics';
import { routes } from '@/utils/routes';

function Detail({ label, value, testID }: { label: string; value: string; testID?: string }) {
  return (
    <View style={styles.detail}>
      <Text variant="bodySmall" color="textSecondary">
        {label}
      </Text>
      <Text variant="body" weight="700" testID={testID}>
        {value}
      </Text>
    </View>
  );
}

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const order = useOrder(id);

  useEffect(() => {
    haptics.success();
  }, []);

  if (order.isPending) {
    return (
      <Screen>
        <LoadingState message="Confirming your order…" />
      </Screen>
    );
  }

  if (order.isError) {
    return (
      <Screen>
        <ErrorState
          message={errorMessage(order.error)}
          onRetry={() => void order.refetch()}
          retrying={order.isFetching}
        />
      </Screen>
    );
  }

  const data = order.data;
  const express = data.deliveryMethod === 'express';

  // Leave the checkout stack behind so Back from tracking lands on a tab, not an empty cart.
  const goTo = (path: string) => {
    router.dismissAll();
    router.push(path);
  };

  return (
    <Screen edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.badge}>
            <View style={styles.badgeInner}>
              <Icon name="checkmark" size={44} color="textInverse" />
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.heroText}>
            <Text variant="heading1" align="center" testID="confirmation-title">
              Order confirmed 🎉
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              Your books are being prepared.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Card padding="lg" style={styles.card}>
            <View style={styles.details}>
              <Detail label="Order number" value={`#${data.number}`} testID="order-number" />
              <Detail
                label="Estimated delivery"
                value={express ? `In ${data.etaMinutes} min` : data.estimatedDelivery}
              />
            </View>
            <Divider />
            <OrderItemsList items={data.items} />
            <Divider />
            <View style={styles.totalRow}>
              <Text variant="heading3">Total amount</Text>
              <Text variant="heading2" testID="confirmation-total">
                {formatPrice(data.pricing.total)}
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      <StickyBar>
        <View style={styles.actions}>
          <Button
            testID="track-order"
            label="Track Order"
            leftIcon="navigate"
            onPress={() => goTo(routes.order(data.id))}
          />
          <Button
            testID="continue-shopping"
            label="Continue Shopping"
            variant="ghost"
            onPress={() => goTo(routes.discover)}
          />
        </View>
      </StickyBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    padding: layout.screenPadding,
    paddingTop: spacing.giant,
    paddingBottom: spacing.xxxl,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  hero: { alignItems: 'center', gap: spacing.xl },
  badge: {
    width: 112,
    height: 112,
    borderRadius: radius.pill,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { gap: spacing.sm },
  card: { gap: spacing.lg },
  details: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { gap: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flex: 1, gap: spacing.xs },
});
