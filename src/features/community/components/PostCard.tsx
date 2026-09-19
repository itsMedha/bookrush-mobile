import { Image } from 'expo-image';
import { memo, useCallback, useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { BookRail } from '@/components/books/BookRail';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { CURRENT_USER_ID } from '@/data/users';
import { useCommunityStore } from '@/stores/communityStore';
import { toast } from '@/stores/toastStore';
import { colors, layout, radius, spacing } from '@/theme';
import type { FeedPost } from '@/types';
import { timeAgo } from '@/utils/date';
import { formatCount } from '@/utils/format';
import { haptics } from '@/utils/haptics';
import { BookReference } from './BookReference';
import { CommentsSheet } from './CommentsSheet';
import { LikeButton } from './LikeButton';

interface PostCardProps {
  post: FeedPost;
}

interface ActionProps {
  icon: IconName;
  label: string;
  count?: number;
  active?: boolean;
  onPress: () => void;
  testID?: string;
}

function Action({ icon, label, count, active = false, onPress, testID }: ActionProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      onPress={onPress}
      style={styles.action}
    >
      <Icon name={icon} size={21} color={active ? 'accentText' : 'textPrimary'} />
      {count !== undefined ? (
        <Text variant="bodySmall" weight="600" color="textSecondary">
          {formatCount(count)}
        </Text>
      ) : null}
    </Pressable>
  );
}

function PostCardBase({ post }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const liked = useCommunityStore((state) => state.likedPostIds.includes(post.id));
  const saved = useCommunityStore((state) => state.savedPostIds.includes(post.id));
  const following = useCommunityStore((state) => state.followingIds.includes(post.authorId));
  const toggleLike = useCommunityStore((state) => state.toggleLike);
  const toggleSave = useCommunityStore((state) => state.toggleSave);
  const toggleFollow = useCommunityStore((state) => state.toggleFollow);

  const isMine = post.authorId === CURRENT_USER_ID;
  const likeCount = post.likeCount + (liked ? 1 : 0);
  const { author, books } = post;

  const onLike = useCallback(() => toggleLike(post.id), [toggleLike, post.id]);

  const onShare = useCallback(async () => {
    try {
      await Share.share({ message: `${author.name} on BookRush: “${post.body.slice(0, 120)}”` });
    } catch {
      toast.show('Sharing is not available on this device');
    }
  }, [author.name, post.body]);

  const onSave = useCallback(() => {
    haptics.select();
    toggleSave(post.id);
    toast.show(saved ? 'Removed from saved' : 'Saved to your collection');
  }, [toggleSave, post.id, saved]);

  return (
    <View testID={`post-${post.id}`} style={styles.card}>
      <View style={styles.header}>
        <Avatar name={author.name} uri={author.avatarUrl} size="md" />
        <View style={styles.identity}>
          <Text variant="bodySmall" weight="700" numberOfLines={1}>
            {author.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            @{author.handle} · {timeAgo(post.createdAt)}
          </Text>
        </View>
        {!isMine ? (
          <Pressable
            testID={`follow-${post.authorId}`}
            accessibilityRole="button"
            accessibilityLabel={following ? `Unfollow ${author.name}` : `Follow ${author.name}`}
            hitSlop={8}
            onPress={() => {
              haptics.select();
              toggleFollow(post.authorId);
            }}
            style={[styles.follow, following ? styles.following : null]}
          >
            <Text variant="caption" weight="700" color={following ? 'textSecondary' : 'ink'}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Text variant="body" style={styles.body}>
        {post.body}
      </Text>

      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          accessibilityLabel={`Photo shared by ${author.name}`}
          contentFit="cover"
          transition={200}
          style={styles.image}
        />
      ) : null}

      {books.length === 1 && books[0] ? <BookReference book={books[0]} /> : null}
      {books.length > 1 ? (
        <View style={styles.rail}>
          <BookRail books={books} cardWidth={92} />
        </View>
      ) : null}

      <View style={styles.actions}>
        <LikeButton liked={liked} count={likeCount} onToggle={onLike} />
        <Action
          testID={`comment-${post.id}`}
          icon="chatbubble-outline"
          label={`Comments, ${post.commentCount}`}
          count={post.commentCount}
          onPress={() => setCommentsOpen(true)}
        />
        <Action icon="paper-plane-outline" label="Share post" onPress={onShare} />
        <View style={styles.spacer} />
        <Action
          testID={`save-${post.id}`}
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          label={saved ? 'Remove from saved' : 'Save post'}
          active={saved}
          onPress={onSave}
        />
      </View>

      <CommentsSheet
        postId={post.id}
        visible={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </View>
  );
}

export const PostCard = memo(PostCardBase);

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  identity: { flex: 1, gap: 2 },
  follow: {
    minHeight: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  following: { borderColor: colors.border, backgroundColor: colors.surfaceMuted },
  body: { lineHeight: 24 },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  rail: { marginHorizontal: -spacing.lg, marginBottom: -spacing.xs },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: -spacing.xs },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: layout.minTouchTarget,
  },
  spacer: { flex: 1 },
});
