'use client';

import React from 'react';
import { usePrismaQuery } from './hooks/use-prisma-query';
import { Skeleton } from '@/components/ui/skeleton';
import CreatePostForm from '@/components/form/create-post-form';

export default function Home() {
  /*
    Usage of query options:
    const queryOpts = prismaQueryOptions({
    model: 'post',
    operation: 'findMany',
  });

  const { data, queryKey, isLoading } = usePrismaQuery(queryOpts);

  const queryOptscreate = prismaQueryOptions({
    model: 'post',
    operation: 'create',
    queryKey: queryKey,
  });

  const createPost = usePrismaMutation(queryOptscreate, {
    onSuccess: () => {
      console.log('✅ Post created!');
    },
  });
  */

  const { data, queryKey, isLoading } = usePrismaQuery({
    model: 'post',
    operation: 'findMany',
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-gray-800 text-lg">Posts</h1>
          <CreatePostForm queryKey={queryKey} />
        </div>

        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="p-4 mb-3 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}

        {data?.length ? (
          <ul className="space-y-3">
            {data.map((post) => (
              <li
                key={post.id}
                className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">{post.title}</p>
                <p className="text-gray-600 text-sm">{post.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="text-gray-600">No posts yet</p>
        )}
      </div>
    </div>
  );
}
