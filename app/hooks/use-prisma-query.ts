import { PrismaClient } from '@prisma/client';
import {
  FunctionKeys,
  OperationArgs,
  OperationReturn,
  prismaApiClient,
  PrismaQueryConfig,
  UsePrismaQueryOption,
} from '../lib/types';

import {
  InfiniteData,
  QueryClient,
  QueryKey,
  queryOptions,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { prismaApiHandler } from '../lib/server-prisma-handler';

function generateQueryKey<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>
>(config: PrismaQueryConfig<TModel, TOperation, TArgs>): QueryKey {
  return ['prisma', config.model, config.operation, config.args ?? {}] as const;
}

export function usePrismaQuery<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
  TReturn = OperationReturn<PrismaClient[TModel], TOperation>
>(
  config: UsePrismaQueryOption<TModel, TOperation, TArgs> & {
    queryKey?: QueryKey;
  },
  options?: Omit<
    UseQueryOptions<TReturn, Error, TReturn, QueryKey>,
    'queryKey' | 'queryFn'
  >
) {
  const queryKey = config.queryKey ?? generateQueryKey(config);
  const queryResult = useQuery<TReturn, Error, TReturn, QueryKey>({
    queryKey,
    queryFn: () =>
      prismaApiClient.executeQuery<TModel, TOperation, TArgs, TReturn>(config),
    enabled: config.enabled,
    staleTime: config.staleTime,
    ...options,
  });

  return { ...queryResult, queryKey };
}

export function usePrismaInfiniteQuery<
  TModel extends keyof PrismaClient,
  TArgs = OperationArgs<PrismaClient[TModel], 'findMany'>,
  TElement = Awaited<
    ReturnType<PrismaClient[TModel]['findMany']>
  > extends Array<infer U>
    ? U
    : never
>(
  pageSize: number,
  config: Omit<PrismaQueryConfig<TModel, 'findMany', TArgs>, 'args'> & {
    queryKey?: QueryKey;
    args?: Omit<TArgs, 'skip' | 'take'>;
  },
  options?: Omit<
    UseInfiniteQueryOptions<
      { data: TElement[]; nextCursor?: number },
      Error,
      InfiniteData<{ data: TElement[]; nextCursor?: number }>,
      ReturnType<typeof generateQueryKey>,
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >
) {
  const queryKey =
    config.queryKey ?? generateQueryKey<TModel, 'findMany', TArgs>(config);

  return useInfiniteQuery<
    { data: TElement[]; nextCursor?: number },
    Error,
    InfiniteData<{ data: TElement[]; nextCursor?: number }>,
    ReturnType<typeof generateQueryKey>,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const argsWithPagination = {
        ...(config.args || {}),
        skip: pageParam,
        take: pageSize + 1,
      };

      const result = await prismaApiClient.executeQueryArray<
        TModel,
        typeof argsWithPagination,
        TElement
      >({
        ...config,
        args: argsWithPagination,
      });

      const safeResult = Array.isArray(result) ? result : [];
      const hasMore = safeResult.length > pageSize;
      const data = safeResult.slice(0, pageSize);

      return {
        data,
        nextCursor: hasMore ? pageParam + pageSize : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) =>
      firstPage.nextCursor
        ? Math.max(firstPage.nextCursor - pageSize, 0)
        : undefined,
    initialPageParam: 0,
    ...options,
  });
}

export function usePrismaPaginatedQuery<
  TModel extends keyof PrismaClient,
  TArgs = OperationArgs<PrismaClient[TModel], 'findMany'>,
  TReturn = Awaited<ReturnType<PrismaClient[TModel]['findMany']>>
>(
  config: PrismaQueryConfig<TModel, 'findMany', TArgs> & {
    pageSize: number;
    page: number;
    queryKey?: QueryKey;
  },
  options?: Omit<
    UseQueryOptions<
      { data: TReturn; hasMore: boolean; totalCount: number },
      Error
    >,
    'queryKey' | 'queryFn'
  >
) {
  const generatedQueryKey =
    config.queryKey ??
    ([
      'prisma',
      config.model,
      'findMany',
      { page: config.page, pageSize: config.pageSize, ...(config.args || {}) },
    ] as QueryKey);

  const queryResult = useQuery<
    { data: TReturn; hasMore: boolean; totalCount: number },
    Error
  >({
    queryKey: generatedQueryKey,
    queryFn: async () => {
      const argsWithPagination = {
        ...(config.args || {}),
        skip: (config.page - 1) * config.pageSize,
        take: config.pageSize + 1,
      };

      const [result, count] = await Promise.all([
        prismaApiClient.executeQuery<
          TModel,
          'findMany',
          typeof argsWithPagination,
          TReturn
        >({
          ...config,
          args: argsWithPagination,
        }),
        prismaApiClient.executeQuery<TModel, 'count', any, number>({
          model: config.model,
          operation: 'count',
          args: config.args || {},
        }),
      ]);

      const arrayResult = result as unknown as Array<unknown>;
      const hasMore = arrayResult.length > config.pageSize;

      return {
        data: arrayResult.slice(0, config.pageSize) as TReturn,
        hasMore,
        totalCount: count,
      };
    },
    ...options,
  });

  return { ...queryResult, queryKey: generatedQueryKey };
}

