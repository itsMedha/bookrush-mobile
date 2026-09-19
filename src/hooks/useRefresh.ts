import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

/** Pull-to-refresh wiring: invalidates the given query roots and tracks the spinner. */
export function useRefresh(roots: readonly QueryKey[]) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(roots.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, roots]);

  return { refreshing, onRefresh };
}
