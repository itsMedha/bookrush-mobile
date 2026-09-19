import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

interface LoadingStateProps {
  message?: string;
}

/** Blocking spinner for moments where skeletons do not make sense (placing an order, signing in). */
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Loading'}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={colors.accent} />
      {message ? (
        <Text variant="bodySmall" color="textSecondary" align="center">
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
});
