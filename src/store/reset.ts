import { queryClient } from '@/lib/queryClient';
import { communityService } from '@/services/communityService';
import { orderService } from '@/services/orderService';
import { useCartStore } from './cartStore';
import { useCommunityStore } from './communityStore';
import { useSearchStore } from './searchStore';
import { useUserStore } from './userStore';

/** Restores the app to its first-launch demo state (Settings → Reset demo data). */
export async function resetDemoData(): Promise<void> {
  await Promise.all([orderService.reset(), communityService.reset()]);
  useCartStore.getState().clear();
  useUserStore.getState().reset();
  useCommunityStore.getState().reset();
  useSearchStore.setState({ recent: ['Atomic Habits', 'Sapiens', 'Fantasy'] });
  queryClient.clear();
}
