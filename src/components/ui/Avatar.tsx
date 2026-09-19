import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { avatarTones, colors } from '@/theme';
import { initialsOf } from '@/utils/format';
import { pickBySeed } from '@/utils/images';
import { Text } from './Text';

const sizes = { xs: 24, sm: 32, md: 44, lg: 72, xl: 96 } as const;
export type AvatarSize = keyof typeof sizes;

interface AvatarProps {
  name: string;
  uri?: string;
  size?: AvatarSize;
}

function AvatarBase({ name, uri, size = 'md' }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const dimension = sizes[size];
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${name}'s avatar`}
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: pickBySeed(avatarTones, name),
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          variant={dimension >= 72 ? 'heading1' : dimension >= 44 ? 'heading3' : 'caption'}
          color="textInverse"
          style={styles.initials}
        >
          {initialsOf(name)}
        </Text>
      )}
    </View>
  );
}

export const Avatar = memo(AvatarBase);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface,
  },
  initials: { fontWeight: '700' },
});
