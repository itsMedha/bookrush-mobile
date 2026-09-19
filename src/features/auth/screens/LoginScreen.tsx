import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View, type TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { errorMessage } from '@/services/http';
import { spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { AuthShell } from '../components/AuthShell';
import { ForgotPasswordSheet } from '../components/ForgotPasswordSheet';
import { FormBanner } from '../components/FormBanner';
import { SocialButtons } from '../components/SocialButtons';
import { useLogin, useSocialLogin } from '../hooks';
import { loginSchema, type LoginForm } from '../schemas';

/** Demo credentials are pre-filled so reviewers can get straight in. */
const DEMO_CREDENTIALS: LoginForm = { email: 'reader@bookrush.app', password: 'bookrush' };

export default function LoginScreen() {
  const login = useLogin();
  const social = useSocialLogin();
  const passwordRef = useRef<TextInput>(null);
  const [resetVisible, setResetVisible] = useState(false);

  const { control, handleSubmit, getValues } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEMO_CREDENTIALS,
    reValidateMode: 'onChange',
  });

  const submit = handleSubmit((values) => login.mutate(values));
  const error = login.error ?? social.error;
  const busy = login.isPending || social.isPending;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <Text variant="body" color="textSecondary">
          New to BookRush?{' '}
          <Link href={routes.signup} replace accessibilityRole="link">
            <Text variant="body" weight="700" color="accentText">
              Create account
            </Text>
          </Link>
        </Text>
      }
    >
      <View style={styles.form}>
        {error ? <FormBanner message={errorMessage(error)} /> : null}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              testID="login-email"
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              testID="login-password"
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder="Your password"
              secure
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          )}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          hitSlop={12}
          onPress={() => setResetVisible(true)}
          style={styles.forgot}
        >
          <Text variant="bodySmall" weight="600" color="accentText">
            Forgot password?
          </Text>
        </Pressable>
        <Button
          testID="login-submit"
          label="Log in"
          loading={login.isPending}
          disabled={busy && !login.isPending}
          onPress={submit}
        />
      </View>

      <SocialButtons
        onPress={(provider) => social.mutate(provider)}
        loadingProvider={social.isPending ? social.variables : null}
        disabled={busy}
      />

      <ForgotPasswordSheet
        visible={resetVisible}
        initialEmail={getValues('email')}
        onClose={() => setResetVisible(false)}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.xs },
});
