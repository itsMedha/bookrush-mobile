import { Badge } from '@/components/ui/Badge';
import type { Book } from '@/types';
import { availabilityOf, deliveryBadgeFor } from '@/utils/pricing';

interface DeliveryBadgeProps {
  book: Book;
}

/** Availability-aware badge: out of stock > 30 min delivery > free delivery. */
export function DeliveryBadge({ book }: DeliveryBadgeProps) {
  if (availabilityOf(book) === 'out-of-stock') return <Badge label="Out of stock" tone="danger" />;
  return deliveryBadgeFor(book) === 'express' ? (
    <Badge label="30 min delivery" tone="accent" icon="flash" />
  ) : (
    <Badge label="Free delivery" tone="sage" icon="car-outline" />
  );
}
