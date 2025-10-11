import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

let queryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // Cache queries for 5 minutes
          gcTime: 1000 * 60 * 30, // Keep cache for 30 minutes
          retry: 1, // Retry failed requests once
          refetchOnWindowFocus: false, // Disable refetch on window focus
          refetchOnReconnect: 'always', // Refetch on reconnect
          refetchOnMount: false, // Disable refetch on mount
        },
      },
    });

    const persister = createAsyncStoragePersister({
      storage: typeof window !== 'undefined' ? window.localStorage : null,
      key: 'REACT_QUERY_OFFLINE_CACHE', // Optional: custom key for localStorage
      throttleTime: 1000, // Optional: throttle writes to storage
    });

    if (persister) {
      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // Persist for 24 hours
      });
    }
  }
  return queryClient;
};
