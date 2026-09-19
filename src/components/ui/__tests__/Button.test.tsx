import { render, screen, userEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its label and fires onPress', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button label="Proceed to Checkout" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Proceed to Checkout' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire while disabled and reports the disabled state', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button label="Place Order" disabled onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Place Order' });
    await user.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('shows a busy state instead of the label while loading', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button label="Log in" loading onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Log in' });
    expect(screen.queryByText('Log in')).toBeNull();
    expect(button).toBeBusy();

    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
