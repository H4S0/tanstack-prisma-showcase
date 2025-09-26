'use client';
import React, { useState } from 'react';
import { usePrismaQuery } from '@/app/hooks/use-prisma-query';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = usePrismaQuery({
    model: 'user',
    operation: 'findMany',
    args: searchTerm
      ? {
          where: {
            OR: [{ firstName: { search: searchTerm } }],
          },
        }
      : undefined,
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">
      <h1 className="text-xl font-semibold">Search</h1>
      <Input
        type="text"
        placeholder="Type first name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-2 py-1 mb-4 w-full max-w-sm"
      />

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
          {data.map((user) => (
            <li
              key={user.id}
              className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-800">{user.firstName}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p className="text-gray-600">No users yet</p>
      )}
    </div>
  );
}
