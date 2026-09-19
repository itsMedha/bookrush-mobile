import type { Book, CartItem, DeliveryMethod, Pricing } from '@/types';

export const EXPRESS_DELIVERY_FEE = 49;
/** Express delivery is free above this basket value. */
export const FREE_EXPRESS_THRESHOLD = 999;
export const EXPRESS_ETA_LABEL = '30–60 min';
export const STANDARD_ETA_LABEL = '2–4 days';

export const deliveryFee = (method: DeliveryMethod, payableItemsTotal: number): number => {
  if (method === 'standard') return 0;
  return payableItemsTotal >= FREE_EXPRESS_THRESHOLD ? 0 : EXPRESS_DELIVERY_FEE;
};

export function computePricing(items: CartItem[], method: DeliveryMethod): Pricing {
  const itemsTotal = items.reduce((sum, { book, quantity }) => sum + book.mrp * quantity, 0);
  const payable = items.reduce((sum, { book, quantity }) => sum + book.price * quantity, 0);
  const discount = itemsTotal - payable;
  const delivery = items.length === 0 ? 0 : deliveryFee(method, payable);
  return { itemsTotal, discount, delivery, total: payable + delivery };
}

export const canDeliverExpress = (items: CartItem[]): boolean =>
  items.length > 0 && items.every(({ book }) => book.expressDelivery && book.stock > 0);

export type Availability = 'in-stock' | 'low-stock' | 'out-of-stock';

export function availabilityOf(book: Book): Availability {
  if (book.stock <= 0) return 'out-of-stock';
  return book.stock <= 5 ? 'low-stock' : 'in-stock';
}

/** Cards lead with speed when available; otherwise standard delivery is always free. */
export type DeliveryBadgeKind = 'express' | 'standard';

export function deliveryBadgeFor(book: Book): DeliveryBadgeKind {
  return book.expressDelivery && book.stock > 0 ? 'express' : 'standard';
}
