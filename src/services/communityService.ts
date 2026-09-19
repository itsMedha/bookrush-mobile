import { books, booksById } from '@/data/books';
import { clubs } from '@/data/clubs';
import { commentsSeed, posts as seedPosts } from '@/data/posts';
import { CURRENT_USER_ID, usersById } from '@/data/users';
import type {
  Book,
  ClubDetail,
  ClubSummary,
  CommentWithAuthor,
  FeedPost,
  FeedTab,
  Post,
  PostComment,
  PostKind,
  User,
} from '@/types';
import { createId } from '@/utils/id';
import { ApiError, mockRequest } from './http';
import { readJson, removeKeys, writeJson } from './storage';

const USER_POSTS_KEY = 'bookrush.userPosts.v1';

let userPosts: Post[] | null = null;
const commentsByPost = new Map<string, PostComment[]>();
const commentBumps = new Map<string, number>();

async function loadUserPosts(): Promise<Post[]> {
  if (!userPosts) userPosts = await readJson<Post[]>(USER_POSTS_KEY, []);
  return userPosts;
}

const userOf = (id: string): User => {
  const user = usersById.get(id);
  if (!user) throw new ApiError(`Unknown user ${id}`, 404);
  return user;
};

const hydrate = (post: Post): FeedPost => ({
  ...post,
  commentCount: post.commentCount + (commentBumps.get(post.id) ?? 0),
  author: userOf(post.authorId),
  books: post.bookIds.map((id) => booksById.get(id)).filter((b): b is Book => b !== undefined),
});

const engagement = (post: Post) => post.likeCount + post.commentCount * 2;

export interface CreatePostInput {
  body: string;
  bookIds: string[];
  imageUrl?: string;
}

function kindFor({ bookIds, imageUrl }: CreatePostInput): PostKind {
  if (imageUrl) return 'photo';
  if (bookIds.length > 1) return 'list';
  return bookIds.length === 1 ? 'review' : 'thought';
}

export const communityService = {
  getPosts: ({ tab, followingIds }: { tab: FeedTab; followingIds: string[] }) =>
    mockRequest(async () => {
      const mine = await loadUserPosts();
      const all = [...mine, ...seedPosts];
      let feed: Post[];
      if (tab === 'following') {
        const allowed = new Set([...followingIds, CURRENT_USER_ID]);
        feed = all.filter((post) => allowed.has(post.authorId));
      } else if (tab === 'trending') {
        feed = [...all].sort((a, b) => engagement(b) - engagement(a)).slice(0, 8);
      } else {
        feed = all;
      }
      return feed.map(hydrate);
    }),

  getPostsByAuthor: (authorId: string) =>
    mockRequest(async () => {
      const mine = await loadUserPosts();
      return [...mine, ...seedPosts].filter((post) => post.authorId === authorId).map(hydrate);
    }),

  createPost: (input: CreatePostInput) =>
    mockRequest(
      async () => {
        const body = input.body.trim();
        if (!body) throw new ApiError('Write something to share with readers.', 400);
        const mine = await loadUserPosts();
        const post: Post = {
          id: createId('post'),
          authorId: CURRENT_USER_ID,
          kind: kindFor(input),
          body,
          createdAt: new Date().toISOString(),
          bookIds: input.bookIds,
          imageUrl: input.imageUrl,
          likeCount: 0,
          commentCount: 0,
        };
        mine.unshift(post);
        await writeJson(USER_POSTS_KEY, mine);
        return hydrate(post);
      },
      { latency: [500, 800] },
    ),

  getComments: (postId: string) =>
    mockRequest<CommentWithAuthor[]>(() => {
      const seeded = commentsSeed.filter((comment) => comment.postId === postId);
      const added = commentsByPost.get(postId) ?? [];
      return [...seeded, ...added].map((comment) => ({
        ...comment,
        author: userOf(comment.authorId),
      }));
    }),

  addComment: ({ postId, body }: { postId: string; body: string }) =>
    mockRequest<CommentWithAuthor>(
      () => {
        const text = body.trim();
        if (!text) throw new ApiError('Comment cannot be empty.', 400);
        const comment: PostComment = {
          id: createId('comment'),
          postId,
          authorId: CURRENT_USER_ID,
          body: text,
          createdAt: new Date().toISOString(),
        };
        commentsByPost.set(postId, [...(commentsByPost.get(postId) ?? []), comment]);
        commentBumps.set(postId, (commentBumps.get(postId) ?? 0) + 1);
        return { ...comment, author: userOf(CURRENT_USER_ID) };
      },
      { latency: [200, 400] },
    ),

  getClubs: () =>
    mockRequest<ClubSummary[]>(() => clubs.map(({ discussion: _discussion, ...club }) => club)),

  getClub: (id: string) =>
    mockRequest<ClubDetail>(() => {
      const club = clubs.find((candidate) => candidate.id === id);
      if (!club) throw new ApiError('This club could not be found.', 404);
      const currentBook = booksById.get(club.currentBookId) ?? books[0];
      if (!currentBook) throw new ApiError('Club book missing.', 500);
      return {
        ...club,
        currentBook,
        members: club.memberIds.map(userOf),
        discussion: club.discussion.map((message) => ({
          ...message,
          author: userOf(message.authorId),
        })),
      };
    }),

  reset: async () => {
    userPosts = null;
    commentsByPost.clear();
    commentBumps.clear();
    await removeKeys([USER_POSTS_KEY]);
  },
};
