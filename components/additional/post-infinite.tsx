'use client';

import { usePrismaInfiniteQuery } from '@/app/hooks/use-prisma-query';
import { Button } from '../ui/button';

export default function PostsInfinite() {
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
    model: 'post',
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
        const posts = page?.data ?? [];
        return (
          <div key={i}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="p-4 bg-white rounded shadow mb-2">
                  <strong>{post.title}</strong> — {post.content}
                </div>
              ))
            ) : (
              <p>No posts found</p>
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
          : 'No More Posts'}
      </Button>

      {isFetching && !isFetchingNextPage && (
        <p className="text-gray-500 mt-2">Background updating…</p>
      )}
    </div>
  );
}
