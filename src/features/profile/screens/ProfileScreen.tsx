import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { Divider } from '@/components/ui/Divider';
import { IconButton } from '@/components/ui/IconButton';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedTabs, type TabItem } from '@/components/ui/SegmentedTabs';
import { CURRENT_USER_ID } from '@/data/users';
import { usePostsByAuthor } from '@/features/community/hooks';
import { useAuthStore } from '@/store/authStore';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { ProfileHeader } from '../components/ProfileHeader';
import {
  ClubsTab,
  MyBooksTab,
  PostsTab,
  ReviewsTab,
  type ProfileTabKey,
} from '../components/ProfileTabs';

const TABS: readonly TabItem<ProfileTabKey>[] = [
  { key: 'books', label: 'My Books' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'posts', label: 'Posts' },
  { key: 'clubs', label: 'Clubs' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const posts = usePostsByAuthor(CURRENT_USER_ID);
  const [tab, setTab] = useState<ProfileTabKey>('books');
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Profile"
        large
        showBack={false}
        right={
          <IconButton
            testID="open-settings"
            icon="settings-outline"
            variant="filled"
            accessibilityLabel="Settings"
            onPress={() => router.push(routes.settings)}
          />
        }
      />
      <ScrollView
        testID="profile-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader postCount={posts.data?.length} />

        <View style={styles.tabs}>
          <SegmentedTabs items={TABS} value={tab} onChange={setTab} />
          <View style={styles.tabBody}>
            {tab === 'books' ? <MyBooksTab /> : null}
            {tab === 'reviews' ? <ReviewsTab /> : null}
            {tab === 'posts' ? <PostsTab /> : null}
            {tab === 'clubs' ? <ClubsTab /> : null}
          </View>
        </View>

        <View style={styles.menu}>
          <Card padding="none" style={styles.menuCard}>
            <View style={styles.menuInner}>
              <ListRow
                testID="menu-orders"
                icon="cube-outline"
                title="Orders"
                subtitle="Track and review your purchases"
                onPress={() => router.navigate(routes.orders)}
              />
              <Divider />
              <ListRow
                testID="menu-addresses"
                icon="location-outline"
                title="Addresses"
                onPress={() => router.push(routes.addresses)}
              />
              <Divider />
              <ListRow
                testID="menu-payments"
                icon="card-outline"
                title="Payment methods"
                onPress={() => router.push(routes.payments)}
              />
              <Divider />
              <ListRow
                testID="menu-notifications"
                icon="notifications-outline"
                title="Notifications"
                onPress={() => router.push(routes.notifications)}
              />
              <Divider />
              <ListRow
                testID="menu-settings"
                icon="settings-outline"
                title="Settings"
                onPress={() => router.push(routes.settings)}
              />
              <Divider />
              <ListRow
                testID="menu-logout"
                icon="log-out-outline"
                title="Log out"
                destructive
                onPress={() => setLogoutOpen(true)}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={logoutOpen}
        title="Log out of BookRush?"
        message="Your cart and orders stay saved on this device."
        confirmLabel="Log out"
        destructive
        onConfirm={signOut}
        onClose={() => setLogoutOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxl, paddingBottom: spacing.huge },
  tabs: { gap: spacing.lg, paddingHorizontal: layout.screenPadding },
  tabBody: { minHeight: 180 },
  menu: { paddingHorizontal: layout.screenPadding },
  menuCard: { backgroundColor: colors.surface },
  menuInner: { paddingHorizontal: spacing.lg },
});
