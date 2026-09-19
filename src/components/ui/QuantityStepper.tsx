import { StyleSheet, View } from 'react-native';
import { colors, layout, radius, spacing } from '@/theme';
import { haptics } from '@/utils/haptics';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

/** − 1 + control. Decrementing below `min` reports 0 so callers can offer removal. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Quantity',
}: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment' && !atMax) onChange(value + 1);
        if (event.nativeEvent.actionName === 'decrement') onChange(atMin ? 0 : value - 1);
      }}
      style={styles.container}
    >
      <PressableScale
        testID="stepper-decrement"
        accessibilityLabel={atMin ? 'Remove from cart' : 'Decrease quantity'}
        accessibilityRole="button"
        onPress={() => {
          haptics.select();
          onChange(atMin ? 0 : value - 1);
        }}
        style={styles.button}
      >
        <Icon
          name={atMin ? 'trash-outline' : 'remove'}
          size={16}
          color={atMin ? 'danger' : 'textPrimary'}
        />
      </PressableScale>
      <Text
        variant="bodySmall"
        weight="700"
        align="center"
        style={styles.value}
        testID="stepper-value"
      >
        {value}
      </Text>
      <PressableScale
        testID="stepper-increment"
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        accessibilityState={{ disabled: atMax }}
        disabled={atMax}
        onPress={() => {
          haptics.select();
          onChange(value + 1);
        }}
        style={[styles.button, atMax ? styles.disabled : null]}
      >
        <Icon name="add" size={16} color="textPrimary" />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  button: {
    width: layout.minTouchTarget - 4,
    height: layout.minTouchTarget - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { minWidth: spacing.xl },
  disabled: { opacity: 0.35 },
});
