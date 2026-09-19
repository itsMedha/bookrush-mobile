import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ToggleRow } from '@/components/ui/ListRow';
import { useUserStore, type NotificationKey } from '@/stores/userStore';
import { spacing } from '@/theme';
import { View } from 'react-native';
import { SubScreen } from '../components/SubScreen';

const OPTIONS: readonly { key: NotificationKey; title: string; subtitle: string }[] = [
  { key: 'orderUpdates', title: 'Order updates', subtitle: 'Confirmed, packed and delivered' },
  { key: 'deliveryAlerts', title: 'Delivery alerts', subtitle: 'When your rider is nearby' },
  { key: 'community', title: 'Community activity', subtitle: 'Likes, comments and club messages' },
  {
    key: 'recommendations',
    title: 'Book recommendations',
    subtitle: 'Weekly picks based on your shelf',
  },
];

export default function NotificationsScreen() {
  const notifications = useUserStore((state) => state.notifications);
  const setNotification = useUserStore((state) => state.setNotification);

  return (
    <SubScreen title="Notifications">
      <Card padding="none">
        <View style={{ paddingHorizontal: spacing.lg }}>
          {OPTIONS.map((option, index) => (
            <View key={option.key}>
              {index > 0 ? <Divider /> : null}
              <ToggleRow
                testID={`toggle-${option.key}`}
                title={option.title}
                subtitle={option.subtitle}
                value={notifications[option.key]}
                onValueChange={(value) => setNotification(option.key, value)}
              />
            </View>
          ))}
        </View>
      </Card>
    </SubScreen>
  );
}
