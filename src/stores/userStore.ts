import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { readingProgressSeed } from '@/data/books';
import { seedAddresses } from '@/data/users';
import type { Address, Genre, PaymentMethodId } from '@/types';
import { createId } from '@/utils/id';
import { persistStorage, STORE_KEYS } from './persist';

export type NotificationKey = 'orderUpdates' | 'deliveryAlerts' | 'community' | 'recommendations';

interface UserState {
  addresses: Address[];
  selectedAddressId: string;
  paymentMethod: PaymentMethodId;
  favoriteGenres: Genre[];
  savedBookIds: string[];
  /** 0–1 progress per book id. */
  readingProgress: Record<string, number>;
  notifications: Record<NotificationKey, boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  selectAddress: (id: string) => void;
  setPaymentMethod: (method: PaymentMethodId) => void;
  setFavoriteGenres: (genres: Genre[]) => void;
  toggleSavedBook: (bookId: string) => void;
  setNotification: (key: NotificationKey, value: boolean) => void;
  reset: () => void;
}

const initialState = () => ({
  addresses: seedAddresses,
  selectedAddressId: seedAddresses[0]?.id ?? '',
  paymentMethod: 'upi' as PaymentMethodId,
  favoriteGenres: [] as Genre[],
  savedBookIds: ['project-hail-mary', 'the-hobbit', 'range'],
  readingProgress: readingProgressSeed,
  notifications: {
    orderUpdates: true,
    deliveryAlerts: true,
    community: true,
    recommendations: false,
  },
});

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState(),

      addAddress: (input) => {
        const address: Address = { ...input, id: createId('addr') };
        set(({ addresses }) => ({
          addresses: [...addresses, address],
          selectedAddressId: address.id,
        }));
        return address;
      },

      selectAddress: (selectedAddressId) => set({ selectedAddressId }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setFavoriteGenres: (favoriteGenres) => set({ favoriteGenres }),

      toggleSavedBook: (bookId) =>
        set(({ savedBookIds }) => ({
          savedBookIds: savedBookIds.includes(bookId)
            ? savedBookIds.filter((id) => id !== bookId)
            : [bookId, ...savedBookIds],
        })),

      setNotification: (key, value) =>
        set(({ notifications }) => ({ notifications: { ...notifications, [key]: value } })),

      reset: () => set(initialState()),
    }),
    { name: STORE_KEYS.user, storage: persistStorage },
  ),
);

export const selectSelectedAddress = (state: UserState): Address | undefined =>
  state.addresses.find((address) => address.id === state.selectedAddressId) ?? state.addresses[0];
