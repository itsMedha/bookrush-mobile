import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { spacing, spring } from '@/theme';
import { formatCount } from '@/utils/format';
import { haptics } from '@/utils/haptics';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

/** Heart that pops on like. The count is the server baseline plus the viewer's own like. */
export function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  const scale = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      testID="like-button"
      accessibilityRole="button"
      accessibilityLabel={liked ? `Unlike, ${count} likes` : `Like, ${count} likes`}
      accessibilityState={{ selected: liked }}
      hitSlop={8}
      onPress={() => {
        if (!liked) {
          haptics.tap();
          scale.value = withSequence(
            withTiming(1.4, { duration: 110 }),
            withSpring(1, spring.bouncy),
          );
        }
        onToggle();
      }}
      style={styles.button}
    >
      <Animated.View style={heartStyle}>
        <Icon
          name={liked ? 'heart' : 'heart-outline'}
          size={22}
          color={liked ? 'danger' : 'textPrimary'}
        />
      </Animated.View>
      <Text variant="bodySmall" weight="600" color={liked ? 'danger' : 'textSecondary'}>
        {formatCount(count)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingRight: spacing.sm,
  },
});
