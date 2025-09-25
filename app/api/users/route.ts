import { prismaApiHandler } from '@/app/lib/server-prisma-handler';
import { NextResponse } from 'next/server';

export async function GET() {
  //api route query showcase
  const users = await prismaApiHandler({
    model: 'user',
    operation: 'findMany',
    args: { where: { email: 'example@email.test' } },
  });

  return NextResponse.json(users);
}
