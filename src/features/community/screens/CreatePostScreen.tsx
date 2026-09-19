import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { BookCover } from '@/components/book/BookCover';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { currentUser } from '@/data/users';
import { errorMessage } from '@/services/http';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import { colors, layout, maxFontSizeMultiplier, radius, spacing, typography } from '@/theme';
import type { Book } from '@/types';
import { BookPickerSheet } from '../components/BookPickerSheet';
import { PhotoPickerSheet } from '../components/PhotoPickerSheet';
import { useCreatePost } from '../hooks';

const MAX_LENGTH = 500;

interface ComposerActionProps {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
  testID: string;
}

function ComposerAction({ icon, label, active = false, onPress, testID }: ComposerActionProps) {
  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      scaleTo={0.96}
      style={[styles.action, active ? styles.actionActive : null]}
    >
      <Icon name={icon} size={22} color={active ? 'accentText' : 'textPrimary'} />
      <Text
        variant="caption"
        weight="700"
        color={active ? 'accentText' : 'textPrimary'}
        align="center"
      >
        {label}
      </Text>
    </PressableScale>
  );
}

export default function CreatePostScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const name = useAuthStore((state) => state.session?.name ?? currentUser.name);
  const createPost = useCreatePost();

  const [body, setBody] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [photo, setPhoto] = useState<string | undefined>();
  const [booksOpen, setBooksOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  const canPost = body.trim().length > 0 && !createPost.isPending;

  const submit = () => {
    if (!canPost) return;
    createPost.mutate(
      { body, bookIds: books.map((book) => book.id), imageUrl: photo },
      {
        onSuccess: () => {
          toast.success('Posted to your feed');
          router.back();
        },
        onError: (error) => toast.error(errorMessage(error, 'We could not publish your post.')),
      },
    );
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <IconButton
            icon="close"
            accessibilityLabel="Close composer"
            onPress={() => router.back()}
          />
          <Text variant="heading3" style={styles.title} accessibilityRole="header">
            Share with readers
          </Text>
          <Button
            testID="publish-post"
            label="Post"
            size="sm"
            fullWidth={false}
            disabled={!canPost}
            loading={createPost.isPending}
            onPress={submit}
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.author}>
            <Avatar name={name} size="md" />
            <View>
              <Text variant="bodySmall" weight="700">
                {name}
              </Text>
              <Text variant="caption" color="textSecondary">
                Posting to everyone
              </Text>
            </View>
          </View>

          <TextInput
            ref={inputRef}
            testID="post-input"
            value={body}
            onChangeText={setBody}
            placeholder="What are you reading? Share a thought, a review or a recommendation…"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Write your post"
            multiline
            autoFocus
            maxLength={MAX_LENGTH}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            selectionColor={colors.accent}
            style={styles.input}
          />
          <Text variant="caption" color="textTertiary" align="right">
            {body.length}/{MAX_LENGTH}
          </Text>

          {photo ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: photo }} contentFit="cover" style={styles.photo} />
              <IconButton
                icon="close"
                variant="inverse"
                size={18}
                accessibilityLabel="Remove photo"
                onPress={() => setPhoto(undefined)}
                style={styles.remove}
              />
            </View>
          ) : null}

          {books.length > 0 ? (
            <View style={styles.books}>
              {books.map((book) => (
                <View key={book.id} style={styles.bookChip}>
                  <BookCover book={book} width={32} />
                  <View style={styles.bookText}>
                    <Text variant="bodySmall" weight="700" numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={1}>
                      {book.author}
                    </Text>
                  </View>
                  <IconButton
                    icon="close-circle"
                    size={20}
                    color="textTertiary"
                    accessibilityLabel={`Remove ${book.title}`}
                    onPress={() =>
                      setBooks((current) => current.filter((item) => item.id !== book.id))
                    }
                  />
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.actions}>
          <ComposerAction
            testID="action-write"
            icon="create-outline"
            label="Write something"
            active={body.length > 0}
            onPress={() => inputRef.current?.focus()}
          />
          <ComposerAction
            testID="action-book"
            icon="book-outline"
            label={books.length > 0 ? `${books.length} attached` : 'Add book'}
            active={books.length > 0}
            onPress={() => setBooksOpen(true)}
          />
          <ComposerAction
            testID="action-photo"
            icon="image-outline"
            label="Add photo"
            active={Boolean(photo)}
            onPress={() => setPhotoOpen(true)}
          />
        </View>
      </KeyboardAvoidingView>

      <BookPickerSheet
        visible={booksOpen}
        selected={books}
        onClose={() => setBooksOpen(false)}
        onDone={(selected) => {
          setBooks(selected);
          setBooksOpen(false);
        }}
      />
      <PhotoPickerSheet
        visible={photoOpen}
        selectedUri={photo}
        onClose={() => setPhotoOpen(false)}
        onSelect={(uri) => {
          setPhoto(uri);
          setPhotoOpen(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: layout.screenPadding - spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: { flex: 1 },
  content: {
    gap: spacing.lg,
    padding: layout.screenPadding,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  author: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  input: {
    ...typography.body,
    minHeight: 140,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    outlineWidth: 0,
    outlineStyle: 'solid',
    padding: 0,
  },
  photoWrap: { borderRadius: radius.md, overflow: 'hidden' },
  photo: { width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.surfaceMuted },
  remove: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  books: { gap: spacing.sm },
  bookChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  bookText: { flex: 1, gap: 2 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: layout.screenPadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 64,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
});
