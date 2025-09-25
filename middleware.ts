// middleware.ts
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(
  async (req) => {
    // Optional extra checks (roles, etc.)
    // e.g.
    // const token = req.kindeAuth.token;
    // if (!token.roles?.includes('user')) {
    //   return new Response('Forbidden', { status: 403 });
    // }
  },
  {
    loginPage: '/api/auth/login',
    isReturnToCurrentPage: true,
    publicPaths: ['/', '/api/auth/login', '/api/auth/register'],
  }
);

export const config = {
  matcher: ['/((?!_next|_static|favicon.ico|api).*)'],
};
