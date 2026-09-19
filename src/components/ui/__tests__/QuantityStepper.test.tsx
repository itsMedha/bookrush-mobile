import { render, screen, userEvent } from '@testing-library/react-native';
import { QuantityStepper } from '../QuantityStepper';

describe('QuantityStepper', () => {
  it('increments and decrements within bounds', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<QuantityStepper value={2} max={5} onChange={onChange} />);

    await user.press(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenLastCalledWith(3);

    await user.press(screen.getByLabelText('Decrease quantity'));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('turns the minus into a remove action at the minimum', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<QuantityStepper value={1} onChange={onChange} />);

    await user.press(screen.getByLabelText('Remove from cart'));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('disables the plus button at the maximum', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<QuantityStepper value={3} max={3} onChange={onChange} />);

    const plus = screen.getByLabelText('Increase quantity');
    expect(plus).toBeDisabled();
    await user.press(plus);
    expect(onChange).not.toHaveBeenCalled();
  });
});
