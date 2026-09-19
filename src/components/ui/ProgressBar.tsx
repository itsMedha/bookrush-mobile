import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, duration, radius, type ColorToken } from '@/theme';

interface ProgressBarProps {
  /** 0 – 1 */
  value: number;
  height?: number;
  fill?: ColorToken;
  track?: ColorToken;
}

export function ProgressBar({
  value,
  height = 4,
  fill = 'accent',
  track = 'border',
}: ProgressBarProps) {
  const progress = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, value));

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: duration.slow });
  }, [clamped, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, backgroundColor: colors[track] }]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: colors[fill] }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
