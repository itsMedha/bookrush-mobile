import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { communityService, type CreatePostInput } from '@/services/communityService';
import { useCommunityStore } from '@/stores/communityStore';
import type { FeedPost, FeedTab } from '@/types';

export function useFeed(tab: FeedTab) {
  const followingIds = useCommunityStore((state) => state.followingIds);
  // The "following" feed depends on who you follow, so that list is part of its cache key.
  const followingKey = tab === 'following' ? followingIds.join(',') : '';

  return useQuery({
    queryKey: queryKeys.community.posts(tab, followingKey),
    queryFn: () => communityService.getPosts({ tab, followingIds }),
  });
}

export function usePostsByAuthor(authorId: string) {
  return useQuery({
    queryKey: queryKeys.community.byAuthor(authorId),
    queryFn: () => communityService.getPostsByAuthor(authorId),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => communityService.createPost(input),
    onSuccess: (post) => {
      // The new post appears at the top of the chronological feeds instantly. "Trending" is
      // ranked by engagement, so it is only marked stale and refetches next time it is shown.
      queryClient.setQueriesData<FeedPost[]>(
        {
          queryKey: queryKeys.community.postsRoot,
          predicate: (query) => query.queryKey[2] !== 'trending',
        },
        (posts) => (posts ? [post, ...posts] : posts),
      );
      queryClient.setQueryData<FeedPost[]>(queryKeys.community.byAuthor(post.authorId), (posts) =>
        posts ? [post, ...posts] : posts,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.community.postsRoot,
        refetchType: 'none',
      });
    },
  });
}

export function useComments(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.community.comments(postId),
    queryFn: () => communityService.getComments(postId),
    enabled,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => communityService.addComment({ postId, body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(postId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.community.postsRoot });
    },
  });
}

export function useClubs() {
  return useQuery({ queryKey: queryKeys.community.clubs, queryFn: communityService.getClubs });
}

export function useClub(id: string) {
  return useQuery({
    queryKey: queryKeys.community.club(id),
    queryFn: () => communityService.getClub(id),
  });
}
