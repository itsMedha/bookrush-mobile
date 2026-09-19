import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookCover } from '@/components/book/BookCover';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Avatar } from '@/components/ui/Avatar';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { StickyBar } from '@/components/ui/StickyBar';
import { Text } from '@/components/ui/Text';
import { useCommunityStore } from '@/store/communityStore';
import { toast } from '@/store/toastStore';
import { colors, layout, radius, spacing } from '@/theme';
import type { ClubDetail } from '@/types';
import { timeAgo } from '@/utils/date';
import { BookReference } from '../components/BookReference';
import { useClub } from '../hooks';

function ClubSkeleton() {
  return (
    <View style={styles.content}>
      <Skeleton height={190} radius="lg" />
      <Skeleton height={90} radius="lg" />
      <Skeleton height={160} radius="lg" />
    </View>
  );
}

function ClubContent({ club, joined }: { club: ClubDetail; joined: boolean }) {
  const members = club.memberCount + (joined ? 1 : 0);

  return (
    <ScrollView
      testID="club-scroll"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Animated.View entering={FadeInDown.duration(350)} style={styles.hero}>
        <BookCover book={club.currentBook} width={92} size="full" elevated />
        <View style={styles.heroText}>
          <Text variant="overline" color="accentText">
            {club.tagline}
          </Text>
          <Text variant="heading1" testID="club-name">
            {club.name}
          </Text>
          <AvatarStack users={club.members} total={members} />
        </View>
      </Animated.View>

      <View style={styles.meta}>
        <Badge label={`${members.toLocaleString('en-IN')} members`} icon="people" tone="neutral" />
        <Badge label={`Next: ${club.nextMeeting}`} icon="calendar-outline" tone="accent" />
      </View>

      <Text variant="body" color="textSecondary">
        {club.description}
      </Text>

      <View style={styles.section}>
        <Text variant="heading2">Now reading</Text>
        <BookReference book={club.currentBook} />
      </View>

      <View style={styles.section}>
        <Text variant="heading2">Discussion</Text>
        <Card padding="lg" style={styles.discussion}>
          {club.discussion.map((message) => (
            <View key={message.id} style={styles.message}>
              <Avatar name={message.author.name} uri={message.author.avatarUrl} size="sm" />
              <View style={styles.messageText}>
                <Text variant="bodySmall" weight="700">
                  {message.author.name}{' '}
                  <Text variant="caption" color="textSecondary">
                    {timeAgo(message.createdAt)}
                  </Text>
                </Text>
                <Text variant="bodySmall">{message.body}</Text>
              </View>
            </View>
          ))}
          <View style={styles.locked}>
            <Icon
              name={joined ? 'chatbubble-ellipses-outline' : 'lock-closed-outline'}
              size={16}
              color="textSecondary"
            />
            <Text variant="caption" color="textSecondary">
              {joined
                ? 'You are in — jump into the conversation.'
                : 'Join the club to reply and see the full thread.'}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const club = useClub(id);
  const joined = useCommunityStore((state) => state.joinedClubIds.includes(id));
  const toggleClub = useCommunityStore((state) => state.toggleClub);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const join = () => {
    toggleClub(id);
    toast.success(`Welcome to ${club.data?.name ?? 'the club'} 🎉`);
  };

  return (
    <Screen edges={['top']}>
      <ScreenHeader title="Book club" />
      <AsyncBoundary
        query={club}
        skeleton={<ClubSkeleton />}
        compact={false}
        errorTitle="We couldn’t load this club"
      >
        {(data) => <ClubContent club={data} joined={joined} />}
      </AsyncBoundary>

      {club.data ? (
        <StickyBar>
          {joined ? (
            <Button
              testID="leave-club"
              label="Joined"
              leftIcon="checkmark"
              variant="secondary"
              onPress={() => setLeaveOpen(true)}
            />
          ) : (
            <Button testID="join-club" label="Join Club" leftIcon="add" onPress={join} />
          )}
        </StickyBar>
      ) : null}

      <ConfirmSheet
        visible={leaveOpen}
        title="Leave this club?"
        message="You will stop seeing the discussion in your feed. You can rejoin any time."
        confirmLabel="Leave club"
        destructive
        onConfirm={() => {
          toggleClub(id);
          toast.show('You left the club');
        }}
        onClose={() => setLeaveOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: layout.screenPadding,
    paddingBottom: spacing.huge,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
  },
  heroText: { flex: 1, gap: spacing.sm },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  section: { gap: spacing.md },
  discussion: { gap: spacing.lg },
  message: { flexDirection: 'row', gap: spacing.md },
  messageText: { flex: 1, gap: 2 },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
