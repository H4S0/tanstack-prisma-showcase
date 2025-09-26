'use client';
import React, { useState } from 'react';
import { usePrismaQuery } from '@/app/hooks/use-prisma-query';
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Update the query whenever searchTerm changes
  const { data, queryKey } = usePrismaQuery({
    model: 'user',
    operation: 'findMany',
    args: {
      where: searchTerm
        ? {
            OR: [
              { firstName: { search: searchTerm } },
              { lastName: { search: searchTerm } },
            ],
          }
        : undefined, // no filtering if empty
    },
  });

  return (
    <div>
      <h1>User Search</h1>

      <Input
        type="text"
        placeholder="Type first or last name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-2 py-1 mb-4"
      />

      <div>
        {data?.length ? (
          <ul>
            {data.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName} — {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>

      <pre>Query key: {JSON.stringify(queryKey, null, 2)}</pre>
    </div>
  );
}