export async function prismaPrefetchQuery<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>
>(
  queryClient: QueryClient,
  baseConfig: PrismaQueryConfig<TModel, TOperation, TArgs> & {
    queryKey?: QueryKey;
  }
) {
  const queryKey = baseConfig.queryKey ?? generateQueryKey(baseConfig);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => prismaApiHandler(baseConfig),
  });

  return queryKey;
}

export async function prismaPrefetchInfiniteQuery<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
  TElement = OperationReturn<PrismaClient[TModel], TOperation> extends Array<
    infer U
  >
    ? U
    : never
>(
  queryClient: QueryClient,
  baseConfig: PrismaQueryConfig<TModel, TOperation, TArgs> & {
    queryKey?: QueryKey;
    getNextPageParam?: (lastPage: any, allPages: any[]) => number;
    initialPageParam?: number;
    pageSize?: number;
  }
) {
  const { initialPageParam, pageSize = 5 } = baseConfig;
  const queryKey =
    baseConfig.queryKey ??
    generateQueryKey<TModel, 'findMany', TArgs>(baseConfig);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = initialPageParam ?? 0 }) => {
      const argsWithPagination = {
        ...(baseConfig.args || {}),
        skip: pageParam,
        take: pageSize + 1,
      };

      const result = await prismaApiHandler<TModel, 'findMany', TElement>({
        model: baseConfig.model,
        operation: 'findMany',
        args: argsWithPagination,
      });

      const safeResult = (Array.isArray(result) ? result : []) as TElement[];
      const hasMore = safeResult.length > pageSize;
      const data = safeResult.slice(0, pageSize);

      const response = {
        data,
        nextCursor: hasMore ? pageParam + pageSize : undefined,
      };
      return response;
    },
    initialPageParam: initialPageParam ?? 0,
  });

  return queryKey;
}

interface MutationStrategy {
  onMutate?: (oldData: unknown, variables: any) => unknown;
  onSuccess?: (oldData: unknown, data: any, variables: any) => unknown;
}

const mutationStrategies: Record<string, MutationStrategy> = {
  create: {
    onSuccess: (oldData: any, data: any) => {
      if (!oldData) return [data];
      if (oldData.data) {
        return {
          ...oldData,
          data: [...oldData.data, data],
        };
      }
      return [...oldData, data];
    },
  },

  delete: {
    onMutate: (oldData: any, variables: any) => {
      if (!oldData) return oldData;
      if (oldData.data) {
        return {
          ...oldData,
          data: oldData.data.filter(
            (item: any) => item.id !== variables.where.id
          ),
        };
      }
      return oldData.filter((item: any) => item.id !== variables.where.id);
    },
  },

  update: {
    onMutate: (oldData: any, variables: any) => {
      if (!oldData) return oldData;
      if (oldData.data) {
        return {
          ...oldData,
          data: oldData.data.map((item: any) =>
            item.id === variables.where.id
              ? { ...item, ...variables.data }
              : item
          ),
        };
      }
      return oldData.map((item: any) =>
        item.id === variables.where.id ? { ...item, ...variables.data } : item
      );
    },
    onSuccess: (oldData: any, data: any, variables: any) => {
      if (!oldData) return oldData;
      if (oldData.data) {
        return {
          ...oldData,
          data: oldData.data.map((item: any) =>
            item.id === variables.where.id ? data : item
          ),
        };
      }
      return oldData.map((item: any) =>
        item.id === variables.where.id ? data : item
      );
    },
  },

  upsert: {
    onMutate: (oldData: any) => oldData,
  },
} as const;

export function usePrismaMutation<
  TModel extends keyof PrismaClient,
  TOperation extends keyof typeof mutationStrategies,
  TArgs = any,
  TReturn = any
