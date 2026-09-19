import type { IconName } from '@/components/ui/Icon';
import type { Genre, SortOption } from '@/types';

export const SORT_OPTIONS: readonly { key: SortOption; label: string }[] = [
  { key: 'relevance', label: 'Most relevant' },
  { key: 'popular', label: 'Most popular' },
  { key: 'rating', label: 'Top rated' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
];

export const RATING_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4.0 & up' },
  { value: 4.5, label: '4.5 & up' },
];

export const GENRE_ICONS: Record<Genre, IconName> = {
  Fiction: 'book-outline',
  'Self Help': 'bulb-outline',
  Business: 'briefcase-outline',
  Psychology: 'happy-outline',
  Science: 'flask-outline',
  Technology: 'hardware-chip-outline',
  Romance: 'heart-outline',
  Fantasy: 'sparkles-outline',
};

export const isSortOption = (value: string | undefined): value is SortOption =>
  SORT_OPTIONS.some((option) => option.key === value);
