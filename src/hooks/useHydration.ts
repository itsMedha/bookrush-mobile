import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useCommunityStore } from '@/store/communityStore';
import { useSearchStore } from '@/store/searchStore';
import { useUserStore } from '@/store/userStore';

const persistedStores = [
  useAuthStore,
  useCartStore,
  useUserStore,
  useCommunityStore,
  useSearchStore,
];

const allHydrated = () => persistedStores.every((store) => store.persist.hasHydrated());

/** True once every persisted store has been rehydrated from AsyncStorage. */
export function useStoresHydrated(): boolean {
  const [ready, setReady] = useState(allHydrated);

  useEffect(() => {
    if (ready) return;
    const check = () => {
      if (allHydrated()) setReady(true);
    };
    const unsubscribes = persistedStores.map((store) => store.persist.onFinishHydration(check));
    check();
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [ready]);

  return ready;
}
