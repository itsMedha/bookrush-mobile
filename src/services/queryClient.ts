import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      // The mock backend is deterministic — retrying just delays the friendly error UI.
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
