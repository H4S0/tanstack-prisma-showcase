import { PrismaClient } from '@prisma/client';
import {
  FunctionKeys,
  OperationArgs,
  OperationReturn,
  PrismaQueryConfig,
} from './types';

const prisma = new PrismaClient();

export async function prismaApiHandler<
  TModel extends keyof PrismaClient,
  TOperation extends FunctionKeys<PrismaClient[TModel]>,
  TArgs = OperationArgs<PrismaClient[TModel], TOperation>,
  TReturn = OperationReturn<PrismaClient[TModel], TOperation>
>(config: PrismaQueryConfig<TModel, TOperation, TArgs>): Promise<TReturn> {
  // @ts-expect-error dynamic call
  return prisma[config.model][config.operation](config.args);
}
