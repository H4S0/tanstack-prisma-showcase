'use client';

import { usePrismaQuery } from '@/app/hooks/use-prisma-query';
import { Skeleton } from '../ui/skeleton';

export default function Users() {
  const { data, isLoading, error } = usePrismaQuery({
    model: 'user',
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
        Failed to load users: {error.message}
      </p>
    );
  }

  if (!data?.length) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((user) => (
        <li
          key={user.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <p className="font-semibold text-gray-800">{user.username}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
