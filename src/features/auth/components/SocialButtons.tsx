import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import type { SocialProvider } from '@/services/authService';
import { spacing } from '@/theme';

interface SocialButtonsProps {
  onPress: (provider: SocialProvider) => void;
  loadingProvider?: SocialProvider | null;
  disabled?: boolean;
}

/** "or" divider + Apple / Google sign-in (mocked). */
export function SocialButtons({ onPress, loadingProvider = null, disabled }: SocialButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <Divider style={styles.line} />
        <Text variant="caption" color="textSecondary">
          or continue with
        </Text>
        <Divider style={styles.line} />
      </View>
      <Button
        label="Continue with Apple"
        leftIcon="logo-apple"
        variant="primary"
        loading={loadingProvider === 'apple'}
        disabled={disabled && loadingProvider !== 'apple'}
        onPress={() => onPress('apple')}
      />
      <Button
        label="Continue with Google"
        leftIcon="logo-google"
        variant="secondary"
        loading={loadingProvider === 'google'}
        disabled={disabled && loadingProvider !== 'google'}
        onPress={() => onPress('google')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1 },
});
