import { booksById } from '@/data/books';
import type { Book } from '@/types';
import {
  MAX_QUANTITY_PER_BOOK,
  selectCartCount,
  selectCartSubtotal,
  selectQuantityOf,
  useCartStore,
} from '../cartStore';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

describe('cartStore', () => {
  beforeEach(() => useCartStore.getState().clear());

  it('adds a book and merges repeat additions into one line', () => {
    const { add } = useCartStore.getState();
    add(book('atomic-habits'));
    add(book('atomic-habits'));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(2);
  });

  it('derives count, subtotal and per-book quantity via selectors', () => {
    const { add } = useCartStore.getState();
    add(book('atomic-habits'), 2);
    add(book('ikigai'));

    const state = useCartStore.getState();
    expect(selectCartCount(state)).toBe(3);
    expect(selectCartSubtotal(state)).toBe(399 * 2 + 299);
    expect(selectQuantityOf('atomic-habits')(state)).toBe(2);
    expect(selectQuantityOf('sapiens')(state)).toBe(0);
  });

  it('removes a line when its quantity is set to zero', () => {
    const { add, setQuantity } = useCartStore.getState();
    add(book('ikigai'));
    setQuantity('ikigai', 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('caps quantity at the per-book maximum and available stock', () => {
    const { add, setQuantity } = useCartStore.getState();
    add(book('atomic-habits'));
    setQuantity('atomic-habits', 99);
    expect(selectQuantityOf('atomic-habits')(useCartStore.getState())).toBe(MAX_QUANTITY_PER_BOOK);

    // Zero to One only has 3 copies left.
    add(book('zero-to-one'), 8);
    expect(selectQuantityOf('zero-to-one')(useCartStore.getState())).toBe(3);
  });

  it('clears the whole cart', () => {
    const { add, clear } = useCartStore.getState();
    add(book('ikigai'));
    clear();
    expect(useCartStore.getState().items).toEqual([]);
  });
});
