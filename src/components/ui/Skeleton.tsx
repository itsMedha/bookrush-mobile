import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, type RadiusToken } from '@/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: RadiusToken;
  style?: StyleProp<ViewStyle>;
}

/** Placeholder block with a gentle pulse. Honours the system "reduce motion" setting. */
export function Skeleton({ width = '100%', height = 16, radius: r = 'sm', style }: SkeletonProps) {
  const opacity = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    opacity.value = withRepeat(
      withSequence(withTiming(0.55, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
    );
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: radius[r], backgroundColor: colors.skeleton },
        animatedStyle,
        style,
      ]}
    />
  );
}
