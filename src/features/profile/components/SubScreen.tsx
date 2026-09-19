import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { layout, spacing } from '@/theme';

interface SubScreenProps {
  title: string;
  children: ReactNode;
}

export function SubScreen({ title, children }: SubScreenProps) {
  return (
    <Screen>
      <ScreenHeader title={title} border />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: layout.screenPadding,
    paddingBottom: spacing.huge,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
});