>(
  baseConfig: {
    model: TModel;
    operation: TOperation;
    args?: TArgs;
    queryKey: QueryKey;
  },
  options?: UseMutationOptions<TReturn, Error, TArgs>
) {
  const queryClient = useQueryClient();
  const strategy = mutationStrategies[baseConfig.operation];

  return useMutation<TReturn, Error, TArgs>({
    mutationFn: (variables: TArgs) =>
      prismaApiClient.executeQuery<TModel, TOperation, TArgs, TReturn>({
        ...baseConfig,
        args: variables,
      }),

    onMutate: async (variables: TArgs) => {
      const queryKey = baseConfig.queryKey;
      await queryClient.cancelQueries({ queryKey });

      const prevData = queryClient.getQueryData(queryKey);

      if (strategy?.onMutate) {
        queryClient.setQueryData(
          queryKey,
          strategy.onMutate(prevData, variables)
        );
      }

      return { prevData };
    },

    onError: (_err, _variables, context) => {
      const queryKey = baseConfig.queryKey;
      const typedContext = context as { prevData?: unknown } | undefined;
      if (queryKey && typedContext?.prevData) {
        queryClient.setQueryData(queryKey, typedContext.prevData);
      }
    },

    onSuccess: (data, variables, context) => {
      const queryKey = baseConfig.queryKey;

      if (strategy?.onSuccess) {
        const currentData = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(
          queryKey,
          strategy.onSuccess(currentData, data, variables)
        );
      }

      options?.onSuccess?.(data, variables, context);
    },

    ...options,
  });
}
export function prismaQueryOptions<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
  TReturn = OperationReturn<PrismaClient[TModel], TOperation>
>(
  config: UsePrismaQueryOption<TModel, TOperation, TArgs> & {
    queryKey?: QueryKey;
  }
) {
  const builtOptions = queryOptions<TReturn, Error>({
    ...config,
    queryKey: config.queryKey ?? generateQueryKey(config),
    queryFn: async () =>
      prismaApiHandler<TModel, TOperation, TArgs, TReturn>(config),
  });

  return {
    ...builtOptions,
    model: config.model,
    operation: config.operation,
    args: config.args,
  } as UsePrismaQueryOption<TModel, TOperation, TArgs> & typeof builtOptions;
}

export function usePrismaSuspenseQuery<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
  TReturn = OperationReturn<PrismaClient[TModel], TOperation>
>(
  config: UsePrismaQueryOption<TModel, TOperation, TArgs> & {
    queryKey?: QueryKey;
  }
) {
  const queryKey = config.queryKey ?? generateQueryKey(config);
  const suspenseQuery = useSuspenseQuery({
    queryKey,
    queryFn: () =>
      prismaApiClient.executeQuery<TModel, TOperation, TArgs, TReturn>(config),
  });

  return { ...suspenseQuery, queryKey: queryKey };
}

export function usePrismaSuspenseInfiniteQuery<
  TModel extends keyof PrismaClient,
  TArgs = OperationArgs<PrismaClient[TModel], 'findMany'>,
  TElement = Awaited<
    ReturnType<PrismaClient[TModel]['findMany']>
  > extends Array<infer U>
    ? U
    : never
>(
  pageSize: number,
  config: Omit<PrismaQueryConfig<TModel, 'findMany', TArgs>, 'args'> & {
    queryKey?: QueryKey;
    args?: Omit<TArgs, 'skip' | 'take'>;
  },
  options?: Omit<
    UseInfiniteQueryOptions<
      { data: TElement[]; nextCursor?: number },
      Error,
      InfiniteData<{ data: TElement[]; nextCursor?: number }>,
      ReturnType<typeof generateQueryKey>,
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >
) {
  const queryKey =
    config.queryKey ?? generateQueryKey<TModel, 'findMany', TArgs>(config);
  const suspenseQuery = useSuspenseInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const argsWithPagination = {
        ...(config.args || {}),
        skip: pageParam,
        take: pageSize + 1,
      };

      const result = await prismaApiClient.executeQueryArray<
        TModel,
        typeof argsWithPagination,
        TElement
      >({
        ...config,
        args: argsWithPagination,
      });

      const safeResult = Array.isArray(result) ? result : [];
      const hasMore = safeResult.length > pageSize;
      const data = safeResult.slice(0, pageSize);

      return {
        data,
        nextCursor: hasMore ? pageParam + pageSize : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) =>
      firstPage.nextCursor
        ? Math.max(firstPage.nextCursor - pageSize, 0)
        : undefined,
    initialPageParam: 0,
    ...options,
  });

  return { ...suspenseQuery, queryKey: queryKey };
}
