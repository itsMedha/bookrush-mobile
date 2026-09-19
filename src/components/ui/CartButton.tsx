import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { selectCartCount, useCartStore } from '@/store/cartStore';
import { colors, radius, spring } from '@/theme';
import { routes } from '@/utils/routes';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface CartButtonProps {
  variant?: 'plain' | 'filled' | 'inverse';
}

/** Cart entry point with a badge that pops whenever the item count changes. */
export function CartButton({ variant = 'filled' }: CartButtonProps) {
  const router = useRouter();
  const count = useCartStore(selectCartCount);
  const previous = useRef(count);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (previous.current !== count) {
      scale.value = withSequence(withTiming(1.4, { duration: 110 }), withSpring(1, spring.bouncy));
      previous.current = count;
    }
  }, [count, scale]);

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View>
      <IconButton
        testID="cart-button"
        icon="bag-outline"
        variant={variant}
        accessibilityLabel={count > 0 ? `Cart, ${count} items` : 'Cart, empty'}
        onPress={() => router.push(routes.cart)}
      />
      {count > 0 ? (
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text variant="caption" color="ink" weight="700" style={styles.badgeText}>
            {count > 9 ? '9+' : count}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  badgeText: { fontSize: 10, lineHeight: 12 },
});
