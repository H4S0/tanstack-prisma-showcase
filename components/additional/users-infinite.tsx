'use client';

import { usePrismaInfiniteQuery } from '@/app/hooks/use-prisma-query';
import { Button } from '../ui/button';

export default function UsersInfinite() {
  const PAGE_SIZE = 5;

  const {
    data: infinitedata,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = usePrismaInfiniteQuery(PAGE_SIZE, {
    model: 'user',
    operation: 'findMany',
    args: {
      take: PAGE_SIZE,
    },
  });

  if (!infinitedata?.pages.length) {
    return <p>loading</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message || 'An error occurred'}</p>;
  }

  return (
    <div className="space-y-2">
      {infinitedata.pages.map((page, i) => {
        const users = page?.data ?? [];
        return (
          <div key={i}>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="p-4 bg-white rounded shadow mb-2">
                  <strong>{user.username}</strong> — {user.email}
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        );
      })}

      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No More Users'}
      </Button>

      {isFetching && !isFetchingNextPage && (
        <p className="text-gray-500 mt-2">Background updating…</p>
      )}
    </div>
  );
}
