import { screen, userEvent } from '@testing-library/react-native';
import { booksById } from '@/data/books';
import { posts } from '@/data/posts';
import { usersById } from '@/data/users';
import { useCommunityStore } from '@/stores/communityStore';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { Book, FeedPost } from '@/types';
import { PostCard } from '../components/PostCard';

const seed = posts[0];
const author = usersById.get('aanya');
const midnight = booksById.get('midnight-library');
if (!seed || !author || !midnight) throw new Error('missing fixtures');

const feedPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  ...seed,
  author,
  books: [midnight] as Book[],
  ...overrides,
});

describe('PostCard', () => {
  beforeEach(() => useCommunityStore.getState().reset());

  it('renders the author, text, referenced book and engagement counts', async () => {
    await renderWithProviders(<PostCard post={feedPost()} />);

    expect(screen.getByText('Aanya Kapoor')).toBeOnTheScreen();
    expect(screen.getByText(/Just finished The Midnight Library/)).toBeOnTheScreen();
    expect(screen.getByText('The Midnight Library')).toBeOnTheScreen();
    expect(screen.getByText('248')).toBeOnTheScreen();
    expect(screen.getByText('34')).toBeOnTheScreen();
  });

  it('likes and unlikes, adjusting the count and persisted state', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PostCard post={feedPost()} />);

    await user.press(screen.getByRole('button', { name: /Like, 248 likes/ }));
    expect(screen.getByText('249')).toBeOnTheScreen();
    expect(useCommunityStore.getState().likedPostIds).toContain(seed.id);

    await user.press(screen.getByRole('button', { name: /Unlike, 249 likes/ }));
    expect(screen.getByText('248')).toBeOnTheScreen();
    expect(useCommunityStore.getState().likedPostIds).not.toContain(seed.id);
  });

  it('toggles save', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PostCard post={feedPost()} />);

    await user.press(screen.getByRole('button', { name: 'Save post' }));
    expect(useCommunityStore.getState().savedPostIds).toContain(seed.id);
    expect(screen.getByRole('button', { name: 'Remove from saved' })).toBeOnTheScreen();
  });

  it('lets you follow an author you do not follow yet', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PostCard post={feedPost({ authorId: 'priya' })} />);

    await user.press(screen.getByRole('button', { name: /Follow Aanya Kapoor/ }));
    expect(useCommunityStore.getState().followingIds).toContain('priya');
  });
});
