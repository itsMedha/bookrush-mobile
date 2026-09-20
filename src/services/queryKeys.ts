import type { FeedTab, SearchParams } from '@/types';

/** Central query-key factory so invalidation is always targeted and typo-proof. */
export const queryKeys = {
  books: {
    all: ['books'] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
    byIds: (ids: string[]) => ['books', 'by-ids', ids] as const,
    search: (params: SearchParams) => ['books', 'search', params] as const,
    trending: ['books', 'trending'] as const,
    instant: ['books', 'instant'] as const,
    bestSellers: ['books', 'best-sellers'] as const,
    deals: ['books', 'deals'] as const,
    recommended: ['books', 'recommended'] as const,
    similar: (id: string) => ['books', 'similar', id] as const,
    reviews: (id: string) => ['books', 'reviews', id] as const,
    myReviews: ['books', 'my-reviews'] as const,
    genres: ['books', 'genres'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  community: {
    posts: (tab: FeedTab, followingKey: string) =>
      ['community', 'posts', tab, followingKey] as const,
    postsRoot: ['community', 'posts'] as const,
    byAuthor: (authorId: string) => ['community', 'author', authorId] as const,
    comments: (postId: string) => ['community', 'comments', postId] as const,
    clubs: ['community', 'clubs'] as const,
    club: (id: string) => ['community', 'clubs', id] as const,
  },
};
