import type { Order } from '@/types';
import { arrivalLabel, progressOf, statusIndexOf, STATUS_COPY } from '../status';

const baseOrder = {
  id: 'o1',
  number: 'BR1',
  items: [],
  deliveryMethod: 'instant',
  timeline: {},
  etaMinutes: 24,
  estimatedDelivery: 'Arriving today',
} as unknown as Order;

describe('order status helpers', () => {
  it('maps statuses onto a 0–1 progress value', () => {
    expect(progressOf('CONFIRMED')).toBe(0);
    expect(progressOf('PACKED')).toBeCloseTo(0.4);
    expect(progressOf('DELIVERED')).toBe(1);
    expect(statusIndexOf('OUT_FOR_DELIVERY')).toBe(4);
  });

  it('has copy for every status', () => {
    expect(Object.keys(STATUS_COPY)).toHaveLength(6);
  });

  it('describes arrival for express, standard and delivered orders', () => {
    expect(arrivalLabel({ ...baseOrder, status: 'OUT_FOR_DELIVERY' })).toBe('Arriving in 24 min');
    expect(
      arrivalLabel({
        ...baseOrder,
        status: 'PACKED',
        deliveryMethod: 'standard',
        estimatedDelivery: 'Arrives by Wed, 23 Sep',
      }),
    ).toBe('Arrives by Wed, 23 Sep');
    expect(arrivalLabel({ ...baseOrder, status: 'DELIVERED' })).toBe('Delivered');
  });
});
