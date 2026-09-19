import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookCover } from '@/components/book/BookCover';
import { BookRail } from '@/components/book/BookRail';
import { BookRailSkeleton } from '@/components/book/BookSkeletons';
import { Price } from '@/components/book/Price';
import { AsyncBoundary } from '@/components/feedback/AsyncBoundary';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Rating } from '@/components/ui/Rating';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { StickyBar } from '@/components/ui/StickyBar';
import { Text } from '@/components/ui/Text';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { errorMessage } from '@/services/http';
import { useCartStore } from '@/store/cartStore';
import { colors, layout, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { routes } from '@/utils/routes';
import { DeliveryInfoCard } from '../components/DeliveryInfoCard';
import { DetailHeader } from '../components/DetailHeader';
import { ExpandableText } from '../components/ExpandableText';
import { ReviewsSection } from '../components/ReviewsSection';
import { useBook, useSimilarBooks } from '../hooks';

const HERO_HEIGHT = 340;

function DetailSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton width={190} height={285} radius="cover" style={styles.skeletonCover} />
      <Skeleton height={30} width="80%" />
      <Skeleton height={16} width="45%" />
      <Skeleton height={16} width="60%" />
      <Skeleton height={120} radius="lg" />
    </View>
  );
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const book = useBook(id);
  const similar = useSimilarBooks(id);
  const add = useCartStore((state) => state.add);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-200, 0, HERO_HEIGHT],
          [-100, 0, HERO_HEIGHT * 0.45],
        ),
      },
      { scale: interpolate(scrollY.value, [-200, 0], [1.25, 1], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(scrollY.value, [0, HERO_HEIGHT * 0.7], [1, 0.15], Extrapolation.CLAMP),
  }));

  if (book.isPending) {
    return (
      <Screen>
        <ScreenHeader />
        <ScrollView contentContainerStyle={styles.skeletonScroll}>
          <DetailSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  if (book.isError) {
    return (
      <Screen>
        <ScreenHeader />
        <ErrorState
          title="We couldn’t load this book"
          message={errorMessage(book.error)}
          onRetry={() => void book.refetch()}
          retrying={book.isFetching}
        />
      </Screen>
    );
  }

  const data = book.data;
  const coverWidth = Math.min(width * 0.5, 210);
  const outOfStock = data.stock <= 0;

  const buyNow = () => {
    // Buy Now ensures the book is in the basket and jumps straight to checkout.
    if (!useCartStore.getState().items.some((item) => item.book.id === data.id)) add(data);
    router.push(routes.checkout);
  };

  return (
    <View style={styles.root}>
      <DetailHeader bookId={data.id} title={data.title} scrollY={scrollY} />

      <Animated.ScrollView
        testID="book-scroll"
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: layout.purchaseBarHeight + insets.bottom + spacing.xxl },
        ]}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 56 }]}>
          <View style={[styles.tint, { backgroundColor: `${data.coverColor}2E` }]} />
          <Animated.View style={heroStyle}>
            <BookCover book={data} width={coverWidth} size="full" elevated />
          </Animated.View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleBlock}>
            <Text variant="heading1" testID="book-title" accessibilityRole="header">
              {data.title}
            </Text>
            <Text
              variant="body"
              color="accentText"
              weight="600"
              accessibilityRole="link"
              accessibilityLabel={`More by ${data.author}`}
              onPress={() => router.navigate(routes.discoverWith({ q: data.author }))}
            >
              {data.author}
            </Text>
            <View style={styles.ratingRow}>
              <Rating value={data.rating} count={data.ratingCount} size={16} />
            </View>
          </View>

          <View style={styles.chips}>
            <Badge label={data.genre} tone="ink" />
            <Badge label={`${data.pages} pages`} />
            <Badge label={data.language} />
            <Badge label={String(data.publishedYear)} />
          </View>

          <View style={styles.priceBlock}>
            <Price price={data.price} mrp={data.mrp} size="lg" showDiscount />
            <Text variant="caption" color="textSecondary">
              Inclusive of all taxes
            </Text>
          </View>

          <DeliveryInfoCard book={data} />

          <View style={styles.section}>
            <SectionHeader title="About this book" inset={0} />
            <ExpandableText text={data.description} />
          </View>

          <ReviewsSection book={data} />
        </View>

        <View style={styles.similar}>
          <SectionHeader title="You might also like" />
          <AsyncBoundary query={similar} skeleton={<BookRailSkeleton />}>
            {(books) => <BookRail books={books} />}
          </AsyncBoundary>
        </View>
      </Animated.ScrollView>

      <StickyBar>
        <View style={styles.barPrice}>
          <Text variant="caption" color="textSecondary">
            Price
          </Text>
          <Text variant="heading3" testID="bar-price">
            {formatPrice(data.price)}
          </Text>
        </View>
        <AddToCartButton book={data} />
        {!outOfStock ? (
          <Button testID="buy-now" label="Buy Now" onPress={buyNow} style={styles.buyNow} />
        ) : null}
      </StickyBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingBottom: spacing.xxl, overflow: 'hidden' },
  tint: { ...StyleSheet.absoluteFill },
  body: {
    gap: spacing.xl,
    padding: layout.screenPadding,
    paddingTop: spacing.xxl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -spacing.xl,
  },
  titleBlock: { gap: spacing.xs },
  ratingRow: { marginTop: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  priceBlock: { gap: spacing.xs },
  section: { gap: spacing.md },
  similar: { gap: spacing.lg, marginTop: spacing.xl },
  barPrice: { minWidth: 64 },
  buyNow: { flex: 1 },
  skeletonScroll: { padding: layout.screenPadding },
  skeleton: { gap: spacing.lg },
  skeletonCover: { alignSelf: 'center' },
});
