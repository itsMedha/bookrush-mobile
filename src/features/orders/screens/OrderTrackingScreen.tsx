import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { errorMessage } from '@/services/http';
import { colors, layout, radius, spacing } from '@/theme';
import { formatShortDate } from '@/utils/date';
import { useAdvanceOrder, useOrder } from '../hooks';
import { paymentLabel } from '../components/PaymentLabel';
import { DeliveryTrack } from '../components/DeliveryTrack';
import { OrderItemsList } from '../components/OrderItemsList';
import { OrderTimeline } from '../components/OrderTimeline';
import { PulsingDot } from '../components/PulsingDot';
import { RiderCard, RiderPlaceholder } from '../components/RiderCard';
import { arrivalLabel, progressOf, STATUS_COPY } from '../status';

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
  const advance = useAdvanceOrder();

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
          <View
            style={[styles.hero, delivered ? styles.heroDelivered : null]}
            testID="tracking-hero"
          >
            <View style={styles.heroTop}>
              <View style={styles.live}>
                {delivered ? (
                  <Icon name="checkmark-circle" size={14} color="sage" />
                ) : (
                  <PulsingDot size={8} />
                )}
                <Text variant="overline" color={delivered ? 'sage' : 'accent'}>
                  {delivered ? 'Completed' : 'Live tracking'}
                </Text>
              </View>
              {!express && !delivered ? <Badge label="Standard shipping" tone="neutral" /> : null}
            </View>

            <Text variant="heading1" color="textInverse" testID="tracking-status">
              {STATUS_COPY[data.status].title}
            </Text>
            <Text variant="heading3" color="accent" testID="tracking-eta">
              {arrivalLabel(data)}
            </Text>

            <View style={styles.track}>
              <DeliveryTrack progress={progressOf(data.status)} delivered={delivered} />
            </View>
          </View>
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

        <Card padding="lg" style={styles.card} testID="tracking-address">
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color="textSecondary" />
            <View style={styles.infoText}>
              <Text variant="bodySmall" color="textSecondary">
                Delivering to {data.address.label}
              </Text>
              <Text variant="body" weight="600">
                {data.address.line1}
              </Text>
              <Text variant="bodySmall" color="textSecondary">
                {data.address.line2}, {data.address.city} {data.address.pincode}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="wallet-outline" size={20} color="textSecondary" />
            <View style={styles.infoText}>
              <Text variant="bodySmall" color="textSecondary">
                Payment
              </Text>
              <Text variant="body" weight="600">
                {paymentLabel(data.paymentMethod)}
              </Text>
            </View>
          </View>
        </Card>

        <OrderSummary pricing={data.pricing} title="Payment summary" />

        {!delivered ? (
          <View style={styles.demo}>
            <Text variant="caption" color="textTertiary" align="center">
              Demo mode: progress is simulated. Tracking advances on its own every few seconds.
            </Text>
            <Button
              testID="advance-order"
              label="Skip to next step"
              variant="ghost"
              size="sm"
              fullWidth={false}
              leftIcon="play-forward"
              loading={advance.isPending}
              onPress={() => advance.mutate(data.id)}
            />
          </View>
        ) : null}
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
  hero: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
  },
  heroDelivered: { backgroundColor: colors.inkSoft },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  live: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  track: { marginTop: spacing.lg },
  card: { gap: spacing.lg },
  infoRow: { flexDirection: 'row', gap: spacing.md },
  infoText: { flex: 1, gap: 2 },
  demo: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md },
});
