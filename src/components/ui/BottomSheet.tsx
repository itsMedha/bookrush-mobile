import { useEffect, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { colors, duration, radius, shadows, spacing, spring } from '@/theme';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Wrap content in a ScrollView (lists). Otherwise the sheet hugs its content. */
  scrollable?: boolean;
  testID?: string;
}

const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 900;

/**
 * Spring-driven modal sheet: tap the scrim, drag the handle or hit back to dismiss.
 * Stays mounted until the exit animation finishes.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  scrollable = false,
  testID,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(height);
  const scrim = useSharedValue(0);

  // Mount as soon as the sheet is requested (render-phase update); unmount after the exit animation.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, spring.gentle);
      scrim.value = withTiming(1, { duration: duration.base });
    } else {
      scrim.value = withTiming(0, { duration: duration.base });
      translateY.value = withTiming(height, { duration: duration.base }, (finished) => {
        if (finished) scheduleOnRN(setMounted, false);
      });
    }
  }, [visible, height, translateY, scrim]);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
      } else {
        translateY.value = withSpring(0, spring.gentle);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));

  if (!mounted) return null;

  const content = <View style={styles.body}>{children}</View>;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
      testID={testID}
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.scrim, scrimStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <Animated.View
            style={[
              styles.sheet,
              { maxHeight: height * 0.88, paddingBottom: Math.max(insets.bottom, spacing.lg) },
              sheetStyle,
            ]}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.header}>
                <View style={styles.handle} />
                {title ? (
                  <View style={styles.titleRow}>
                    <Text variant="heading2" style={styles.title} accessibilityRole="header">
                      {title}
                    </Text>
                    <IconButton
                      icon="close"
                      accessibilityLabel="Close"
                      onPress={onClose}
                      size={20}
                    />
                  </View>
                ) : null}
              </View>
            </GestureDetector>
            {scrollable ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {content}
              </ScrollView>
            ) : (
              content
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  keyboard: { flex: 1, justifyContent: 'flex-end', pointerEvents: 'box-none' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    boxShadow: shadows.lg,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  header: { paddingTop: spacing.sm, paddingHorizontal: spacing.xl },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1 },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
});
