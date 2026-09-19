import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BookCover } from '@/components/book/BookCover';
import { booksById } from '@/data/books';
import { colors } from '@/theme';

interface FloatingCoverProps {
  bookId: string;
  width: number;
  left: number;
  top: number;
  rotate: number;
  delay: number;
  amplitude: number;
}

function FloatingCover({ bookId, width, left, top, rotate, delay, amplitude }: FloatingCoverProps) {
  const book = booksById.get(bookId);
  const offset = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    offset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-amplitude, { duration: 2600 }),
          withTiming(amplitude, { duration: 2600 }),
        ),
        -1,
        true,
      ),
    );
  }, [offset, delay, amplitude, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }, { rotate: `${rotate}deg` }],
  }));

  if (!book) return null;
  return (
    <Animated.View style={[styles.cover, { left, top }, style]}>
      <BookCover book={book} width={width} size="full" elevated />
    </Animated.View>
  );
}

/** Hero artwork for the welcome screen: three tilted covers drifting over a warm disc. */
export function CoverCollage({ size }: { size: number }) {
  const centerWidth = size * 0.42;
  const sideWidth = size * 0.34;

  return (
    <View style={[styles.stage, { width: size, height: size }]}>
      <View style={[styles.disc, { width: size * 0.9, height: size * 0.9, borderRadius: size }]} />
      <FloatingCover
        bookId="midnight-library"
        width={sideWidth}
        left={size * 0.04}
        top={size * 0.2}
        rotate={-9}
        delay={0}
        amplitude={5}
      />
      <FloatingCover
        bookId="project-hail-mary"
        width={sideWidth}
        left={size * 0.62}
        top={size * 0.14}
        rotate={8}
        delay={600}
        amplitude={6}
      />
      <FloatingCover
        bookId="atomic-habits"
        width={centerWidth}
        left={size * 0.29}
        top={size * 0.22}
        rotate={0}
        delay={300}
        amplitude={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  disc: { position: 'absolute', backgroundColor: colors.accentSoft },
  cover: { position: 'absolute' },
});
