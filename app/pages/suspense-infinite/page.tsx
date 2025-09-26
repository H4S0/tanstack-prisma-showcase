'use client';

import { usePrismaSuspenseInfiniteQuery } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';

export default function SuspenseInfinite() {
  const PAGE_SIZE = 5;

  /* Usage of query options with prisma suspense infinite query: 
  const queryOpts = prismaQueryOptions({ model: 'user', operation: 'findMany', args: { take: PAGE_SIZE, }}); 
  const { data, 
  queryKey, 
  fetchNextPage, 
  hasNextPage, 
  isFetchingNextPage, 
  isFetching, } = usePrismaSuspenseInfiniteQuery(PAGE_SIZE, queryOpts); */

  const {
    data,
    queryKey,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePrismaSuspenseInfiniteQuery(PAGE_SIZE, {
    model: 'user',
    operation: 'findMany',
    args: {
      take: PAGE_SIZE,
    },
  });

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Infinite Users (Suspense)</h1>
      <p className="mb-6 text-gray-600">
        This list is powered by <code>usePrismaSuspenseInfiniteQuery</code>.
        Users are fetched in pages and you can load more with the button below.
      </p>

      <div className="space-y-2">
        {data.pages.map((page, i) => {
          const users = page?.data ?? [];
          return (
            <div key={i}>
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded shadow mb-2"
                  >
                    <strong>{user.firstName}</strong> — {user.email}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No users found</p>
              )}
            </div>
          );
        })}

        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more users...'
            : hasNextPage
            ? 'Load More Users'
            : 'No More Users'}
        </Button>

        {isFetching && !isFetchingNextPage && (
          <p className="text-gray-500 mt-2">Refreshing in the background…</p>
        )}
      </div>
    </div>
  );
}
