import { prismaApiHandler } from '@/app/lib/server-prisma-handler';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    throw new Error('Something went wrong');
  }

  let existingUser = await prismaApiHandler({
    model: 'user',
    operation: 'findUnique',
    args: { where: { id: user.id } },
  });

  if (!existingUser) {
    existingUser = await prismaApiHandler({
      model: 'user',
      operation: 'create',
      args: {
        data: {
          id: user.id,
          firstName: user.family_name,
          lastName: user.given_name,
          email: user.email,
        },
      },
    });
  }

  return NextResponse.redirect('http://localhost:3000/dashboard');
}
