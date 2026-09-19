import type { CartItem, DeliveryMethod, Order, OrderStatus, PaymentMethodId } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { computePricing } from '@/utils/pricing';
import { booksById } from './books';
import { seedAddresses } from './users';

/** What the mock "server" stores. `Order` is the derived view returned to the app. */
export interface OrderRecord extends Omit<
  Order,
  'etaMinutes' | 'estimatedDelivery' | 'rider' | 'status'
> {
  status: OrderStatus;
  /** Epoch ms when the current status began. */
  stageChangedAt: number;
  /** Express orders progress on their own; the seeded showcase order waits for the demo control. */
  autoAdvance: boolean;
  /** Epoch ms of the promised delivery time for standard shipping. */
  standardEta: number;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const line = (bookId: string, quantity = 1): CartItem => {
  const book = booksById.get(bookId);
  if (!book) throw new Error(`Unknown book in seed data: ${bookId}`);
  return { book, quantity };
};

/** Minutes after `placedAt` at which each status was reached. */
const EXPRESS_OFFSETS = [0, 3, 9, 15, 22, 31];

function timelineFrom(placedAt: number, statusCount: number, offsets: number[] = EXPRESS_OFFSETS) {
  const timeline: Order['timeline'] = {};
  ORDER_STATUSES.slice(0, statusCount).forEach((status, index) => {
    timeline[status] = new Date(placedAt + (offsets[index] ?? 0) * MINUTE).toISOString();
  });
  return timeline;
}

interface SeedInput {
  number: string;
  lines: CartItem[];
  method: DeliveryMethod;
  payment: PaymentMethodId;
  placedAt: number;
  statusIndex: number;
  autoAdvance?: boolean;
}

function buildRecord(input: SeedInput): OrderRecord {
  const status = ORDER_STATUSES[input.statusIndex] ?? 'CONFIRMED';
  const offsets =
    input.method === 'express' ? EXPRESS_OFFSETS : [0, 240, 1_200, 2_880, 3_400, 4_300];
  const address = seedAddresses[0];
  if (!address) throw new Error('Seed addresses missing');

  return {
    id: `order_${input.number.toLowerCase()}`,
    number: input.number,
    status,
    items: input.lines.map(({ book, quantity }) => ({
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      coverColor: book.coverColor,
      price: book.price,
      quantity,
    })),
    address,
    deliveryMethod: input.method,
    paymentMethod: input.payment,
    pricing: computePricing(input.lines, input.method),
    placedAt: new Date(input.placedAt).toISOString(),
    timeline: timelineFrom(input.placedAt, input.statusIndex + 1, offsets),
    stageChangedAt: input.placedAt + (offsets[input.statusIndex] ?? 0) * MINUTE,
    autoAdvance: input.autoAdvance ?? false,
    standardEta: input.placedAt + 3 * DAY,
  };
}

/** One live order plus a short history so every Orders state is visible on first launch. */
export function createSeedOrders(now: number = Date.now()): OrderRecord[] {
  return [
    buildRecord({
      number: 'BR1024',
      lines: [line('atomic-habits'), line('psychology-of-money')],
      method: 'express',
      payment: 'upi',
      placedAt: now - 31 * MINUTE,
      statusIndex: 4,
    }),
    buildRecord({
      number: 'BR1019',
      lines: [line('midnight-library'), line('deep-work'), line('ikigai')],
      method: 'express',
      payment: 'card',
      placedAt: now - 3 * DAY,
      statusIndex: 5,
    }),
    buildRecord({
      number: 'BR1012',
      lines: [line('sapiens'), line('the-hobbit')],
      method: 'standard',
      payment: 'cod',
      placedAt: now - 16 * DAY,
      statusIndex: 5,
    }),
    buildRecord({
      number: 'BR1003',
      lines: [line('clean-code')],
      method: 'standard',
      payment: 'card',
      placedAt: now - 41 * DAY,
      statusIndex: 5,
    }),
  ];
}

export const FIRST_NEW_ORDER_NUMBER = 1025;
