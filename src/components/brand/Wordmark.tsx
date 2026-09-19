import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';

interface WordmarkProps {
  /** Overall scale: `md` for headers, `lg` for splash. */
  size?: 'md' | 'lg';
  tone?: 'dark' | 'light';
}

/** BookRush brand lockup: ink monogram with an amber spine + serif wordmark. */
export function Wordmark({ size = 'md', tone = 'dark' }: WordmarkProps) {
  const mark = size === 'lg' ? 44 : 32;
  const dark = tone === 'dark';

  return (
    <View accessible accessibilityRole="header" accessibilityLabel="BookRush" style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: mark,
            height: mark,
            backgroundColor: dark ? colors.ink : colors.background,
          },
        ]}
      >
        <View style={[styles.spine, { width: mark * 0.12 }]} />
        <Text
          variant="heading2"
          color={dark ? 'textInverse' : 'ink'}
          style={{ fontSize: mark * 0.55, lineHeight: mark * 0.7 }}
        >
          B
        </Text>
      </View>
      <Text
        variant="heading1"
        color={dark ? 'ink' : 'textInverse'}
        style={{ fontSize: size === 'lg' ? 30 : 22, lineHeight: size === 'lg' ? 36 : 28 }}
      >
        Book
        <Text variant="heading1" color="accent" style={{ fontSize: size === 'lg' ? 30 : 22 }}>
          Rush
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.accent },
});
