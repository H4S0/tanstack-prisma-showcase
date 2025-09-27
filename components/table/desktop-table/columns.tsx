'use client';
import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { QueryKey } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export const columns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="w-[200px]">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue('content')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      return (
        <DeletePostButton
          postId={row.original.id}
          queryKey={table.options.meta?.queryKey}
          onSuccess={table.options.meta?.onDeleteSuccess}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
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
        onSuccess?.();
      },
    }
  );

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => deletePost.mutate({ where: { id: postId } })}
      disabled={deletePost.isPending}
    >
      {deletePost.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
