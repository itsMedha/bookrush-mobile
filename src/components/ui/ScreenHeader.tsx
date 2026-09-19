import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, layout, spacing } from '@/theme';
import { routes } from '@/utils/routes';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface ScreenHeaderProps {
  title?: string;
  /** Hide the back button for tab roots. */
  showBack?: boolean;
  right?: ReactNode;
  onBack?: () => void;
  border?: boolean;
  /** Use the leading position for a large title (tab screens). */
  large?: boolean;
  subtitle?: string;
}

/** Back falls back to Home when there is nothing to pop (deep links, refreshes). */
export function ScreenHeader({
  title,
  showBack = true,
  right,
  onBack,
  border = false,
  large = false,
  subtitle,
}: ScreenHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace(routes.home);
  };

  return (
    <View style={[styles.container, border ? styles.border : null]}>
      {showBack ? (
        <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={goBack} />
      ) : null}
      <View style={[styles.titleWrap, !showBack && styles.titleFlush]}>
        {title ? (
          <Text
            variant={large ? 'heading1' : 'heading3'}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: layout.screenPadding - spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  titleWrap: { flex: 1 },
  titleFlush: { paddingLeft: spacing.xs },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
