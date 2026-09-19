import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radius, spacing } from '@/theme';

export function PostSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={44} height={44} radius="pill" />
        <View style={styles.lines}>
          <Skeleton height={14} width="40%" />
          <Skeleton height={12} width="55%" />
        </View>
      </View>
      <Skeleton height={14} width="95%" />
      <Skeleton height={14} width="80%" />
      <Skeleton height={64} radius="md" />
    </View>
  );
}

export function PostListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <PostSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  lines: { flex: 1, gap: spacing.sm },
});
