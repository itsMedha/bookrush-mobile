import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartButton } from '@/components/ui/CartButton';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { toast } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';

interface DetailHeaderProps {
  bookId: string;
  title?: string;
  scrollY: SharedValue<number>;
}

/** Floating header: transparent over the cover, fades to a solid bar with the title on scroll. */
export function DetailHeader({ bookId, title, scrollY }: DetailHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const saved = useUserStore((state) => state.savedBookIds.includes(bookId));
  const toggleSaved = useUserStore((state) => state.toggleSavedBook);

  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [90, 180], [0, 1], 'clamp'),
  }));

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.bar, barStyle]} />
      <View style={styles.row}>
        <IconButton
          icon="chevron-back"
          variant="filled"
          accessibilityLabel="Go back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.home))}
        />
        <Animated.View style={[styles.title, barStyle]}>
          <Text variant="heading3" numberOfLines={1} align="center">
            {title}
          </Text>
        </Animated.View>
        <IconButton
          testID="save-book"
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          variant="filled"
          color={saved ? 'accentText' : 'textPrimary'}
          accessibilityLabel={saved ? 'Remove from my books' : 'Save to my books'}
          onPress={() => {
            toggleSaved(bookId);
            toast.show(saved ? 'Removed from My Books' : 'Saved to My Books');
          }}
        />
        <CartButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  bar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: layout.screenPadding - spacing.xs,
  },
  title: { flex: 1, paddingHorizontal: spacing.xs },
});
