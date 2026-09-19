import { screen, userEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@/stores/authStore';
import { useDevStore } from '@/stores/devStore';
import { renderWithProviders } from '@/test/renderWithProviders';
import LoginScreen from '../screens/LoginScreen';

describe('LoginScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null });
    useDevStore.getState().setSimulateOffline(false);
  });

  it('validates the email and password before submitting', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LoginScreen />);

    await user.clear(screen.getByTestId('login-email'));
    await user.type(screen.getByTestId('login-email'), 'not-an-email');
    await user.clear(screen.getByTestId('login-password'));
    await user.type(screen.getByTestId('login-password'), '123');
    await user.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByText('Password must be at least 6 characters')).toBeOnTheScreen();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('signs in with valid credentials', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LoginScreen />);

    // Demo credentials are pre-filled, so submitting straight away should succeed.
    await user.press(screen.getByTestId('login-submit'));

    await waitFor(() => expect(useAuthStore.getState().session).not.toBeNull());
    expect(useAuthStore.getState().session?.email).toBe('reader@bookrush.app');
  });

  it('surfaces a friendly error when the network is down', async () => {
    useDevStore.getState().setSimulateOffline(true);
    const user = userEvent.setup();
    await renderWithProviders(<LoginScreen />);

    await user.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Network request failed')).toBeOnTheScreen();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('offers Apple and Google sign-in', async () => {
    await renderWithProviders(<LoginScreen />);

    expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Forgot password' })).toBeOnTheScreen();
  });
});
