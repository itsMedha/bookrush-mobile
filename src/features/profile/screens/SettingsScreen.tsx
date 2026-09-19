import Constants from 'expo-constants';
import { useState } from 'react';
import { View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { Divider } from '@/components/ui/Divider';
import { ListRow, ToggleRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useDevStore } from '@/stores/devStore';
import { resetDemoData } from '@/stores/reset';
import { toast } from '@/stores/toastStore';
import { spacing } from '@/theme';
import { SubScreen } from '../components/SubScreen';

export default function SettingsScreen() {
  const simulateOffline = useDevStore((state) => state.simulateOffline);
  const setSimulateOffline = useDevStore((state) => state.setSimulateOffline);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <SubScreen title="Settings">
      <Text variant="overline" color="textSecondary">
        Demo tools
      </Text>
      <Card padding="none">
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ToggleRow
            testID="toggle-offline"
            icon="cloud-offline-outline"
            title="Simulate network errors"
            subtitle="Every request fails so you can see error and retry states"
            value={simulateOffline}
            onValueChange={(value) => {
              setSimulateOffline(value);
              toast.show(value ? 'Network errors on — pull to refresh a screen' : 'Back online');
            }}
          />
          <Divider />
          <ListRow
            testID="reset-demo"
            icon="refresh-outline"
            title="Reset demo data"
            subtitle="Restore orders, cart, likes and posts to their first-run state"
            onPress={() => setResetOpen(true)}
          />
        </View>
      </Card>

      <Text variant="overline" color="textSecondary">
        About
      </Text>
      <Card padding="none">
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ListRow
            icon="information-circle-outline"
            title="Version"
            subtitle={Constants.expoConfig?.version ?? '1.0.0'}
          />
          <Divider />
          <ListRow
            icon="code-slash-outline"
            title="Built with"
            subtitle="Expo · React Native · TypeScript · Reanimated"
          />
        </View>
      </Card>

      <ConfirmSheet
        visible={resetOpen}
        title="Reset demo data?"
        message="Your cart, saved books, likes, posts and orders return to how they were on first launch."
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          void resetDemoData().then(() => toast.success('Demo data restored'));
        }}
        onClose={() => setResetOpen(false)}
      />
    </SubScreen>
  );
}
