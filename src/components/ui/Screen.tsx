import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, layout } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  /** Safe-area edges to pad. Screens with a sticky bottom bar handle `bottom` themselves. */
  edges?: readonly Edge[];
  background?: 'background' | 'surface' | 'ink';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Root container for every screen: warm background + safe areas, capped width on large displays. */
export function Screen({
  children,
  edges = ['top'],
  background = 'background',
  style,
  testID,
}: ScreenProps) {
  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[styles.root, { backgroundColor: colors[background] }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

export const contentMaxWidth = layout.maxContentWidth;

const styles = StyleSheet.create({
  root: { flex: 1 },
});
