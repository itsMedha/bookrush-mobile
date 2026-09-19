import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { errorMessage } from '@/services/http';
import { colors, layout, spacing } from '@/theme';
import { formatShortDate } from '@/utils/date';
import { DeliveryDetailsCard } from '../components/DeliveryDetailsCard';
import { OrderItemsList } from '../components/OrderItemsList';
import { OrderTimeline } from '../components/OrderTimeline';
import { RiderCard, RiderPlaceholder } from '../components/RiderCard';
import { TrackingDemoControls } from '../components/TrackingDemoControls';
import { TrackingHero } from '../components/TrackingHero';
import { useOrder } from '../hooks';

function TrackingSkeleton() {
  return (
    <View style={styles.content}>
      <Skeleton height={210} radius="lg" />
      <Skeleton height={320} radius="lg" />
      <Skeleton height={90} radius="lg" />
    </View>
  );
}

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrder(id);

  if (order.isPending) {
    return (
      <Screen>
        <ScreenHeader title="Order" />
        <TrackingSkeleton />
      </Screen>
    );
  }

  if (order.isError) {
    return (
      <Screen>
        <ScreenHeader title="Order" />
        <ErrorState
          title="We couldn’t load this order"
          message={errorMessage(order.error)}
          onRetry={() => void order.refetch()}
          retrying={order.isFetching}
        />
      </Screen>
    );
  }

  const data = order.data;
  const delivered = data.status === 'DELIVERED';
  const express = data.deliveryMethod === 'express';

  return (
    <Screen edges={['top']}>
      <ScreenHeader
        title={`Order #${data.number}`}
        subtitle={`Placed ${formatShortDate(data.placedAt)}`}
        border
      />
      <ScrollView
        testID="tracking-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={order.isRefetching}
            onRefresh={() => void order.refetch()}
            tintColor={colors.accent}
          />
        }
      >
        <Animated.View entering={FadeIn.duration(300)}>
          <TrackingHero order={data} />
        </Animated.View>

        <Card padding="lg" style={styles.card}>
          <Text variant="heading2">Order progress</Text>
          <OrderTimeline order={data} />
        </Card>

        {express ? data.rider ? <RiderCard rider={data.rider} /> : <RiderPlaceholder /> : null}

        <Card padding="lg" style={styles.card}>
          <Text variant="heading3">Your books</Text>
          <OrderItemsList items={data.items} />
        </Card>

        <DeliveryDetailsCard address={data.address} paymentMethod={data.paymentMethod} />

        <OrderSummary pricing={data.pricing} title="Payment summary" />

        {!delivered ? <TrackingDemoControls orderId={data.id} /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: layout.screenPadding,
    paddingBottom: spacing.huge,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  card: { gap: spacing.lg },
});
