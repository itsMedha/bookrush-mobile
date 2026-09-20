import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { CartButton } from '@/components/ui/CartButton';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { useAuthStore } from '@/stores/authStore';
import { selectSelectedAddress, useUserStore } from '@/stores/userStore';
import { layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';

/**
 * Quick-commerce apps lead with where they are delivering, because that is what decides
 * what you can actually get. Tapping it opens the saved addresses.
 */
export function LocationBar() {
  const router = useRouter();
  const address = useUserStore(selectSelectedAddress);
  const name = useAuthStore((state) => state.session?.name ?? 'Reader');

  return (
    <View style={styles.row}>
      <PressableScale
        testID="home-location"
        accessibilityRole="button"
        accessibilityLabel={
          address
            ? `Delivering to ${address.label}, ${address.city}. Change address`
            : 'Set address'
        }
        onPress={() => router.push(routes.addresses)}
        scaleTo={0.98}
        style={styles.location}
      >
        <Text variant="caption" color="textSecondary">
          Delivering to
        </Text>
        <View style={styles.addressRow}>
          <Icon name="location" size={16} color="accentText" />
          <Text variant="heading3" numberOfLines={1} testID="home-address">
            {address ? `${address.label} · ${address.city}` : 'Add an address'}
          </Text>
          <Icon name="chevron-down" size={14} color="textSecondary" />
        </View>
      </PressableScale>

      <CartButton />
      <PressableScale
        testID="home-avatar"
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        onPress={() => router.navigate(routes.profile)}
        scaleTo={0.94}
      >
        <Avatar name={name} size="md" />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  location: { flex: 1, gap: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
