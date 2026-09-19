import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { formatCount } from '@/utils/format';
import { Icon } from './Icon';
import { Text } from './Text';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  /** Show only one star + number (compact cards) instead of five stars. */
  compact?: boolean;
}

function starName(index: number, value: number) {
  if (value >= index + 1) return 'star' as const;
  if (value >= index + 0.5) return 'star-half' as const;
  return 'star-outline' as const;
}

function RatingBase({ value, count, size = 14, compact = false }: RatingProps) {
  const label =
    count !== undefined
      ? `Rated ${value.toFixed(1)} out of 5 from ${count} ratings`
      : `Rated ${value.toFixed(1)} out of 5`;

  return (
    <View accessible accessibilityLabel={label} style={styles.row}>
      {compact ? (
        <Icon name="star" size={size} color="star" />
      ) : (
        [0, 1, 2, 3, 4].map((index) => (
          <Icon key={index} name={starName(index, value)} size={size} color="star" />
        ))
      )}
      <Text variant="caption" color="textPrimary" weight="700" style={styles.value}>
        {value.toFixed(1)}
      </Text>
      {count !== undefined ? (
        <Text variant="caption" color="textSecondary">
          ({formatCount(count)})
        </Text>
      ) : null}
    </View>
  );
}

export const Rating = memo(RatingBase);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { marginLeft: spacing.xs },
});
