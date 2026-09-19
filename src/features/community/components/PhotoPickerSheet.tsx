import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { samplePhotos } from '@/data/posts';
import { colors, radius, spacing } from '@/theme';

interface PhotoPickerSheetProps {
  visible: boolean;
  selectedUri?: string;
  onSelect: (uri: string) => void;
  onClose: () => void;
}

/** Curated photo shelf standing in for the system photo library in this demo. */
export function PhotoPickerSheet({
  visible,
  selectedUri,
  onSelect,
  onClose,
}: PhotoPickerSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add a photo" scrollable>
      <View style={styles.body}>
        <Text variant="bodySmall" color="textSecondary">
          Pick a reading-nook photo. (The demo uses a curated set instead of your library.)
        </Text>
        <View style={styles.grid}>
          {samplePhotos.map((photo) => {
            const selected = photo.uri === selectedUri;
            return (
              <PressableScale
                key={photo.id}
                testID={`pick-photo-${photo.id}`}
                accessibilityRole="imagebutton"
                accessibilityLabel={`Photo: ${photo.id.replace('-', ' ')}`}
                accessibilityState={{ selected }}
                onPress={() => onSelect(photo.uri)}
                scaleTo={0.96}
                style={[styles.tile, selected ? styles.tileSelected : null]}
              >
                <Image
                  source={{ uri: photo.uri }}
                  contentFit="cover"
                  style={styles.image}
                  transition={150}
                />
              </PressableScale>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    flexBasis: '31%',
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.transparent,
    backgroundColor: colors.surfaceMuted,
  },
  tileSelected: { borderColor: colors.accent },
  image: { flex: 1 },
});
