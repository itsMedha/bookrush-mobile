import { render, screen, userEvent } from '@testing-library/react-native';
import { booksById } from '@/data/books';
import { mockRouter } from '@/test/routerMock';
import type { Book } from '@/types';
import { BookCard } from '../BookCard';
import { DeliveryAvailability } from '../DeliveryAvailability';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

describe('BookCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows title, author, rating, price and delivery speed', async () => {
    await render(<BookCard book={book('atomic-habits')} />);

    expect(screen.getByText('Atomic Habits')).toBeOnTheScreen();
    expect(screen.getByText('James Clear')).toBeOnTheScreen();
    expect(screen.getByText('₹399')).toBeOnTheScreen();
    expect(screen.getByText('4.8')).toBeOnTheScreen();
    expect(screen.getByText('32 min')).toBeOnTheScreen();
  });

  it('opens the book detail route on press', async () => {
    const user = userEvent.setup();
    await render(<BookCard book={book('atomic-habits')} />);

    await user.press(screen.getByRole('button', { name: /Atomic Habits by James Clear/ }));
    expect(mockRouter.push).toHaveBeenCalledWith('/books/atomic-habits');
  });
});

describe('DeliveryAvailability', () => {
  it('renders the per-title ETA for instant books', async () => {
    await render(<DeliveryAvailability delivery={book('atomic-habits').delivery} />);
    expect(screen.getByText('32 min')).toBeOnTheScreen();
    expect(screen.getByLabelText('Instant delivery in 32 min')).toBeOnTheScreen();
  });

  it('falls back to a shipping window when no nearby store has it', async () => {
    await render(<DeliveryAvailability delivery={book('dune').delivery} />);
    expect(screen.getByText('2–4 days')).toBeOnTheScreen();
  });

  it('marks out-of-stock titles unavailable', async () => {
    await render(<DeliveryAvailability delivery={book('cosmos').delivery} />);
    expect(screen.getByText('Unavailable')).toBeOnTheScreen();
  });
});
