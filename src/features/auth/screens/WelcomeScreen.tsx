import { useRouter } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAuthStore } from '@/stores/authStore';
import { layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { CoverCollage } from '../components/CoverCollage';

export default function WelcomeScreen() {
  const router = useRouter();
  const markWelcomeSeen = useAuthStore((state) => state.markWelcomeSeen);
  const { width, height } = useWindowDimensions();
  const collageSize = Math.min(width - spacing.xxxl, height * 0.42, 420);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Wordmark />
        </View>

        <View style={styles.hero}>
          <CoverCollage size={collageSize} />
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.copy}>
          <Text variant="overline" color="accentText">
            Discover · Order · Track · Connect
          </Text>
          <Text variant="display" accessibilityRole="header">
            Books you love, at your door in minutes.
          </Text>
          <Text variant="body" color="textSecondary">
            Find your next great read, get it delivered in 30–60 minutes, and talk about it with a
            community of readers.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.actions}>
          <Button
            testID="welcome-continue"
            label="Continue"
            rightIcon="arrow-forward"
            onPress={() => {
              markWelcomeSeen();
              router.push(routes.login);
            }}
          />
          <Button
            testID="welcome-create-account"
            label="Create account"
            variant="ghost"
            onPress={() => router.push(routes.signup)}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brand: { alignItems: 'flex-start' },
  hero: { flexShrink: 1, alignItems: 'center', justifyContent: 'center' },
  copy: { gap: spacing.md },
  actions: { gap: spacing.xs },
});
