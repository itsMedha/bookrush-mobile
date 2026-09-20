import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { DeliveryOption } from '@/types';

/**
 * The single place delivery speed is rendered. Every surface that shows a book — cards,
 * search results, detail, cart, checkout — uses this so "⚡ 32 min" always means the
 * same thing and looks the same.
 */

export const deliveryLabel = (delivery: DeliveryOption): string => {
  switch (delivery.type) {
    case 'INSTANT':
      return `${delivery.etaMinutes} min`;
    case 'STANDARD':
      return delivery.etaText;
    case 'UNAVAILABLE':
      return 'Unavailable';
  }
};

/** Longer phrasing for the detail screen and checkout, where there is room. */
export const deliveryHeadline = (delivery: DeliveryOption): string => {
  switch (delivery.type) {
    case 'INSTANT':
      return `Instant delivery in ${delivery.etaMinutes} min`;
    case 'STANDARD':
      return `Standard delivery in ${delivery.etaText}`;
    case 'UNAVAILABLE':
      return 'Currently unavailable';
  }
};

interface DeliveryAvailabilityProps {
  delivery: DeliveryOption;
  /** `compact` fits book cards; `full` adds the surrounding pill for rows and detail. */
  size?: 'compact' | 'full';
}

export function DeliveryAvailability({ delivery, size = 'compact' }: DeliveryAvailabilityProps) {
  const instant = delivery.type === 'INSTANT';
  const unavailable = delivery.type === 'UNAVAILABLE';

  const tone = unavailable ? styles.unavailable : instant ? styles.instant : styles.standard;
  const textColor = unavailable ? 'danger' : instant ? 'accentText' : 'sageText';

  return (
    <View
      accessible
      accessibilityLabel={deliveryHeadline(delivery)}
      style={[styles.base, tone, size === 'full' ? styles.full : null]}
    >
      <Icon
        name={unavailable ? 'close-circle' : instant ? 'flash' : 'cube-outline'}
        size={size === 'full' ? 14 : 12}
        color={textColor}
      />
      <Text variant="caption" weight="700" color={textColor} numberOfLines={1}>
        {deliveryLabel(delivery)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  full: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  instant: { backgroundColor: colors.accentSoft },
  standard: { backgroundColor: colors.sageSoft },
  unavailable: { backgroundColor: colors.dangerSoft },
});
