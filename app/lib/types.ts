import { PrismaClient } from '@prisma/client';

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type OperationArgs<T, K extends keyof T> = T[K] extends (
  ...args: any[]
) => any
  ? Parameters<T[K]>[0]
  : never;

export type OperationReturn<T, K extends keyof T> = T[K] extends (
  ...args: any[]
) => any
  ? Awaited<ReturnType<T[K]>>
  : never;

export interface PrismaQueryConfig<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>
> {
  model: TModel;
  operation: TOperation;
  args?: TArgs;
}

export interface UsePrismaQueryOption<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>
> extends PrismaQueryConfig<TModel, TOperation, TArgs> {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

class PrismaApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/prisma') {
    this.baseUrl = baseUrl;
  }

  async executeQuery<
    TModel extends keyof PrismaClient,
    TOperation extends FunctionKeys<PrismaClient[TModel]>,
    TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
    TReturn = OperationReturn<PrismaClient[TModel], TOperation>
  >(config: PrismaQueryConfig<TModel, TOperation, TArgs>): Promise<TReturn> {
    const response = await fetch(
      `${this.baseUrl}/${config.model}/${config.operation}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.args || {}),
      }
    );
    if (!response.ok) throw new Error('Query failed');
    return response.json() as Promise<TReturn>;
  }

  async executeQueryArray<
    TModel extends keyof PrismaClient,
    TArgs = OperationArgs<PrismaClient[TModel], 'findMany'>,
    TReturn = Awaited<
      ReturnType<PrismaClient[TModel]['findMany']>
    > extends Array<infer U>
      ? U
      : never
  >(config: PrismaQueryConfig<TModel, 'findMany', TArgs>): Promise<TReturn[]> {
    const response = await fetch(`${this.baseUrl}/${config.model}/findMany`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.args || {}),
    });
    if (!response.ok) throw new Error('Query failed');
    const data = await response.json();

    return Array.isArray(data) ? data : [data];
  }
}

export const prismaApiClient = new PrismaApiClient();
