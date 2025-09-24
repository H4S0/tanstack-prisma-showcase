import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { model: string; operation: string } }
) {
  try {
    const { model, operation } = params;
    const args = await req.json();
    console.log('Running:', model, operation, 'with args:', args);

    // @ts-expect-error dynamic access
    const prismaModel = prisma[model];
    if (!prismaModel || typeof prismaModel[operation] !== 'function') {
      return NextResponse.json(
        { error: 'Invalid model or operation' },
        { status: 400 }
      );
    }

    const result = await prismaModel[operation](args);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Prisma query error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
