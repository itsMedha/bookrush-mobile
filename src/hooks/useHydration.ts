import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useSearchStore } from '@/stores/searchStore';
import { useUserStore } from '@/stores/userStore';

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
