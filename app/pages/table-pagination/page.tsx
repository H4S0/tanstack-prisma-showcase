'use client';

import { columns } from '@/components/table/desktop-table/columns';
import { DataTable } from '@/components/table/desktop-table/data-table';
import { usePrimaPaginatedQuery } from '../../hooks/use-prisma-query';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DebouncedInput } from '@/components/ui/debounced-input';
import CreatePostForm from '@/components/form/create-post-form';

export default function DemoPage() {
  const [globalSearch, setGlobalSearch] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
    queryKey,
  } = usePrimaPaginatedQuery({
    model: 'post',
    operation: 'findMany',
    page,
    pageSize,
  });

  const totalCount = paginatedData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="container mx-auto py-10 w-full">
      <Card className="p-3">
        <CardHeader className="flex items-center gap-2">
          <CreatePostForm queryKey={queryKey} />
          <DebouncedInput
            value={globalSearch ?? ''}
            onChange={(value) => setGlobalSearch(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton className="h-[60px] rounded-md" key={index} />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : !paginatedData || paginatedData.data.length === 0 ? (
            <p className="text-muted-foreground">No results found.</p>
          ) : (
            <>
              <div className="relative">
                <DataTable
                  columns={columns}
                  data={paginatedData.data}
                  queryKey={queryKey}
                  setGlobalSearch={setGlobalSearch}
                  globalFilter={globalSearch}
                />

                {isFetching && !isLoading && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col gap-3 p-4 z-10 pointer-events-none">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton className="h-[60px] rounded-md" key={index} />
                    ))}
                  </div>
                )}
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <button
                      className="px-3 py-1 disabled:opacity-50"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      <PaginationPrevious />
                    </button>
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <button
                          onClick={() => setPage(pageNumber)}
                          className={`px-3 py-1 rounded ${
                            page === pageNumber
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <button
                      className="px-3 py-1 disabled:opacity-50"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      <PaginationNext />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
