import { prismaPrefetchQuery } from '@/app/hooks/use-prisma-query';
import { getQueryClient } from '@/components/provider/get-query-client';
import Users from '@/components/additional/posts';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function SsrFetching() {
  const queryClient = getQueryClient();

  /*
  Prefetch the query on the server.
  prismaPrefetchQuery returns the generated queryKey
  so you could inspect cached data like:
  const queryKey = await prismaPrefetchQuery(queryClient, {
    model: 'post', 
    operation: 'findMany' 
   });
  
   console.log('Prefetched data:', queryClient.getQueryData(queryKey));
    */

  await prismaPrefetchQuery(queryClient, {
    model: 'post',
    operation: 'findMany',
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          SSR Prefetch Example
        </h1>
        <p className="mb-6 text-gray-600">
          The posts below are fetched{' '}
          <span className="font-semibold">on the server</span> using{' '}
          <code>prismaPrefetchQuery</code> and then hydrated on the client with
          React Query.
        </p>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Users />
        </HydrationBoundary>
      </div>
    </div>
  );
}
