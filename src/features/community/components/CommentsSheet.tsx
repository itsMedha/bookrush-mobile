import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { errorMessage } from '@/services/http';
import { colors, maxFontSizeMultiplier, radius, spacing, typography } from '@/theme';
import { timeAgo } from '@/utils/date';
import { useAddComment, useComments } from '../hooks';

interface CommentsSheetProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

export function CommentsSheet({ postId, visible, onClose }: CommentsSheetProps) {
  const comments = useComments(postId, visible);
  const addComment = useAddComment(postId);
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0 && !addComment.isPending;

  const send = () => {
    if (!canSend) return;
    addComment.mutate(draft, { onSuccess: () => setDraft('') });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Comments">
      <View style={styles.content}>
        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {comments.isPending ? (
            <View style={styles.skeletons}>
              {[0, 1].map((key) => (
                <View key={key} style={styles.comment}>
                  <Skeleton width={32} height={32} radius="pill" />
                  <View style={styles.skeletonText}>
                    <Skeleton height={12} width="35%" />
                    <Skeleton height={14} width="85%" />
                  </View>
                </View>
              ))}
            </View>
          ) : comments.isError ? (
            <ErrorState
              compact
              message={errorMessage(comments.error)}
              onRetry={() => void comments.refetch()}
              retrying={comments.isFetching}
            />
          ) : comments.data.length === 0 ? (
            <Text variant="body" color="textSecondary" align="center" style={styles.empty}>
              No comments yet. Start the conversation.
            </Text>
          ) : (
            comments.data.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Avatar name={comment.author.name} uri={comment.author.avatarUrl} size="sm" />
                <View style={styles.commentBody}>
                  <Text variant="bodySmall" weight="700">
                    {comment.author.name}{' '}
                    <Text variant="caption" color="textSecondary">
                      {timeAgo(comment.createdAt)}
                    </Text>
                  </Text>
                  <Text variant="bodySmall">{comment.body}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            testID="comment-input"
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Add a comment"
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            returnKeyType="send"
            onSubmitEditing={send}
            selectionColor={colors.accent}
            style={styles.input}
          />
          <IconButton
            testID="comment-send"
            icon="arrow-up-circle"
            size={32}
            accessibilityLabel="Post comment"
            disabled={!canSend}
            color={canSend ? 'accent' : 'textTertiary'}
            onPress={send}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  list: { maxHeight: 320 },
  skeletons: { gap: spacing.lg },
  skeletonText: { flex: 1, gap: spacing.sm },
  comment: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  commentBody: { flex: 1, gap: 2 },
  empty: { paddingVertical: spacing.xxl },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 48,
    color: colors.textPrimary,
    outlineWidth: 0,
    outlineStyle: 'solid',
  },
});
