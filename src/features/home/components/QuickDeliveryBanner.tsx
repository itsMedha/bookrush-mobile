import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BookCover } from '@/components/book/BookCover';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { booksById } from '@/data/books';
import { colors, layout, radius, spacing } from '@/theme';
import { routes } from '@/utils/routes';

const SHOWCASE_IDS = ['the-hobbit', 'deep-work', 'the-alchemist'] as const;
const TILTS = [-10, 2, 12];

/** The one dark, high-contrast block on Home: BookRush's core promise. */
export function QuickDeliveryBanner() {
  const router = useRouter();
  const covers = SHOWCASE_IDS.map((id) => booksById.get(id)).filter((book) => book !== undefined);

  return (
    <View style={styles.wrapper}>
      <View testID="quick-delivery" style={styles.banner}>
        <View style={styles.copy}>
          <View style={styles.eyebrow}>
            <Icon name="flash" size={13} color="accent" />
            <Text variant="overline" color="accent">
              Quick delivery
            </Text>
          </View>
          <Text variant="heading2" color="textInverse">
            Books delivered to your door
          </Text>
          <Text variant="bodySmall" color="textInverseMuted">
            Get selected books in 30–60 min
          </Text>
          <Button
            label="Shop express books"
            variant="accent"
            size="sm"
            fullWidth={false}
            rightIcon="arrow-forward"
            style={styles.cta}
            onPress={() => router.navigate(routes.discoverWith({ express: true }))}
          />
        </View>
        <View style={styles.covers}>
          {covers.map((book, index) => (
            <View
              key={book.id}
              style={[
                styles.cover,
                {
                  left: index * 26,
                  top: index === 1 ? 0 : 12,
                  transform: [{ rotate: `${TILTS[index] ?? 0}deg` }],
                },
              ]}
            >
              <BookCover book={book} width={56} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: layout.screenPadding },
  banner: {
    flexDirection: 'row',
    overflow: 'hidden',
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    gap: spacing.md,
  },
  copy: { flex: 1, gap: spacing.sm, zIndex: 1 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cta: { marginTop: spacing.sm },
  covers: { width: 96, height: 120, marginRight: -spacing.sm, pointerEvents: 'none' },
  cover: { position: 'absolute' },
});
