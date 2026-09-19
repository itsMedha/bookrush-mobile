import { useDevStore } from '@/stores/devStore';
import { bookService, filterBooks } from '../bookService';

describe('filterBooks', () => {
  it('ranks title matches above author matches', () => {
    const results = filterBooks({ query: 'clear' });
    expect(results[0]?.id).toBe('atomic-habits');
  });

  it('filters by genre and express delivery', () => {
    const results = filterBooks({ genre: 'Fantasy', expressOnly: true });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((book) => book.genre === 'Fantasy' && book.expressDelivery)).toBe(true);
    // Dune is Fantasy but standard-only.
    expect(results.some((book) => book.id === 'dune')).toBe(false);
  });

  it('sorts by price ascending and applies a rating floor', () => {
    const cheap = filterBooks({ sort: 'price-asc' });
    expect(cheap[0]?.price).toBeLessThanOrEqual(cheap[1]?.price ?? Infinity);

    const top = filterBooks({ minRating: 4.7 });
    expect(top.every((book) => book.rating >= 4.7)).toBe(true);
  });

  it('returns nothing for a query with no matches', () => {
    expect(filterBooks({ query: 'zzzzqx' })).toEqual([]);
  });
});

describe('bookService', () => {
  afterEach(() => useDevStore.getState().setSimulateOffline(false));

  it('rejects unknown ids with a 404', async () => {
    await expect(bookService.getBook('nope')).rejects.toMatchObject({ status: 404 });
  });

  it('paginates the catalogue', async () => {
    const first = await bookService.getBooks({ page: 0 });
    expect(first.items).toHaveLength(12);
    expect(first.nextPage).toBe(1);

    const last = await bookService.getBooks({ page: 2 });
    expect(last.nextPage).toBeNull();
  });

  it('fails every request while offline simulation is on', async () => {
    useDevStore.getState().setSimulateOffline(true);
    await expect(bookService.getTrendingBooks()).rejects.toThrow('Network request failed');
  });
});
