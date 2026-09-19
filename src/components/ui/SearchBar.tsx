import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, layout, maxFontSizeMultiplier, radius, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** When set the bar behaves as a button (used on Home to open Discover). */
  onPress?: () => void;
  testID?: string;
}

const DEFAULT_PLACEHOLDER = 'Search books, authors, genres...';

export function SearchBar({
  value = '',
  onChangeText,
  onSubmit,
  placeholder = DEFAULT_PLACEHOLDER,
  autoFocus,
  onPress,
  testID,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  if (onPress) {
    return (
      <PressableScale
        testID={testID}
        accessibilityRole="search"
        accessibilityLabel="Search books, authors and genres"
        onPress={onPress}
        scaleTo={0.99}
        style={styles.container}
      >
        <Icon name="search" size={20} color="textSecondary" />
        <Text variant="body" color="textTertiary" numberOfLines={1} style={styles.flex}>
          {placeholder}
        </Text>
      </PressableScale>
    );
  }

  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="textSecondary" />
      <TextInput
        ref={inputRef}
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        accessibilityLabel="Search books, authors and genres"
        selectionColor={colors.accent}
        style={[styles.input, styles.flex]}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={12}
          onPress={() => {
            onChangeText?.('');
            inputRef.current?.focus();
          }}
        >
          <Icon name="close-circle" size={20} color="textTertiary" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flex: { flex: 1 },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: layout.minTouchTarget,
    paddingVertical: 0,
    // Web: remove the default focus outline; the container border communicates focus.
    outlineWidth: 0,
    outlineStyle: 'solid',
  },
});
