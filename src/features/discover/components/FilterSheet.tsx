import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { ToggleRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';
import type { SortOption } from '@/types';
import { RATING_OPTIONS, SORT_OPTIONS } from '../constants';

export interface BrowseFilters {
  sort: SortOption;
  expressOnly: boolean;
  minRating: number;
}

export const DEFAULT_FILTERS: BrowseFilters = {
  sort: 'relevance',
  expressOnly: false,
  minRating: 0,
};

export const countActiveFilters = ({ sort, expressOnly, minRating }: BrowseFilters) =>
  Number(sort !== 'relevance') + Number(expressOnly) + Number(minRating > 0);

interface FilterSheetProps {
  visible: boolean;
  value: BrowseFilters;
  onApply: (filters: BrowseFilters) => void;
  onClose: () => void;
}

/** Sort + filter sheet. Edits a draft and only applies on confirm. */
export function FilterSheet({ visible, value, onApply, onClose }: FilterSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort & filter" scrollable>
      <FilterForm
        initial={value}
        onApply={(filters) => {
          onApply(filters);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

// Mounted fresh every time the sheet opens, so the draft always starts from the applied filters.
function FilterForm({
  initial,
  onApply,
}: {
  initial: BrowseFilters;
  onApply: (f: BrowseFilters) => void;
}) {
  const [draft, setDraft] = useState(initial);

  return (
    <View style={styles.form}>
      <View style={styles.group}>
        <Text variant="overline" color="textSecondary">
          Sort by
        </Text>
        <View style={styles.options}>
          {SORT_OPTIONS.map((option) => {
            const selected = draft.sort === option.key;
            return (
              <PressableScale
                key={option.key}
                testID={`sort-${option.key}`}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                onPress={() => setDraft((current) => ({ ...current, sort: option.key }))}
                scaleTo={0.99}
                style={[styles.option, selected ? styles.optionSelected : null]}
              >
                <Text variant="body" weight={selected ? '700' : '400'}>
                  {option.label}
                </Text>
                {selected ? <Icon name="checkmark-circle" size={20} color="accent" /> : null}
              </PressableScale>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <Text variant="overline" color="textSecondary">
          Delivery
        </Text>
        <ToggleRow
          testID="filter-express"
          icon="flash-outline"
          title="30 min delivery only"
          subtitle="Show books available for express delivery"
          value={draft.expressOnly}
          onValueChange={(expressOnly) => setDraft((current) => ({ ...current, expressOnly }))}
        />
      </View>

      <View style={styles.group}>
        <Text variant="overline" color="textSecondary">
          Rating
        </Text>
        <View style={styles.chips}>
          {RATING_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={draft.minRating === option.value}
              onPress={() => setDraft((current) => ({ ...current, minRating: option.value }))}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Reset"
          variant="secondary"
          fullWidth={false}
          style={styles.reset}
          onPress={() => setDraft(DEFAULT_FILTERS)}
        />
        <Button
          testID="filter-apply"
          label="Show results"
          style={styles.apply}
          onPress={() => onApply(draft)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.xl, paddingBottom: spacing.sm },
  group: { gap: spacing.sm },
  options: { gap: spacing.xs },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md },
  reset: { paddingHorizontal: spacing.xl },
  apply: { flex: 1 },
});
