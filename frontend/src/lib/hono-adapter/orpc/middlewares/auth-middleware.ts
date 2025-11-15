import { base } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
export const authMiddleware = base.middleware(async ({ context, next, errors }) => {
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
