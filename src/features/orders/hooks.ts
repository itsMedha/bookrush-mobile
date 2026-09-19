import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { orderService, type CreateOrderInput } from '@/services/orderService';
import type { Order } from '@/types';

export const isActiveOrder = (order: Order) => order.status !== 'DELIVERED';

const ORDER_POLL_MS = 2500;

/** All orders. Pass `poll` on screens that show live status. */
export function useOrders({ poll = false }: { poll?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: orderService.getOrders,
    staleTime: 0,
    refetchInterval: poll ? ORDER_POLL_MS : false,
  });
}

/** One order, polled like a real tracking endpoint until it is delivered. */
export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrder(id),
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data && query.state.data.status !== 'DELIVERED' ? ORDER_POLL_MS : false,
  });
}

export function useActiveOrderCount(): number {
  const { data } = useOrders();
  return data?.filter(isActiveOrder).length ?? 0;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderService.createOrder(input),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useAdvanceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.advanceOrder(id),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
