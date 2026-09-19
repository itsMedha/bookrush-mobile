import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Wordmark } from '@/components/brand/Wordmark';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { layout, spacing } from '@/theme';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Shared frame for Login and Signup: back button, brand, heading, keyboard-safe scroll. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScreenHeader />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.column}>
            <Wordmark />
            <View style={styles.heading}>
              <Text variant="heading1">{title}</Text>
              <Text variant="body" color="textSecondary">
                {subtitle}
              </Text>
            </View>
            {children}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
  column: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: spacing.xl },
  heading: { gap: spacing.sm },
  footer: { alignItems: 'center', paddingTop: spacing.sm },
});
