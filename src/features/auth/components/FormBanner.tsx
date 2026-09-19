import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

/** Inline form-level error (network or credential failures). */
export function FormBanner({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <Icon name="alert-circle" size={18} color="danger" />
      <Text variant="bodySmall" color="danger" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  text: { flex: 1 },
});
