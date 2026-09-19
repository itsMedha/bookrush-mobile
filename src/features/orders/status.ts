import { paymentMethods } from '@/data/users';
import type { Order, OrderStatus, PaymentMethodId } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { formatShortDate, formatTime } from '@/utils/date';

export interface StatusCopy {
  /** Short heading for the hero and timeline. */
  title: string;
  /** Supporting line in the timeline. */
  description: string;
}

export const STATUS_COPY: Record<OrderStatus, StatusCopy> = {
  CONFIRMED: { title: 'Order confirmed', description: 'We have received your order' },
  PREPARING: { title: 'Preparing your books', description: 'Picking them off the shelf' },
  PACKED: { title: 'Packed with care', description: 'Waiting for the rider to arrive' },
  PICKED_UP: { title: 'Picked up', description: 'Your rider has your order' },
  OUT_FOR_DELIVERY: { title: 'Out for delivery', description: 'On the way to your door' },
  DELIVERED: { title: 'Delivered', description: 'Enjoy your reading' },
};

export const statusIndexOf = (status: OrderStatus): number => ORDER_STATUSES.indexOf(status);

/** 0 – 1 progress through the delivery pipeline. */
export const progressOf = (status: OrderStatus): number =>
  statusIndexOf(status) / (ORDER_STATUSES.length - 1);

/** "Arriving in 24 min", "Delivered · 12 Sep", "Arrives by Wed, 23 Sep". */
export function arrivalLabel(order: Order): string {
  if (order.status === 'DELIVERED') {
    const deliveredAt = order.timeline.DELIVERED;
    return deliveredAt
      ? `Delivered on ${formatShortDate(deliveredAt)}, ${formatTime(deliveredAt)}`
      : 'Delivered';
  }
  return order.deliveryMethod === 'express'
    ? `Arriving in ${order.etaMinutes} min`
    : order.estimatedDelivery;
}

export const paymentLabel = (id: PaymentMethodId): string =>
  paymentMethods.find((method) => method.id === id)?.title ?? id;
