import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '@/components/ui/Icon';
import { colors, duration, radius, shadows, spacing, spring } from '@/theme';

const RIDER_SIZE = 36;
const ENDPOINT_SIZE = 32;

interface DeliveryTrackProps {
  /** 0 – 1 */
  progress: number;
  delivered: boolean;
}

/** Store → home route. The rider glides along it as the order progresses. */
export function DeliveryTrack({ progress, delivered }: DeliveryTrackProps) {
  const [width, setWidth] = useState(0);
  const position = useSharedValue(0);
  const fill = useSharedValue(0);
  const trackWidth = Math.max(0, width - ENDPOINT_SIZE);

  useEffect(() => {
    position.value = withSpring(progress, spring.gentle);
    fill.value = withTiming(progress, { duration: duration.slow * 2 });
  }, [progress, position, fill]);

  const riderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: ENDPOINT_SIZE / 2 - RIDER_SIZE / 2 + position.value * trackWidth,
      },
    ],
  }));
  const fillStyle = useAnimatedStyle(() => ({ width: fill.value * trackWidth }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Delivery progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.line}>
        <View style={[styles.lineTrack, { left: ENDPOINT_SIZE / 2, right: ENDPOINT_SIZE / 2 }]} />
        <Animated.View style={[styles.lineFill, { left: ENDPOINT_SIZE / 2 }, fillStyle]} />
      </View>
      <View style={[styles.endpoint, styles.start]}>
        <Icon name="storefront-outline" size={16} color="textInverse" />
      </View>
      <View style={[styles.endpoint, styles.end, delivered ? styles.endDelivered : null]}>
        <Icon name={delivered ? 'checkmark' : 'home-outline'} size={16} color="textInverse" />
      </View>
      {!delivered ? (
        <Animated.View style={[styles.rider, riderStyle]}>
          <Icon name="bicycle" size={20} color="ink" />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: RIDER_SIZE + spacing.sm, justifyContent: 'center' },
  line: { ...StyleSheet.absoluteFill, justifyContent: 'center' },
  lineTrack: {
    position: 'absolute',
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.onInkTrack,
  },
  lineFill: {
    position: 'absolute',
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  endpoint: {
    position: 'absolute',
    width: ENDPOINT_SIZE,
    height: ENDPOINT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.onInkSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  start: { left: 0 },
  end: { right: 0 },
  endDelivered: { backgroundColor: colors.sage },
  rider: {
    position: 'absolute',
    left: 0,
    width: RIDER_SIZE,
    height: RIDER_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.riderGlow,
  },
});
