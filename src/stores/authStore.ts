import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@/types';
import { persistStorage, STORE_KEYS } from './persist';

interface AuthState {
  session: Session | null;
  hasSeenWelcome: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
  markWelcomeSeen: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hasSeenWelcome: false,
      signIn: (session) => set({ session, hasSeenWelcome: true }),
      signOut: () => set({ session: null }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),
    }),
    { name: STORE_KEYS.auth, storage: persistStorage },
  ),
);

export const selectIsSignedIn = (state: AuthState) => state.session !== null;
