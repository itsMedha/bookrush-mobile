import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, type ShadowToken, type SpacingToken } from '@/theme';
import { PressableScale } from './PressableScale';

export interface CardProps {
  children: ReactNode;
  padding?: SpacingToken;
  shadow?: ShadowToken;
  bordered?: boolean;
  tone?: 'surface' | 'muted' | 'ink' | 'accentSoft' | 'sageSoft';
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const toneColors = {
  surface: colors.surface,
  muted: colors.surfaceMuted,
  ink: colors.ink,
  accentSoft: colors.accentSoft,
  sageSoft: colors.sageSoft,
} as const;

export function Card({
  children,
  padding = 'lg',
  shadow = 'none',
  bordered = true,
  tone = 'surface',
  onPress,
  accessibilityLabel,
  style,
  testID,
}: CardProps) {
  const cardStyle = [
    styles.base,
    {
      padding: spacing[padding],
      backgroundColor: toneColors[tone],
      boxShadow: shadows[shadow],
    },
    bordered && tone === 'surface' ? styles.bordered : null,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        scaleTo={0.985}
        style={cardStyle}
      >
        {children}
      </PressableScale>
    );
  }
  return (
    <View testID={testID} style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg },
  bordered: { borderWidth: 1, borderColor: colors.border },
});
