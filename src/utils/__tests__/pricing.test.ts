import { booksById } from '@/data/books';
import type { Book, CartItem } from '@/types';
import {
  availabilityOf,
  canDeliverExpress,
  computePricing,
  deliveryBadgeFor,
  deliveryFee,
  EXPRESS_DELIVERY_FEE,
  FREE_EXPRESS_THRESHOLD,
} from '../pricing';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

const line = (id: string, quantity = 1): CartItem => ({ book: book(id), quantity });

describe('computePricing', () => {
  it('totals MRP, discount and delivery for an express order', () => {
    const items = [line('atomic-habits'), line('ikigai', 2)];
    const pricing = computePricing(items, 'express');

    expect(pricing.itemsTotal).toBe(599 + 450 * 2);
    expect(pricing.discount).toBe(599 - 399 + (450 - 299) * 2);
    expect(pricing.delivery).toBe(EXPRESS_DELIVERY_FEE);
    expect(pricing.total).toBe(399 + 299 * 2 + EXPRESS_DELIVERY_FEE);
  });

  it('makes standard delivery free', () => {
    expect(computePricing([line('ikigai')], 'standard').delivery).toBe(0);
  });

  it('waives the express fee once the basket reaches the free threshold', () => {
    expect(deliveryFee('express', FREE_EXPRESS_THRESHOLD - 1)).toBe(EXPRESS_DELIVERY_FEE);
    expect(deliveryFee('express', FREE_EXPRESS_THRESHOLD)).toBe(0);
  });

  it('charges nothing for an empty basket', () => {
    expect(computePricing([], 'express')).toEqual({
      itemsTotal: 0,
      discount: 0,
      delivery: 0,
      total: 0,
    });
  });
});

describe('express eligibility', () => {
  it('requires every book to be express-deliverable and in stock', () => {
    expect(canDeliverExpress([line('atomic-habits')])).toBe(true);
    // Dune ships standard only, Cosmos is out of stock.
    expect(canDeliverExpress([line('atomic-habits'), line('dune')])).toBe(false);
    expect(canDeliverExpress([line('cosmos')])).toBe(false);
    expect(canDeliverExpress([])).toBe(false);
  });

  it('picks the right delivery badge', () => {
    expect(deliveryBadgeFor(book('atomic-habits'))).toBe('express');
    expect(deliveryBadgeFor(book('dune'))).toBe('standard');
  });
});

describe('availabilityOf', () => {
  it('classifies stock levels', () => {
    expect(availabilityOf(book('atomic-habits'))).toBe('in-stock');
    expect(availabilityOf(book('zero-to-one'))).toBe('low-stock');
    expect(availabilityOf(book('cosmos'))).toBe('out-of-stock');
  });
});
