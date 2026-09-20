import { createSeedOrders, FIRST_NEW_ORDER_NUMBER, type OrderRecord } from '@/data/orders';
import { defaultRider } from '@/data/users';
import type { Address, CartItem, DeliveryMethod, Order, PaymentMethodId } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { addDays, formatWeekdayDate } from '@/utils/date';
import { computePricing } from '@/utils/pricing';
import { ApiError, mockRequest } from './http';
import { readJson, removeKeys, writeJson } from './storage';

const STORAGE_KEY = 'bookrush.orders.v1';

/** Demo speed: each stage lasts this long instead of several real minutes. */
export const STAGE_DURATION_MS = 12_000;
/** Standard-shipping orders only progress on their own up to "Packed". */
const STANDARD_AUTO_LIMIT = 2;

const ETA_BY_STATUS_INDEX = [45, 38, 30, 24, 14, 0];

let cache: OrderRecord[] | null = null;

async function load(): Promise<OrderRecord[]> {
  if (cache) return cache;
  const stored = await readJson<OrderRecord[] | null>(STORAGE_KEY, null);
  cache = stored && stored.length > 0 ? stored : createSeedOrders();
  await writeJson(STORAGE_KEY, cache);
  return cache;
}

const persist = () => (cache ? writeJson(STORAGE_KEY, cache) : Promise.resolve());

const statusIndex = (record: OrderRecord) => ORDER_STATUSES.indexOf(record.status);

/** Moves the order to its next status, stamping the timeline. */
function stepForward(record: OrderRecord, at: number) {
  const next = ORDER_STATUSES[statusIndex(record) + 1];
  if (!next) return false;
  record.status = next;
  record.stageChangedAt = at;
  record.timeline[next] = new Date(at).toISOString();
  return true;
}

/** The "server clock": catches an order up to where it should be right now. */
function tick(record: OrderRecord, now: number): boolean {
  if (!record.autoAdvance) return false;
  const limit =
    record.deliveryMethod === 'instant' ? ORDER_STATUSES.length - 1 : STANDARD_AUTO_LIMIT;
  let changed = false;
  while (statusIndex(record) < limit && now - record.stageChangedAt >= STAGE_DURATION_MS) {
    stepForward(record, record.stageChangedAt + STAGE_DURATION_MS);
    changed = true;
  }
  return changed;
}

function etaMinutes(record: OrderRecord, now: number): number {
  const index = statusIndex(record);
  const current = ETA_BY_STATUS_INDEX[index] ?? 0;
  const next = ETA_BY_STATUS_INDEX[index + 1];
  if (next === undefined || !record.autoAdvance) return current;
  const progress = Math.min(0.999, Math.max(0, (now - record.stageChangedAt) / STAGE_DURATION_MS));
  return current - Math.floor(progress * (current - next));
}

function toOrder(record: OrderRecord, now: number): Order {
  const { stageChangedAt: _stage, autoAdvance: _auto, standardEta, ...rest } = record;
  const instant = record.deliveryMethod === 'instant';
  const delivered = record.status === 'DELIVERED';
  return {
    ...rest,
    etaMinutes: instant ? etaMinutes(record, now) : 0,
    estimatedDelivery: delivered
      ? 'Delivered'
      : instant
        ? 'Arriving today'
        : `Arrives by ${formatWeekdayDate(new Date(standardEta))}`,
    rider: instant && statusIndex(record) >= 3 ? defaultRider : undefined,
  };
}

const nextOrderNumber = (records: OrderRecord[]) =>
  Math.max(
    FIRST_NEW_ORDER_NUMBER - 1,
    ...records.map((record) => Number(record.number.replace('BR', '')) || 0),
  ) + 1;

export interface CreateOrderInput {
  items: CartItem[];
  address: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethodId;
}

export const orderService = {
  getOrders: () =>
    mockRequest(async () => {
      const records = await load();
      const now = Date.now();
      records.forEach((record) => tick(record, now));
      void persist();
      return [...records]
        .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
        .map((record) => toOrder(record, now));
    }),

  getOrder: (id: string) =>
    mockRequest(async () => {
      const records = await load();
      const record = records.find((candidate) => candidate.id === id);
      if (!record) throw new ApiError('We could not find that order.', 404);
      const now = Date.now();
      if (tick(record, now)) void persist();
      return toOrder(record, now);
    }),

  createOrder: (input: CreateOrderInput) =>
    mockRequest(
      async () => {
        if (input.items.length === 0) throw new ApiError('Your cart is empty.', 400);
        const records = await load();
        const now = Date.now();
        const number = `BR${nextOrderNumber(records)}`;
        const record: OrderRecord = {
          id: `order_${number.toLowerCase()}`,
          number,
          status: 'CONFIRMED',
          items: input.items.map(({ book, quantity, mode }) => ({
            bookId: book.id,
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            coverColor: book.coverColor,
            unitPrice: mode === 'rent' && book.rental ? book.rental.price : book.purchasePrice,
            quantity,
            mode,
            rentalDays: mode === 'rent' ? book.rental?.durationDays : undefined,
          })),
          address: input.address,
          deliveryMethod: input.deliveryMethod,
          paymentMethod: input.paymentMethod,
          pricing: computePricing(input.items, input.deliveryMethod),
          placedAt: new Date(now).toISOString(),
          timeline: { CONFIRMED: new Date(now).toISOString() },
          stageChangedAt: now,
          autoAdvance: true,
          standardEta: addDays(new Date(now), 3).getTime(),
        };
        records.unshift(record);
        await persist();
        return toOrder(record, now);
      },
      { latency: [900, 1300] },
    ),

  /** Demo control: push an order to its next status right now. */
  advanceOrder: (id: string) =>
    mockRequest(
      async () => {
        const records = await load();
        const record = records.find((candidate) => candidate.id === id);
        if (!record) throw new ApiError('We could not find that order.', 404);
        stepForward(record, Date.now());
        await persist();
        return toOrder(record, Date.now());
      },
      { latency: [120, 240] },
    ),

  /** Restores the seeded demo orders. */
  reset: async () => {
    cache = null;
    await removeKeys([STORAGE_KEY]);
  },

  /** Test helper: drop the in-memory copy. */
  clearCache: () => {
    cache = null;
  },
};
