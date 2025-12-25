import React, { PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Single shared QueryClient instance (Composition Root for server state)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}





