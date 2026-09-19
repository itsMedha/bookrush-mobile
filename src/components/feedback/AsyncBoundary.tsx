import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { errorMessage } from '@/services/http';

interface AsyncBoundaryProps<T> {
  query: UseQueryResult<T>;
  /** Shown on first load only — refetches keep the current data on screen. */
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
  /** Rendered instead of `children` when the data is empty. */
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  compact?: boolean;
  errorTitle?: string;
}

/**
 * One place that decides between skeleton, friendly error (with retry) and content, so every
 * data-driven section behaves identically.
 */
export function AsyncBoundary<T>({
  query,
  skeleton,
  children,
  empty,
  isEmpty,
  compact = true,
  errorTitle,
}: AsyncBoundaryProps<T>) {
  if (query.isPending) return <>{skeleton}</>;

  if (query.isError) {
    return (
      <ErrorState
        compact={compact}
        title={errorTitle}
        message={errorMessage(query.error, 'Check your connection and try again.')}
        onRetry={() => void query.refetch()}
        retrying={query.isFetching}
      />
    );
  }

  if (empty && isEmpty?.(query.data)) return <>{empty}</>;
  return <>{children(query.data)}</>;
}
