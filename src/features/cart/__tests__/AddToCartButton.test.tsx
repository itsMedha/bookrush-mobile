import { act, render, screen, userEvent } from '@testing-library/react-native';
import { booksById } from '@/data/books';
import { selectQuantityOf, useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import type { Book } from '@/types';
import { AddToCartButton } from '../components/AddToCartButton';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

describe('AddToCartButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useCartStore.getState().clear();
    useToastStore.getState().hide();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds the book, confirms with "Added" and a toast, then settles back', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<AddToCartButton book={book('atomic-habits')} />);

    await user.press(screen.getByRole('button', { name: /Add Atomic Habits to cart/ }));

    expect(selectQuantityOf('atomic-habits')(useCartStore.getState())).toBe(1);
    expect(screen.getByText('Added')).toBeOnTheScreen();
    expect(useToastStore.getState().toast?.message).toBe('Added to your cart');

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Add to Cart')).toBeOnTheScreen();
  });

  it('increments quantity on repeat taps', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<AddToCartButton book={book('ikigai')} />);

    const button = screen.getByRole('button', { name: /Add Ikigai to cart/ });
    await user.press(button);
    await user.press(button);

    expect(selectQuantityOf('ikigai')(useCartStore.getState())).toBe(2);
  });

  it('is disabled for out-of-stock books', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<AddToCartButton book={book('cosmos')} />);

    const button = screen.getByRole('button', { name: 'Out of stock' });
    expect(button).toBeDisabled();
    await user.press(button);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
