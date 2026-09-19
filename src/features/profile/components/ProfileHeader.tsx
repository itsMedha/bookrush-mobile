import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { currentUser, profileStats } from '@/data/users';
import { useAuthStore } from '@/store/authStore';
import { useCommunityStore } from '@/store/communityStore';
import { colors, layout, radius, spacing } from '@/theme';
import { formatCount } from '@/utils/format';

function Stat({ value, label, testID }: { value: string; label: string; testID?: string }) {
  return (
    <View accessible accessibilityLabel={`${value} ${label}`} style={styles.stat}>
      <Text variant="heading2" align="center" testID={testID}>
        {value}
      </Text>
      <Text variant="caption" color="textSecondary" align="center">
        {label}
      </Text>
    </View>
  );
}

interface ProfileHeaderProps {
  postCount: number | undefined;
}

export function ProfileHeader({ postCount }: ProfileHeaderProps) {
  const name = useAuthStore((state) => state.session?.name ?? currentUser.name);
  const following = useCommunityStore((state) => state.followingIds.length);

  return (
    <View style={styles.container}>
      <Avatar name={name} size="xl" />
      <View style={styles.identity}>
        <Text variant="heading1" align="center" testID="profile-name">
          {name}
        </Text>
        <Text variant="bodySmall" color="textSecondary" align="center">
          @{currentUser.handle}
        </Text>
      </View>
      <Text variant="body" color="textSecondary" align="center" style={styles.bio}>
        {currentUser.bio}
      </Text>
      <View style={styles.stats}>
        <Stat value={formatCount(profileStats.followers)} label="Followers" />
        <View style={styles.divider} />
        <Stat value={String(following)} label="Following" testID="following-count" />
        <View style={styles.divider} />
        <Stat value={postCount === undefined ? '–' : String(postCount)} label="Posts" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  identity: { gap: spacing.xxs },
  bio: { maxWidth: 320 },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  stat: { flex: 1, gap: 2 },
  divider: { width: StyleSheet.hairlineWidth, height: 32, backgroundColor: colors.border },
});
