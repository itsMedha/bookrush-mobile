import { useState, type Ref } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, layout, maxFontSizeMultiplier, radius, spacing, typography } from '@/theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface TextFieldProps extends Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'onBlur'
  | 'placeholder'
  | 'keyboardType'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'textContentType'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'multiline'
  | 'maxLength'
  | 'autoFocus'
  | 'testID'
> {
  label: string;
  error?: string;
  icon?: IconName;
  /** Password behaviour: hides text and shows a visibility toggle. */
  secure?: boolean;
  ref?: Ref<TextInput>;
}

export function TextField({
  label,
  error,
  icon,
  secure = false,
  multiline,
  ref,
  testID,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text variant="bodySmall" weight="600" color="textPrimary">
        {label}
      </Text>
      <View
        style={[
          styles.field,
          multiline ? styles.multiline : null,
          focused ? styles.focused : null,
          error ? styles.errored : null,
        ]}
      >
        {icon ? <Icon name={icon} size={18} color="textSecondary" /> : null}
        <TextInput
          {...inputProps}
          ref={ref}
          testID={testID}
          multiline={multiline}
          secureTextEntry={secure && !revealed}
          accessibilityLabel={label}
          accessibilityHint={error}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.accent}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          style={[styles.input, multiline ? styles.inputMultiline : null]}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            hitSlop={12}
            onPress={() => setRevealed((value) => !value)}
          >
            <Icon
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="textSecondary"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text
          variant="caption"
          color="danger"
          accessibilityLiveRegion="polite"
          testID={`${testID}-error`}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  field: {
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
  multiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  focused: { borderColor: colors.ink },
  errored: { borderColor: colors.danger },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    minHeight: layout.minTouchTarget,
    paddingVertical: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
  },
  inputMultiline: { minHeight: 96, textAlignVertical: 'top' },
});
