'use client';

import { usePrismaSuspenseInfiniteQuery } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';

export default function SuspenseInfinite() {
  const PAGE_SIZE = 5;

  /* Usage of query options with prisma suspense infinite query: 
  const queryOpts = prismaQueryOptions({ model: 'post', operation: 'findMany', args: { take: PAGE_SIZE, }}); 
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
    model: 'post',
    operation: 'findMany',
    args: {
      take: PAGE_SIZE,
    },
  });

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Infinite Posts (Suspense)</h1>
      <p className="mb-6 text-gray-600">
        This list is powered by <code>usePrismaSuspenseInfiniteQuery</code>.
        Posts are fetched in pages and you can load more with the button below.
      </p>

      <div className="space-y-2">
        {data.pages.map((page, i) => {
          const posts = page?.data ?? [];
          return (
            <div key={i}>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white rounded shadow mb-2"
                  >
                    <strong>{post.title}</strong> — {post.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No posts found</p>
              )}
            </div>
          );
        })}

        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more posts...'
            : hasNextPage
            ? 'Load More posts'
            : 'No More posts'}
        </Button>

        {isFetching && !isFetchingNextPage && (
          <p className="text-gray-500 mt-2">Refreshing in the background…</p>
        )}
      </div>
    </div>
  );
}
