'use client';

import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title <ArrowUpDown />
      </Button>
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'content',
    header: () => <span>Content</span>,
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
          postId={row.original.id}
          queryKey={table.options.meta?.queryKey}
        />
      );
    },
  },
];

type DeletePostButtonProps = {
  postId: string;
  queryKey: QueryKey;
};

function DeleteUserButton({ postId, queryKey }: DeletePostButtonProps) {
  const queryClient = useQueryClient();
  const deletePost = usePrismaMutation(
    {
      model: 'post',
      operation: 'delete',
      args: { where: { id: postId } },
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

        console.log('Mutation applied to queryKey:', deletePost.context);
      },
    }
  );

  return (
    <Button
      variant="destructive"
      onClick={() =>
        deletePost.mutate({
          where: { id: postId },
        })
      }
      disabled={deletePost.isPending}
    >
      {deletePost.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
