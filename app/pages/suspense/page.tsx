'use client';

import React, { Suspense } from 'react';
import { usePrismaSuspenseQuery } from '@/app/hooks/use-prisma-query';

function UsersList() {
  const { data } = usePrismaSuspenseQuery({
    model: 'user',
    operation: 'findMany',
  });

  if (!data?.length) {
    return <p className="text-gray-600 italic">No users found</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((user) => (
        <li
          key={user.id}
          className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
        >
          <p className="font-semibold text-gray-800">{user.username}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Users</h1>
        <p className="text-gray-600 mb-6">Those are suspensed users</p>
        <div className="border-t border-gray-200 mb-6" />

        <Suspense
          fallback={
            <p className="text-gray-500 animate-pulse">Loading users...</p>
          }
        >
          <UsersList />
        </Suspense>
      </div>
    </div>
  );
}
