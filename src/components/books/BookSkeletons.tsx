import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, layout, radius, spacing } from '@/theme';
import { BOOK_CARD_WIDTH } from './BookCard';
import { COVER_ASPECT } from './BookCover';

export function BookCardSkeleton({ width = BOOK_CARD_WIDTH }: { width?: number }) {
  return (
    <View style={{ width, gap: spacing.md }}>
      <Skeleton width={width} height={Math.round(width * COVER_ASPECT)} radius="cover" />
      <View style={styles.lines}>
        <Skeleton height={14} width="90%" />
        <Skeleton height={12} width="60%" />
        <Skeleton height={12} width="45%" />
      </View>
    </View>
  );
}

export function BookRailSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.rail}>
      {Array.from({ length: count }, (_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </View>
  );
}

export function BookRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={76} height={114} radius="cover" />
      <View style={styles.rowLines}>
        <Skeleton height={16} width="80%" />
        <Skeleton height={12} width="50%" />
        <Skeleton height={12} width="35%" />
        <Skeleton height={18} width="30%" style={styles.rowPrice} />
      </View>
    </View>
  );
}

export function BookListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <BookRowSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { flexDirection: 'row', gap: spacing.lg, paddingHorizontal: layout.screenPadding },
  lines: { gap: spacing.sm },
  list: { gap: spacing.md, paddingHorizontal: layout.screenPadding },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLines: { flex: 1, gap: spacing.sm },
  rowPrice: { marginTop: spacing.md },
});
