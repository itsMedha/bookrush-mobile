import { act, render, screen, userEvent } from '@testing-library/react-native';
import { booksById } from '@/data/books';
import { useCartStore } from '@/stores/cartStore';
import { useToastStore } from '@/stores/toastStore';
import { mockRouter } from '@/test/routerMock';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { Book } from '@/types';
import CartScreen from '../screens/CartScreen';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCartStore.getState().clear();
    useToastStore.getState().hide();
  });

  it('shows a friendly empty state', async () => {
    const user = userEvent.setup();
    await render(<CartScreen />);

    expect(screen.getByText('No books in your cart yet.')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Browse books' }));
    expect(mockRouter.navigate).toHaveBeenCalledWith('/discover');
  });

  it('lists items and shows the order summary and total', async () => {
    useCartStore.getState().add(book('atomic-habits'));
    useCartStore.getState().add(book('ikigai'));
    await renderWithProviders(<CartScreen />);

    expect(screen.getByText('Atomic Habits')).toBeOnTheScreen();
    expect(screen.getByText('Ikigai')).toBeOnTheScreen();
    expect(screen.getByText('2 items')).toBeOnTheScreen();
    expect(screen.getByText('Delivery available')).toBeOnTheScreen();
    // 399 + 299 + ₹49 express delivery
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹747');
  });

  it('updates line and cart totals when quantity changes', async () => {
    useCartStore.getState().add(book('atomic-habits'));
    const user = userEvent.setup();
    await renderWithProviders(<CartScreen />);

    await user.press(screen.getByLabelText('Increase quantity'));

    expect(screen.getByTestId('line-total-atomic-habits')).toHaveTextContent('₹798');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('₹847');
  });

  it('removes an item with an undo toast, and undo restores it', async () => {
    useCartStore.getState().add(book('ikigai'));
    const user = userEvent.setup();
    await renderWithProviders(<CartScreen />);

    await user.press(screen.getByLabelText('Remove from cart'));
    expect(useCartStore.getState().items).toHaveLength(0);

    const toast = useToastStore.getState().toast;
    expect(toast?.message).toContain('Ikigai');
    // The undo action runs outside React's event loop, so drive it through act().
    await act(async () => {
      toast?.action?.onPress();
    });
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('goes to checkout', async () => {
    useCartStore.getState().add(book('ikigai'));
    const user = userEvent.setup();
    await renderWithProviders(<CartScreen />);

    await user.press(screen.getByRole('button', { name: 'Proceed to Checkout' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout');
  });
});
