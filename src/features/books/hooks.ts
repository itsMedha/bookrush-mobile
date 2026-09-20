import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { bookService } from '@/services/bookService';
import { useUserStore } from '@/stores/userStore';
import type { Book, SearchParams } from '@/types';
import { useMemo } from 'react';

export function useTrendingBooks() {
  return useQuery({ queryKey: queryKeys.books.trending, queryFn: bookService.getTrendingBooks });
}

export function useInstantBooks() {
  return useQuery({ queryKey: queryKeys.books.instant, queryFn: bookService.getInstantBooks });
}

export function useBestSellers() {
  return useQuery({ queryKey: queryKeys.books.bestSellers, queryFn: bookService.getBestSellers });
}

export function useDeals() {
  return useQuery({ queryKey: queryKeys.books.deals, queryFn: bookService.getDeals });
}

export function useRecommendedBooks() {
  return useQuery({
    queryKey: queryKeys.books.recommended,
    queryFn: bookService.getRecommendedBooks,
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => bookService.getBook(id),
  });
}

export function useSimilarBooks(id: string) {
  return useQuery({
    queryKey: queryKeys.books.similar(id),
    queryFn: () => bookService.getSimilarBooks(id),
  });
}

export function useBookReviews(id: string) {
  return useQuery({
    queryKey: queryKeys.books.reviews(id),
    queryFn: () => bookService.getReviews(id),
  });
}

export function useMyReviews() {
  return useQuery({ queryKey: queryKeys.books.myReviews, queryFn: bookService.getMyReviews });
}

export function useBooksByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.books.byIds(ids),
    queryFn: () => bookService.getBooksByIds(ids),
  });
}

export function useGenreCounts() {
  return useQuery({ queryKey: queryKeys.books.genres, queryFn: bookService.getGenreCounts });
}

/** Keeps the previous results on screen while a new query loads, so typing never flashes empty. */
export function useSearchBooks(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.books.search(params),
    queryFn: () => bookService.searchBooks(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export interface ReadingEntry {
  book: Book;
  progress: number;
}

/** Books the reader is partway through, joined with progress kept in the user store. */
export function useContinueReading() {
  const progressById = useUserStore((state) => state.readingProgress);
  const ids = useMemo(() => Object.keys(progressById), [progressById]);

  return useQuery({
    queryKey: queryKeys.books.byIds(ids),
    queryFn: () => bookService.getBooksByIds(ids),
    select: (books): ReadingEntry[] =>
      books.map((book) => ({ book, progress: progressById[book.id] ?? 0 })),
  });
}
