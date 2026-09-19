import { useRouter } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/books/BookCover';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { booksById } from '@/data/books';
import { useCommunityStore } from '@/stores/communityStore';
import { colors, radius, spacing } from '@/theme';
import type { ClubSummary } from '@/types';
import { formatCount } from '@/utils/format';
import { routes } from '@/utils/routes';

export const CLUB_CARD_WIDTH = 236;

function ClubCardBase({ club, fullWidth = false }: { club: ClubSummary; fullWidth?: boolean }) {
  const router = useRouter();
  const joined = useCommunityStore((state) => state.joinedClubIds.includes(club.id));
  const book = booksById.get(club.currentBookId);
  const members = club.memberCount + (joined ? 1 : 0);

  return (
    <PressableScale
      testID={`club-${club.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${club.name}, ${members} members${joined ? ', joined' : ''}`}
      onPress={() => router.push(routes.club(club.id))}
      scaleTo={0.98}
      style={[styles.card, fullWidth ? styles.fullWidth : null]}
    >
      {book ? <BookCover book={book} width={52} elevated /> : null}
      <View style={styles.details}>
        <Text variant="heading3" numberOfLines={1}>
          {club.name}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {club.tagline}
        </Text>
        <View style={styles.meta}>
          <Icon name="people-outline" size={13} color="textSecondary" />
          <Text variant="caption" color="textSecondary">
            {formatCount(members)} members
          </Text>
          {joined ? (
            <View style={styles.joined}>
              <Icon name="checkmark" size={11} color="sageText" />
              <Text variant="caption" weight="700" color="sageText">
                Joined
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

export const ClubCard = memo(ClubCardBase);

const styles = StyleSheet.create({
  card: {
    width: CLUB_CARD_WIDTH,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fullWidth: { width: '100%' },
  details: { flex: 1, justifyContent: 'center', gap: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  joined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.sageSoft,
  },
});
