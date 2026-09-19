import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';
import { useAdvanceOrder } from '../hooks';

/**
 * Orders move forward on a timer, which is slow to demo. This skips to the next
 * stage so the timeline can be walked through without waiting.
 */
export function TrackingDemoControls({ orderId }: { orderId: string }) {
  const advance = useAdvanceOrder();

  return (
    <View style={styles.container}>
      <Text variant="caption" color="textTertiary" align="center">
        Demo mode: progress is simulated. Tracking advances on its own every few seconds.
      </Text>
      <Button
        testID="advance-order"
        label="Skip to next step"
        variant="ghost"
        size="sm"
        fullWidth={false}
        leftIcon="play-forward"
        loading={advance.isPending}
        onPress={() => advance.mutate(orderId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md },
});
