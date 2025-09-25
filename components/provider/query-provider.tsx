'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { getQueryClient } from './get-query-client';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const queries = queryClient
      .getQueryCache()
      .getAll()
      .map((q) => q.queryKey);

    console.log('Active query keys:', queries);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
