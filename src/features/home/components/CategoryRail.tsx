import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { GENRE_ICONS } from '@/features/discover/constants';
import { colors, layout, radius, spacing } from '@/theme';
import { GENRES } from '@/types';
import { routes } from '@/utils/routes';

/** Category shortcuts straight into a filtered Discover, the way a storefront opens aisles. */
export function CategoryRail() {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {GENRES.map((genre) => (
        <PressableScale
          key={genre}
          testID={`category-${genre}`}
          accessibilityRole="button"
          accessibilityLabel={`Browse ${genre}`}
          onPress={() => router.navigate(routes.discoverWith({ genre }))}
          scaleTo={0.95}
          style={styles.item}
        >
          <View style={styles.tile}>
            <Icon name={GENRE_ICONS[genre]} size={22} color="accentText" />
          </View>
          <Text variant="caption" weight="600" align="center" numberOfLines={2}>
            {genre}
          </Text>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingHorizontal: layout.screenPadding },
  item: { width: 72, alignItems: 'center', gap: spacing.sm },
  tile: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
