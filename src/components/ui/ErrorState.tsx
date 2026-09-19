import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  /** Compact variant for section-level failures inside a scrolling screen. */
  compact?: boolean;
}

export function ErrorState({
  title = 'We hit a snag',
  message = 'Check your connection and try again.',
  onRetry,
  retrying = false,
  compact = false,
}: ErrorStateProps) {
  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, compact ? styles.compact : styles.full]}
    >
      <View style={styles.iconWrap}>
        <Icon name="cloud-offline-outline" size={26} color="danger" />
      </View>
      <Text variant={compact ? 'heading3' : 'heading2'} align="center">
        {title}
      </Text>
      <Text variant="bodySmall" color="textSecondary" align="center" style={styles.message}>
        {message}
      </Text>
      {onRetry ? (
        <Button
          label="Try again"
          leftIcon="refresh"
          variant="secondary"
          size="sm"
          fullWidth={false}
          loading={retrying}
          onPress={onRetry}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xxxl },
  full: { paddingVertical: spacing.giant },
  compact: { paddingVertical: spacing.xxl },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  message: { maxWidth: 280 },
  action: { marginTop: spacing.md },
});
