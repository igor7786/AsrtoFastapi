// src/components/QueryProvider.tsx
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';
import { useState } from 'react';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export default function QueryProvider({ children, dehydratedState }: QueryProviderProps) {
  const client = getQueryClient();
  const [queryClient] = useState(() => client);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
