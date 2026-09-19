import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { errorMessage } from '@/services/http';
import { toast } from '@/stores/toastStore';
import { spacing } from '@/theme';
import { usePasswordReset } from '../hooks';
import { resetSchema, type ResetForm } from '../schemas';
import { FormBanner } from './FormBanner';

interface ForgotPasswordSheetProps {
  visible: boolean;
  initialEmail: string;
  onClose: () => void;
}

export function ForgotPasswordSheet({ visible, initialEmail, onClose }: ForgotPasswordSheetProps) {
  const reset = usePasswordReset();
  const { control, handleSubmit } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    values: { email: initialEmail },
  });

  const submit = handleSubmit((values) =>
    reset.mutate(values.email, {
      onSuccess: ({ sentTo }) => {
        toast.success(`Reset link sent to ${sentTo}`);
        onClose();
      },
    }),
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Reset password">
      <View style={styles.content}>
        <Text variant="body" color="textSecondary">
          Enter your email and we will send you a link to choose a new password.
        </Text>
        {reset.isError ? <FormBanner message={errorMessage(reset.error)} /> : null}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              testID="reset-email"
              label="Email"
              icon="mail-outline"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="send"
              onSubmitEditing={submit}
            />
          )}
        />
        <Button label="Send reset link" loading={reset.isPending} onPress={submit} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.sm },
});
