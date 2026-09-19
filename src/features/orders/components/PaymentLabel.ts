import { paymentMethods } from '@/data/users';
import type { PaymentMethodId } from '@/types';

export const paymentLabel = (id: PaymentMethodId): string =>
  paymentMethods.find((method) => method.id === id)?.title ?? id;
