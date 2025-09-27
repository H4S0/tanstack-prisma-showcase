
# Tansma

Prisma + TanStack Query Wrapper

A lightweight utility that lets you use Prisma Client operations (findMany, findUnique, create, update, etc.) directly inside React components with TanStack Query (useQuery, useMutation) — fully type-safe.

- Features

- Type-safe queries & mutations — return types are inferred from your Prisma schema

- Simple API — call Prisma operations like usePrismaQuery / usePrismaMutation

- Stable query keys — automatically generated from model + operation + args

- Cache invalidation — mutations invalidate related queries automatically

- Extensible — add helpers like usePrismaFindMany for common patterns


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
    model: 'post',
    operation: 'findMany',
  });


  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.email}</li>
      ))}
    </ul>
  );
}
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`
`KINDE_CLIENT_ID`
`KINDE_CLIENT_SECRET`
`KINDE_ISSUER_URL`
`KINDE_SITE_URL`
`KINDE_POST_LOGOUT_REDIRECT_URL`
`KINDE_POST_LOGIN_REDIRECT_URL`

NEXTJS KINDE Docs:https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/

PRISMA ENV Docs: https://www.prisma.io/docs/orm/more/development-environment/environment-variables