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
        <DeletePostButton
          postId={row.original.id}
          queryKey={table.options.meta?.queryKey}
          onDeleteSuccess={table.options.meta?.onDeleteSuccess}
        />
      );
    },
  },
];

type DeletePostButtonProps = {
  postId: string;
  queryKey: QueryKey;
  onSuccess?: () => void;
};

function DeletePostButton({
  postId,
  queryKey,
  onSuccess,
}: DeletePostButtonProps) {
  const deletePost = usePrismaMutation(
    {
      model: 'post',
      operation: 'delete',
      args: { where: { id: postId } },
      queryKey,
    },
    {
      onSuccess: () => {
        onSuccess?.(); // <-- notify parent table
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
