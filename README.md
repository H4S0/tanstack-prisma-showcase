
# Tansma

Prisma + TanStack Query Wrapper

A lightweight utility that lets you use Prisma Client operations (findMany, findUnique, create, update, etc.) directly inside React components with TanStack Query (useQuery, useMutation) — fully type-safe.

-✨ Features

-🔒 Type-safe queries & mutations — return types are inferred from your Prisma schema

-🎯 Simple API — call Prisma operations like usePrismaQuery / usePrismaMutation

-🔑 Stable query keys — automatically generated from model + operation + args

-♻️ Cache invalidation — mutations invalidate related queries automatically

-🔧 Extensible — add helpers like usePrismaFindMany for common patterns


## Installation


```bash
  npm install @tanstack/react-query @prisma/client
  npx prisma generate
    
--Example
```javascript
import { usePrismaQuery, usePrismaFindMany } from './hooks/prisma-hooks';

export default function UsersList() {
  // Generic query
  const { data, isLoading } = usePrismaQuery({
    model: 'user',
    operation: 'findMany',
    args: { where: { role: 'ADMIN' } },
  });

  // Shortcut for findMany
  const usersQuery = usePrismaFindMany('user');

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
}
```

