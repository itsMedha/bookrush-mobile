import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, type TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { errorMessage } from '@/services/http';
import { spacing } from '@/theme';
import { GENRES, type Genre } from '@/types';
import { routes } from '@/utils/routes';
import { AuthShell } from '../components/AuthShell';
import { FormBanner } from '../components/FormBanner';
import { SocialButtons } from '../components/SocialButtons';
import { useSignup, useSocialLogin } from '../hooks';
import { signupSchema, type SignupForm } from '../schemas';

export default function SignupScreen() {
  const signup = useSignup();
  const social = useSocialLogin();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', genres: [] },
    reValidateMode: 'onChange',
  });

  const submit = handleSubmit((values) => signup.mutate(values));
  const error = signup.error ?? social.error;
  const busy = signup.isPending || social.isPending;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join readers who get their next favourite book in under an hour."
      footer={
        <Text variant="body" color="textSecondary">
          Already have an account?{' '}
          <Link href={routes.login} replace accessibilityRole="link">
            <Text variant="body" weight="700" color="accentText">
              Log in
            </Text>
          </Link>
        </Text>
      }
    >
      <View style={styles.form}>
        {error ? <FormBanner message={errorMessage(error)} /> : null}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              testID="signup-name"
              label="Name"
              icon="person-outline"
              placeholder="Your name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              testID="signup-email"
              ref={emailRef}
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
              testID="signup-password"
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder="At least 8 characters, 1 number"
              secure
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          )}
        />

        <Controller
          control={control}
          name="genres"
          render={({ field }) => (
            <View style={styles.genres}>
              <Text variant="bodySmall" weight="600">
                Favourite genres{' '}
                <Text variant="bodySmall" color="textSecondary">
                  (optional)
                </Text>
              </Text>
              <View style={styles.chips}>
                {GENRES.map((genre: Genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    selected={field.value.includes(genre)}
                    onPress={() =>
                      field.onChange(
                        field.value.includes(genre)
                          ? field.value.filter((item) => item !== genre)
                          : [...field.value, genre],
                      )
                    }
                  />
                ))}
              </View>
            </View>
          )}
        />

        <Button
          testID="signup-submit"
          label="Create account"
          loading={signup.isPending}
          disabled={busy && !signup.isPending}
          onPress={submit}
        />
      </View>

      <SocialButtons
        onPress={(provider) => social.mutate(provider)}
        loadingProvider={social.isPending ? social.variables : null}
        disabled={busy}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  genres: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
