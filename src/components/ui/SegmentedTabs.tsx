import { useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, layout, spacing, spring } from '@/theme';
import { haptics } from '@/utils/haptics';
import { Text } from './Text';

export interface TabItem<K extends string> {
  key: K;
  label: string;
}

interface SegmentedTabsProps<K extends string> {
  items: readonly TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
}

/** Equal-width tabs with a spring-animated underline. */
export function SegmentedTabs<K extends string>({ items, value, onChange }: SegmentedTabsProps<K>) {
  const [width, setWidth] = useState(0);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.key === value),
  );
  const tabWidth = items.length > 0 ? width / items.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    width: tabWidth,
    transform: [{ translateX: withSpring(activeIndex * tabWidth, spring.snappy) }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
    >
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.label}
            style={styles.tab}
            onPress={() => {
              if (!selected) haptics.select();
              onChange(item.key);
            }}
          >
            <Text
              variant="bodySmall"
              weight={selected ? '700' : '500'}
              color={selected ? 'textPrimary' : 'textSecondary'}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  indicator: { position: 'absolute', bottom: -1, height: 2, backgroundColor: colors.ink },
});
