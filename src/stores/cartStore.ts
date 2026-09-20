import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AcquisitionMode, Book, CartItem } from '@/types';
import { lineTotal } from '@/utils/pricing';
import { persistStorage, STORE_KEYS } from './persist';

export const MAX_QUANTITY_PER_BOOK = 10;

interface CartState {
  items: CartItem[];
  add: (book: Book, mode?: AcquisitionMode, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  setMode: (bookId: string, mode: AcquisitionMode) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const limitFor = (book: Book) => Math.max(1, Math.min(MAX_QUANTITY_PER_BOOK, book.stock));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // A book occupies one line. Adding it again as a rental switches that line over
      // instead of splitting into two, which is what people expect from a cart.
      add: (book, mode = 'buy', quantity = 1) =>
        set(({ items }) => {
          const existing = items.find((item) => item.book.id === book.id);
          if (!existing) {
            return {
              items: [...items, { book, mode, quantity: Math.min(quantity, limitFor(book)) }],
            };
          }
          return {
            items: items.map((item) =>
              item.book.id === book.id
                ? {
                    ...item,
                    mode,
                    quantity:
                      item.mode === mode
                        ? Math.min(item.quantity + quantity, limitFor(book))
                        : item.quantity,
                  }
                : item,
            ),
          };
        }),

      setQuantity: (bookId, quantity) =>
        set(({ items }) => ({
          items: items
            .map((item) =>
              item.book.id === bookId
                ? { ...item, quantity: Math.min(quantity, limitFor(item.book)) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      setMode: (bookId, mode) =>
        set(({ items }) => ({
          items: items.map((item) => (item.book.id === bookId ? { ...item, mode } : item)),
        })),

      remove: (bookId) =>
        set(({ items }) => ({ items: items.filter((item) => item.book.id !== bookId) })),

      clear: () => set({ items: [] }),
    }),
    { name: STORE_KEYS.cart, storage: persistStorage },
  ),
);

/** Selectors keep components subscribed to exactly the slice they render. */
export const selectCartCount = (state: { items: CartItem[] }) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: { items: CartItem[] }) =>
  state.items.reduce((sum, item) => sum + lineTotal(item), 0);

export const selectCartLine =
  (bookId: string) =>
  (state: { items: CartItem[] }): CartItem | undefined =>
    state.items.find((item) => item.book.id === bookId);

export const selectQuantityOf = (bookId: string) => (state: { items: CartItem[] }) =>
  selectCartLine(bookId)(state)?.quantity ?? 0;
