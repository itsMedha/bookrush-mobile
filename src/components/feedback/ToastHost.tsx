import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius, shadows, spacing } from '@/theme';
import { useToastStore, type Toast } from '@/store/toastStore';

const TOAST_DURATION_MS = 3200;
/** Sits above the tab bar / sticky purchase bars so it never covers header controls. */
const CLEARANCE_ABOVE_BARS = 84;

const icons: Record<Toast['tone'], IconName> = {
  default: 'information-circle',
  success: 'checkmark-circle',
  error: 'alert-circle',
};

/** Renders the current toast above everything else, just clear of the bottom bars. Mount once at the app root. */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hide = useToastStore((state) => state.hide);
  const insets = useSafeAreaInsets();
  const toastId = toast?.id;

  useEffect(() => {
    if (toastId === undefined) return;
    const timer = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastId, hide]);

  if (!toast) return null;

  return (
    <View style={[styles.layer, { bottom: insets.bottom + CLEARANCE_ABOVE_BARS }]}>
      <Animated.View
        key={toast.id}
        entering={FadeInDown.springify().damping(18)}
        exiting={FadeOutDown.duration(160)}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={styles.toast}
      >
        <Icon
          name={icons[toast.tone]}
          size={20}
          color={
            toast.tone === 'error' ? 'danger' : toast.tone === 'success' ? 'sage' : 'textInverse'
          }
        />
        <Text variant="bodySmall" weight="600" color="textInverse" style={styles.message}>
          {toast.message}
        </Text>
        {toast.action ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={toast.action.label}
            hitSlop={10}
            onPress={() => {
              toast.action?.onPress();
              hide();
            }}
          >
            <Text variant="bodySmall" weight="700" color="accent">
              {toast.action.label}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    maxWidth: 480,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    boxShadow: shadows.lg,
  },
  message: { flexShrink: 1 },
});
