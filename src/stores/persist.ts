import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Shared persistence backend so every store hydrates from AsyncStorage the same way. */
export const persistStorage = createJSONStorage(() => AsyncStorage);

export const STORE_KEYS = {
  auth: 'bookrush.auth.v1',
  cart: 'bookrush.cart.v1',
  user: 'bookrush.user.v1',
  community: 'bookrush.community.v1',
  search: 'bookrush.search.v1',
} as const;
