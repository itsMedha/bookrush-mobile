import type { Tabs } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useActiveOrderCount } from '@/features/orders/hooks';
import { colors, layout, radius, shadows, spacing, spring } from '@/theme';
import { haptics } from '@/utils/haptics';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

interface TabMeta {
  label: string;
  icon: IconName;
  activeIcon: IconName;
}

const tabMeta: Record<string, TabMeta> = {
  index: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  discover: { label: 'Discover', icon: 'compass-outline', activeIcon: 'compass' },
  orders: { label: 'Orders', icon: 'cube-outline', activeIcon: 'cube' },
  community: { label: 'Community', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
  profile: { label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
};

interface TabItemProps {
  meta: TabMeta;
  focused: boolean;
  showDot: boolean;
  onPress: () => void;
  onLongPress: () => void;
  testID?: string;
}

function TabItem({ meta, focused, showDot, onPress, onLongPress, testID }: TabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, spring.snappy);
  }, [focused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: 0.5 + progress.value * 0.5 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.08 }, { translateY: -progress.value }],
  }));

  return (
    <Pressable
      testID={testID}
      accessibilityRole="tab"
      accessibilityLabel={showDot ? `${meta.label}, active order` : meta.label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      <View style={styles.iconSlot}>
        <Animated.View style={[styles.pill, pillStyle]} />
        <Animated.View style={iconStyle}>
          <Icon
            name={focused ? meta.activeIcon : meta.icon}
            size={22}
            color={focused ? 'ink' : 'textSecondary'}
          />
        </Animated.View>
        {showDot ? <View style={styles.dot} /> : null}
      </View>
      <Text
        variant="caption"
        weight={focused ? '700' : '500'}
        color={focused ? 'ink' : 'textSecondary'}
      >
        {meta.label}
      </Text>
    </Pressable>
  );
}

/** Minimal bottom tab bar: hairline top border, animated pill behind the active icon. */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeOrders = useActiveOrderCount();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const meta = tabMeta[route.name];
          if (!meta) return null;
          const focused = state.index === index;

          return (
            <TabItem
              key={route.key}
              testID={`tab-${route.name}`}
              meta={meta}
              focused={focused}
              showDot={route.name === 'orders' && activeOrders > 0}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  haptics.select();
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    boxShadow: shadows.bar,
  },
  inner: {
    flexDirection: 'row',
    height: layout.tabBarHeight,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  iconSlot: { width: 56, height: 30, alignItems: 'center', justifyContent: 'center' },
  pill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  dot: {
    position: 'absolute',
    top: 3,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
