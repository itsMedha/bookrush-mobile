import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';
import { colors, duration, radius, spacing, spring } from '@/theme';
import type { Book } from '@/types';
import { haptics } from '@/utils/haptics';
import { routes } from '@/utils/routes';

const CONFIRMATION_MS = 1600;

interface AddToCartButtonProps {
  book: Book;
}

/** Add to Cart → springs, tints sage and reads "Added ✓", then settles back. */
export function AddToCartButton({ book }: AddToCartButtonProps) {
  const router = useRouter();
  const add = useCartStore((state) => state.add);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useSharedValue(0);
  const pop = useSharedValue(1);
  const outOfStock = book.stock <= 0;

  useEffect(() => {
    progress.value = withTiming(added ? 1 : 0, { duration: duration.base });
  }, [added, progress]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.sageSoft]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.borderStrong, colors.sage]),
    transform: [{ scale: pop.value }],
  }));

  const onPress = () => {
    add(book);
    haptics.success();
    pop.value = withSequence(withTiming(1.05, { duration: 100 }), withSpring(1, spring.bouncy));
    setAdded(true);
    toast.success('Added to your cart', {
      label: 'View cart',
      onPress: () => router.push(routes.cart),
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), CONFIRMATION_MS);
  };

  return (
    <PressableScale
      testID="add-to-cart"
      accessibilityRole="button"
      accessibilityLabel={
        outOfStock ? 'Out of stock' : added ? 'Added to cart' : `Add ${book.title} to cart`
      }
      accessibilityState={{ disabled: outOfStock }}
      disabled={outOfStock}
      onPress={onPress}
      style={styles.pressable}
    >
      <Animated.View style={[styles.button, containerStyle, outOfStock ? styles.disabled : null]}>
        <View style={styles.labelSlot}>
          {added ? (
            <Animated.View
              key="added"
              entering={FadeInDown.duration(duration.fast)}
              exiting={FadeOutUp.duration(duration.instant)}
              style={styles.label}
            >
              <Icon name="checkmark-circle" size={18} color="sageText" />
              <Text variant="button" color="sageText">
                Added
              </Text>
            </Animated.View>
          ) : (
            <Animated.View
              key="idle"
              entering={FadeInDown.duration(duration.fast)}
              exiting={FadeOutUp.duration(duration.instant)}
              style={styles.label}
            >
              <Icon name="bag-add-outline" size={18} color="ink" />
              <Text variant="button" color="ink" numberOfLines={1}>
                {outOfStock ? 'Out of stock' : 'Add to Cart'}
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    overflow: 'hidden',
  },
  disabled: { opacity: 0.5 },
  labelSlot: { height: 22, justifyContent: 'center' },
  label: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
