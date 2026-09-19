import { render, screen, userEvent } from '@testing-library/react-native';
import { booksById } from '@/data/books';
import { mockRouter } from '@/test/routerMock';
import type { Book } from '@/types';
import { BookCard } from '../BookCard';
import { DeliveryBadge } from '../DeliveryBadge';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

describe('BookCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows title, author, rating and price', async () => {
    await render(<BookCard book={book('atomic-habits')} />);

    expect(screen.getByText('Atomic Habits')).toBeOnTheScreen();
    expect(screen.getByText('James Clear')).toBeOnTheScreen();
    expect(screen.getByText('₹399')).toBeOnTheScreen();
    expect(screen.getByText('4.8')).toBeOnTheScreen();
  });

  it('opens the book detail route on press', async () => {
    const user = userEvent.setup();
    await render(<BookCard book={book('atomic-habits')} />);

    await user.press(screen.getByRole('button', { name: /Atomic Habits by James Clear/ }));
    expect(mockRouter.push).toHaveBeenCalledWith('/books/atomic-habits');
  });
});

describe('DeliveryBadge', () => {
  it('leads with speed, then free delivery, then availability', async () => {
    const { rerender } = await render(<DeliveryBadge book={book('atomic-habits')} />);
    expect(screen.getByText('30 min delivery')).toBeOnTheScreen();

    await rerender(<DeliveryBadge book={book('dune')} />);
    expect(screen.getByText('Free delivery')).toBeOnTheScreen();

    await rerender(<DeliveryBadge book={book('cosmos')} />);
    expect(screen.getByText('Out of stock')).toBeOnTheScreen();
  });
});
