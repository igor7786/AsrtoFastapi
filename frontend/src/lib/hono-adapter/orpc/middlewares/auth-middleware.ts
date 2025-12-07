import { baseAuth, baseLogin } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
export const isAuth = baseAuth.middleware(async ({ context, next, errors }) => {
   if (context.user && context.session) {
     return next({ context });
   }

  const headers = context.reqHeaders;

  if (!headers) {
    throw errors.UNAUTHORIZED();
  }

  const sessionData = await auth.api.getSession({ headers });

  if (!sessionData?.session || !sessionData?.user) {
    throw errors.UNAUTHORIZED();
  }

  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});
export const isLoggedIn = baseLogin.middleware(async ({ context, next, errors }) => {
  const session = await auth.api.getSession({
    headers: context.reqHeaders!,
  });
  if (session?.user?.id) {
    throw errors.UNPROCESSABLE_CONTENT({
      message: 'User is already logged in, please logout first before logging in again',
    });
  }

  // continue the request
  return next({ context });
});
