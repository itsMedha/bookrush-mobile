import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors, radius, spacing } from '@/theme';
import type { AcquisitionMode, Book } from '@/types';
import { formatPrice } from '@/utils/format';
import { haptics } from '@/utils/haptics';

interface AcquisitionPickerProps {
  book: Book;
  value: AcquisitionMode;
  onChange: (mode: AcquisitionMode) => void;
}

/** Buy vs rent. Hidden entirely for titles that are sale-only. */
export function AcquisitionPicker({ book, value, onChange }: AcquisitionPickerProps) {
  if (!book.rental) return null;

  const options: { mode: AcquisitionMode; label: string; price: string; caption: string }[] = [
    {
      mode: 'buy',
      label: 'Buy',
      price: formatPrice(book.purchasePrice),
      caption: 'Yours to keep',
    },
    {
      mode: 'rent',
      label: 'Rent',
      price: formatPrice(book.rental.price),
      caption: `${book.rental.durationDays} days`,
    },
  ];

  return (
    <View accessibilityRole="radiogroup" style={styles.row}>
      {options.map((option) => {
        const selected = value === option.mode;
        return (
          <PressableScale
            key={option.mode}
            testID={`mode-${option.mode}`}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}, ${option.price}, ${option.caption}`}
            onPress={() => {
              haptics.select();
              onChange(option.mode);
            }}
            scaleTo={0.98}
            style={[styles.option, selected ? styles.selected : null]}
          >
            <Text variant="caption" weight="700" color={selected ? 'accentText' : 'textSecondary'}>
              {option.label.toUpperCase()}
            </Text>
            <Text variant="heading3">{option.price}</Text>
            <Text variant="caption" color="textSecondary">
              {option.caption}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  option: {
    flex: 1,
    gap: 2,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
});
