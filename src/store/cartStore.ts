import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, CartItem } from '@/types';
import { persistStorage, STORE_KEYS } from './persist';

export const MAX_QUANTITY_PER_BOOK = 10;

interface CartState {
  items: CartItem[];
  add: (book: Book, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const limitFor = (book: Book) => Math.max(1, Math.min(MAX_QUANTITY_PER_BOOK, book.stock));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (book, quantity = 1) =>
        set(({ items }) => {
          const existing = items.find((item) => item.book.id === book.id);
          if (!existing) {
            return { items: [...items, { book, quantity: Math.min(quantity, limitFor(book)) }] };
          }
          return {
            items: items.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, limitFor(book)) }
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
  state.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

export const selectQuantityOf = (bookId: string) => (state: { items: CartItem[] }) =>
  state.items.find((item) => item.book.id === bookId)?.quantity ?? 0;
