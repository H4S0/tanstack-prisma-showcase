'use client';

import { usePrismaQuery } from '@/app/hooks/use-prisma-query';
import { Skeleton } from '../ui/skeleton';

export default function Users() {
  const { data, isLoading, error } = usePrismaQuery({
    model: 'post',
    operation: 'findMany',
  });

  if (isLoading) {
    return Array.from({ length: 10 }).map((_, index) => (
      <Skeleton key={index} />
    ));
  }

  if (error) {
    return (
      <p className="text-red-500 font-medium">
        Failed to load posts: {error.message}
      </p>
    );
  }

  if (!data?.length) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((post) => (
        <li
          key={post.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <p className="font-semibold text-gray-800">{post.title}</p>
          <p className="text-gray-600 text-sm">{post.content}</p>
        </li>
      ))}
    </ul>
  );
}
