import { books, booksById, recommendedBookIds, trendingBookIds } from '@/data/books';
import { myReviews, reviewsForBook } from '@/data/reviews';
import { usersById } from '@/data/users';
import type {
  Book,
  Genre,
  Page,
  ReviewWithAuthor,
  ReviewWithBook,
  SearchParams,
  SortOption,
} from '@/types';
import { GENRES } from '@/types';
import { ApiError, mockRequest } from './http';

const PAGE_SIZE = 12;

const resolve = (ids: string[]): Book[] =>
  ids.map((id) => booksById.get(id)).filter((book): book is Book => book !== undefined);

/** Higher = better match. Title beats author beats genre. */
function relevance(book: Book, query: string): number {
  const q = query.toLowerCase();
  const title = book.title.toLowerCase();
  const author = book.author.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (author.includes(q)) return 50;
  if (book.genre.toLowerCase().includes(q)) return 30;
  if (book.description.toLowerCase().includes(q)) return 10;
  return 0;
}

const sorters: Record<Exclude<SortOption, 'relevance'>, (a: Book, b: Book) => number> = {
  popular: (a, b) => b.ratingCount - a.ratingCount,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export function filterBooks({
  query = '',
  genre,
  sort = 'relevance',
  expressOnly = false,
  minRating = 0,
}: SearchParams): Book[] {
  const q = query.trim();
  let results = books.filter((book) => {
    if (genre && book.genre !== genre) return false;
    if (expressOnly && !(book.expressDelivery && book.stock > 0)) return false;
    if (book.rating < minRating) return false;
    return q ? relevance(book, q) > 0 : true;
  });

  if (sort === 'relevance') {
    if (q) results = results.sort((a, b) => relevance(b, q) - relevance(a, q));
  } else {
    results = results.sort(sorters[sort]);
  }
  return results;
}

export const bookService = {
  /** Paginated catalogue, useful for infinite lists. */
  getBooks: ({ page = 0, genre }: { page?: number; genre?: Genre } = {}) =>
    mockRequest<Page<Book>>(() => {
      const all = genre ? books.filter((book) => book.genre === genre) : books;
      const start = page * PAGE_SIZE;
      const items = all.slice(start, start + PAGE_SIZE);
      return {
        items,
        total: all.length,
        nextPage: start + PAGE_SIZE < all.length ? page + 1 : null,
      };
    }),

  getBook: (id: string) =>
    mockRequest(() => {
      const book = booksById.get(id);
      if (!book) throw new ApiError('This book could not be found.', 404);
      return book;
    }),

  getBooksByIds: (ids: string[]) => mockRequest(() => resolve(ids)),

  searchBooks: (params: SearchParams) => mockRequest(() => filterBooks(params)),

  getTrendingBooks: () => mockRequest(() => resolve(trendingBookIds)),

  getRecommendedBooks: () => mockRequest(() => resolve(recommendedBookIds)),

  getSimilarBooks: (id: string) =>
    mockRequest(() => {
      const book = booksById.get(id);
      if (!book) return [];
      return books
        .filter((candidate) => candidate.id !== id && candidate.genre === book.genre)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    }),

  getReviews: (bookId: string) =>
    mockRequest<ReviewWithAuthor[]>(() =>
      reviewsForBook(bookId).flatMap((review) => {
        const author = usersById.get(review.authorId);
        return author ? [{ ...review, author }] : [];
      }),
    ),

  getMyReviews: () =>
    mockRequest<ReviewWithBook[]>(() =>
      myReviews.flatMap((review) => {
        const book = booksById.get(review.bookId);
        return book ? [{ ...review, book }] : [];
      }),
    ),

  getGenreCounts: () =>
    mockRequest(() =>
      GENRES.map((genre) => ({
        genre,
        count: books.filter((book) => book.genre === genre).length,
      })),
    ),
};
