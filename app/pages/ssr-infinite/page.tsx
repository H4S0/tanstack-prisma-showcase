import { prismaPrefetchInfiniteQuery } from '@/app/hooks/use-prisma-query';
import { getQueryClient } from '@/app/provider/get-query-client';
import UsersInfinite from '@/components/additional/users-infinite';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

export default async function SsrInfinitePreload() {
  const queryClient = getQueryClient();
  const PAGE_SIZE = 5;

  await prismaPrefetchInfiniteQuery(queryClient, {
    model: 'user',
    operation: 'findMany',
    args: {
      take: PAGE_SIZE,
    },
  });

  /*
  Prefetch the query on the server.
  prismaPrefetchInfiniteQuery returns the generated queryKey
  so you could inspect cached data like:
  const queryKey = await prismaPrefetchInfiniteQuery(queryClient, {
     model: 'user',
    operation: 'findMany',
    args: {
      take: PAGE_SIZE,
    },
    initialPageParam: 0,

   });
  
   console.log('Prefetched data:', queryClient.getQueryData(queryKey));
    */

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">SSR Infinite Prefetch Example</h1>
      <p className="mb-6 text-gray-600">
        Users below are prefetched on the server with{' '}
        <code>prismaPrefetchInfiniteQuery</code>
        and hydrated on the client using React Query.
      </p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersInfinite />
      </HydrationBoundary>
    </div>
  );
}
