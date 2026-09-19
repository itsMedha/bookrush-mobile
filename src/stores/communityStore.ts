import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialFollowingIds } from '@/data/users';
import { persistStorage, STORE_KEYS } from './persist';

interface CommunityState {
  likedPostIds: string[];
  savedPostIds: string[];
  followingIds: string[];
  joinedClubIds: string[];
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleFollow: (userId: string) => void;
  toggleClub: (clubId: string) => void;
  reset: () => void;
}

const flip = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

const initialState = () => ({
  likedPostIds: [] as string[],
  savedPostIds: [] as string[],
  followingIds: initialFollowingIds,
  joinedClubIds: ['weekend-readers'],
});

/**
 * Only the viewer's relationships live here (likes, saves, follows, memberships).
 * The posts and clubs themselves are server state owned by TanStack Query.
 */
export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      ...initialState(),
      toggleLike: (postId) =>
        set(({ likedPostIds }) => ({ likedPostIds: flip(likedPostIds, postId) })),
      toggleSave: (postId) =>
        set(({ savedPostIds }) => ({ savedPostIds: flip(savedPostIds, postId) })),
      toggleFollow: (userId) =>
        set(({ followingIds }) => ({ followingIds: flip(followingIds, userId) })),
      toggleClub: (clubId) =>
        set(({ joinedClubIds }) => ({ joinedClubIds: flip(joinedClubIds, clubId) })),
      reset: () => set(initialState()),
    }),
    { name: STORE_KEYS.community, storage: persistStorage },
  ),
);
