import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { CartButton } from '@/components/ui/CartButton';
import { Text } from '@/components/ui/Text';
import { useAuthStore } from '@/stores/authStore';
import { layout, spacing } from '@/theme';
import { greetingFor } from '@/utils/date';
import { routes } from '@/utils/routes';

export function HomeHeader() {
  const router = useRouter();
  const name = useAuthStore((state) => state.session?.name ?? 'Reader');
  const firstName = name.split(' ')[0] ?? name;

  return (
    <View style={styles.row}>
      <View style={styles.greeting}>
        <Text variant="bodySmall" color="textSecondary">
          {greetingFor()},
        </Text>
        <Text variant="heading1" numberOfLines={1} testID="home-greeting">
          {firstName}
        </Text>
      </View>
      <CartButton />
      <Pressable
        testID="home-avatar"
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        onPress={() => router.navigate(routes.profile)}
        hitSlop={4}
      >
        <Avatar name={name} size="md" />
      </Pressable>
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
  greeting: { flex: 1 },
});
