import type { Book, CartItem, DeliveryMethod, Pricing } from '@/types';

export const INSTANT_DELIVERY_FEE = 49;
/** Instant delivery is free above this basket value. */
export const FREE_INSTANT_THRESHOLD = 999;
export const STANDARD_ETA_LABEL = '2–4 days';

export const isInstant = (book: Book): boolean => book.delivery.type === 'INSTANT';
export const isUnavailable = (book: Book): boolean => book.delivery.type === 'UNAVAILABLE';

/** What one unit of a cart line costs — the purchase price, or the rental fee. */
export function unitPrice(item: CartItem): number {
  if (item.mode === 'rent' && item.book.rental) return item.book.rental.price;
  return item.book.purchasePrice;
}

/** The struck-through reference price. Rentals have no MRP to compare against. */
export const referencePrice = (item: CartItem): number =>
  item.mode === 'rent' ? unitPrice(item) : item.book.mrp;

export const lineTotal = (item: CartItem): number => unitPrice(item) * item.quantity;

export const deliveryFee = (method: DeliveryMethod, payableItemsTotal: number): number => {
  if (method === 'standard') return 0;
  return payableItemsTotal >= FREE_INSTANT_THRESHOLD ? 0 : INSTANT_DELIVERY_FEE;
};

export function computePricing(items: CartItem[], method: DeliveryMethod): Pricing {
  const itemsTotal = items.reduce((sum, item) => sum + referencePrice(item) * item.quantity, 0);
  const payable = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const delivery = items.length === 0 ? 0 : deliveryFee(method, payable);
  return { itemsTotal, discount: itemsTotal - payable, delivery, total: payable + delivery };
}

/** A basket ships instantly only if every title is on a nearby shelf. */
export const canDeliverInstant = (items: CartItem[]): boolean =>
  items.length > 0 && items.every(({ book }) => isInstant(book));

/** Baskets can mix fulfilment types, so the cart shows them as separate groups. */
export function splitByDelivery(items: CartItem[]): { instant: CartItem[]; standard: CartItem[] } {
  return {
    instant: items.filter(({ book }) => isInstant(book)),
    standard: items.filter(({ book }) => !isInstant(book)),
  };
}

/**
 * The slowest item decides when a basket lands, plus a short picking buffer — one rider
 * collects the whole order.
 */
export function instantEtaRange(items: CartItem[]): { min: number; max: number } | null {
  const etas = items.flatMap(({ book }) =>
    book.delivery.type === 'INSTANT' ? [book.delivery.etaMinutes] : [],
  );
  if (etas.length === 0) return null;
  const slowest = Math.max(...etas);
  return { min: slowest, max: slowest + 10 };
}

export type Availability = 'in-stock' | 'low-stock' | 'out-of-stock';

export function availabilityOf(book: Book): Availability {
  if (isUnavailable(book) || book.stock <= 0) return 'out-of-stock';
  return book.stock <= 5 ? 'low-stock' : 'in-stock';
}
