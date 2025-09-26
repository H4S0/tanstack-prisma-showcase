'use client';

import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Username <ArrowUpDown />
      </Button>
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: () => <span>Email</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'createdAt',
    header: () => <span>Created At</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'action',
    header: () => <span>Actions</span>,
    cell: ({ row, table }) => {
      return (
        <DeleteUserButton
          userId={row.original.id}
          queryKey={table.options.meta?.queryKey}
        />
      );
    },
  },
];

type DeleteUserButtonProps = {
  userId: string;
  queryKey: QueryKey;
};

function DeleteUserButton({ userId, queryKey }: DeleteUserButtonProps) {
  const queryClient = useQueryClient();
  const deleteUser = usePrismaMutation(
    {
      model: 'user',
      operation: 'delete',
      args: { where: { id: userId } },
      queryKey,
    },
    {
      onSuccess: (data, variables) => {
        console.log('Deleted:', data);
        console.log('Variables:', variables);

        const allKeys = queryClient
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey);

        console.log('All query keys in cache:', allKeys);

        console.log('Mutation applied to queryKey:', deleteUser.context);
      },
    }
  );

  return (
    <Button
      variant="destructive"
      onClick={() =>
        deleteUser.mutate({
          where: { id: userId },
        })
      }
      disabled={deleteUser.isPending}
    >
      {deleteUser.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
