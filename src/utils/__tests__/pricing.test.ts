import { booksById } from '@/data/books';
import type { AcquisitionMode, Book, CartItem } from '@/types';
import {
  availabilityOf,
  canDeliverInstant,
  computePricing,
  deliveryFee,
  FREE_INSTANT_THRESHOLD,
  INSTANT_DELIVERY_FEE,
  instantEtaRange,
  isInstant,
  lineTotal,
  splitByDelivery,
  unitPrice,
} from '../pricing';

const book = (id: string): Book => {
  const found = booksById.get(id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
};

const line = (id: string, quantity = 1, mode: AcquisitionMode = 'buy'): CartItem => ({
  book: book(id),
  quantity,
  mode,
});

describe('computePricing', () => {
  it('totals MRP, discount and delivery for an instant order', () => {
    const items = [line('atomic-habits'), line('ikigai', 2)];
    const pricing = computePricing(items, 'instant');

    expect(pricing.itemsTotal).toBe(599 + 450 * 2);
    expect(pricing.discount).toBe(599 - 399 + (450 - 299) * 2);
    expect(pricing.delivery).toBe(INSTANT_DELIVERY_FEE);
    expect(pricing.total).toBe(399 + 299 * 2 + INSTANT_DELIVERY_FEE);
  });

  it('charges the rental fee, not the purchase price, for rented lines', () => {
    const rental = book('atomic-habits').rental;
    expect(rental).toBeDefined();

    const items = [line('atomic-habits', 1, 'rent')];
    const pricing = computePricing(items, 'standard');

    expect(unitPrice(items[0]!)).toBe(rental!.price);
    // Rentals have no MRP to discount against.
    expect(pricing.discount).toBe(0);
    expect(pricing.total).toBe(rental!.price);
  });

  it('multiplies the right unit price by quantity', () => {
    expect(lineTotal(line('atomic-habits', 3))).toBe(399 * 3);
    expect(lineTotal(line('atomic-habits', 2, 'rent'))).toBe(99 * 2);
  });

  it('makes standard delivery free', () => {
    expect(computePricing([line('ikigai')], 'standard').delivery).toBe(0);
  });

  it('waives the instant fee once the basket reaches the free threshold', () => {
    expect(deliveryFee('instant', FREE_INSTANT_THRESHOLD - 1)).toBe(INSTANT_DELIVERY_FEE);
    expect(deliveryFee('instant', FREE_INSTANT_THRESHOLD)).toBe(0);
  });

  it('charges nothing for an empty basket', () => {
    expect(computePricing([], 'instant')).toEqual({
      itemsTotal: 0,
      discount: 0,
      delivery: 0,
      total: 0,
    });
  });
});

describe('instant eligibility', () => {
  it('requires every title to be stocked nearby', () => {
    expect(canDeliverInstant([line('atomic-habits')])).toBe(true);
    // Dune ships standard only; Cosmos is unavailable.
    expect(canDeliverInstant([line('atomic-habits'), line('dune')])).toBe(false);
    expect(canDeliverInstant([line('cosmos')])).toBe(false);
    expect(canDeliverInstant([])).toBe(false);
  });

  it('splits a mixed basket into fulfilment groups', () => {
    const { instant, standard } = splitByDelivery([line('atomic-habits'), line('dune')]);
    expect(instant.map((item) => item.book.id)).toEqual(['atomic-habits']);
    expect(standard.map((item) => item.book.id)).toEqual(['dune']);
  });

  it('quotes the slowest instant item plus a picking buffer', () => {
    // Atomic Habits 32 min, Ikigai 24 min.
    expect(instantEtaRange([line('atomic-habits'), line('ikigai')])).toEqual({ min: 32, max: 42 });
    expect(instantEtaRange([line('dune')])).toBeNull();
  });

  it('classifies per-title delivery', () => {
    expect(isInstant(book('atomic-habits'))).toBe(true);
    expect(isInstant(book('dune'))).toBe(false);
    expect(book('atomic-habits').delivery).toEqual({ type: 'INSTANT', etaMinutes: 32 });
    expect(book('dune').delivery).toEqual({ type: 'STANDARD', etaText: '2–4 days' });
    expect(book('cosmos').delivery).toEqual({ type: 'UNAVAILABLE' });
  });
});

describe('availabilityOf', () => {
  it('classifies stock levels', () => {
    expect(availabilityOf(book('atomic-habits'))).toBe('in-stock');
    expect(availabilityOf(book('zero-to-one'))).toBe('low-stock');
    expect(availabilityOf(book('cosmos'))).toBe('out-of-stock');
  });
});
