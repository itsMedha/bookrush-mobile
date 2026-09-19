import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, type ColorToken } from '@/theme';

interface PulsingDotProps {
  size?: number;
  color?: ColorToken;
}

/** Solid dot with a soft ring that expands and fades — signals "live". */
export function PulsingDot({ size = 12, color = 'accent' }: PulsingDotProps) {
  const pulse = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, [pulse, reduceMotion]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 1.6 }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={[
          styles.ring,
          { backgroundColor: colors[color], borderRadius: radius.pill },
          ringStyle,
        ]}
      />
      <View style={[styles.dot, { backgroundColor: colors[color], borderRadius: radius.pill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { ...StyleSheet.absoluteFill },
  dot: { ...StyleSheet.absoluteFill },
});
