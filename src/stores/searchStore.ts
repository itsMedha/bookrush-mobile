import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORE_KEYS } from './persist';

const MAX_RECENT = 6;

interface SearchState {
  recent: string[];
  addRecent: (term: string) => void;
  removeRecent: (term: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: ['Atomic Habits', 'Sapiens', 'Fantasy'],
      addRecent: (term) => {
        const clean = term.trim();
        if (!clean) return;
        set(({ recent }) => ({
          recent: [
            clean,
            ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase()),
          ].slice(0, MAX_RECENT),
        }));
      },
      removeRecent: (term) =>
        set(({ recent }) => ({ recent: recent.filter((item) => item !== term) })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: STORE_KEYS.search, storage: persistStorage },
  ),
);
