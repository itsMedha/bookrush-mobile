import { booksById } from '@/data/books';
import { seedAddresses } from '@/data/users';
import type { Book, CartItem } from '@/types';
import { orderService, STAGE_DURATION_MS } from '../orderService';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

const address = seedAddresses[0];
if (!address) throw new Error('missing address fixture');

const items: CartItem[] = [{ book: book('atomic-habits'), quantity: 1, mode: 'buy' }];

describe('orderService', () => {
  beforeEach(async () => {
    await orderService.reset();
  });

  it('seeds one live order plus delivered history', async () => {
    const orders = await orderService.getOrders();
    expect(orders.filter((order) => order.status !== 'DELIVERED')).toHaveLength(1);
    expect(orders.filter((order) => order.status === 'DELIVERED').length).toBeGreaterThanOrEqual(3);
  });

  it('creates a confirmed order with server-side pricing and the next number', async () => {
    const order = await orderService.createOrder({
      items,
      address,
      deliveryMethod: 'instant',
      paymentMethod: 'upi',
    });

    expect(order.number).toBe('BR1025');
    expect(order.status).toBe('CONFIRMED');
    expect(order.pricing.total).toBe(399 + 49);
    expect(order.timeline.CONFIRMED).toBeDefined();
    expect(order.rider).toBeUndefined();
  });

  it('rejects an empty order', async () => {
    await expect(
      orderService.createOrder({
        items: [],
        address,
        deliveryMethod: 'instant',
        paymentMethod: 'cod',
      }),
    ).rejects.toThrow('Your cart is empty.');
  });

  it('progresses express orders on the server clock and assigns a rider at pick-up', async () => {
    const created = await orderService.createOrder({
      items,
      address,
      deliveryMethod: 'instant',
      paymentMethod: 'card',
    });

    const start = Date.now();
    const nowSpy = jest.spyOn(Date, 'now');

    nowSpy.mockReturnValue(start + STAGE_DURATION_MS * 3 + 10);
    const midway = await orderService.getOrder(created.id);
    expect(midway.status).toBe('PICKED_UP');
    expect(midway.rider?.name).toBeTruthy();

    nowSpy.mockReturnValue(start + STAGE_DURATION_MS * 20);
    const done = await orderService.getOrder(created.id);
    expect(done.status).toBe('DELIVERED');
    expect(done.etaMinutes).toBe(0);

    nowSpy.mockRestore();
  });

  it('holds standard-shipping orders at "packed" until advanced manually', async () => {
    const created = await orderService.createOrder({
      items,
      address,
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
    });

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(Date.now() + STAGE_DURATION_MS * 20);
    const held = await orderService.getOrder(created.id);
    expect(held.status).toBe('PACKED');
    nowSpy.mockRestore();

    const advanced = await orderService.advanceOrder(created.id);
    expect(advanced.status).toBe('PICKED_UP');
  });

  it('does not auto-advance the seeded showcase order', async () => {
    const before = (await orderService.getOrders()).find((order) => order.number === 'BR1024');
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(Date.now() + STAGE_DURATION_MS * 50);
    const after = (await orderService.getOrders()).find((order) => order.number === 'BR1024');
    nowSpy.mockRestore();

    expect(after?.status).toBe(before?.status);
  });
});
