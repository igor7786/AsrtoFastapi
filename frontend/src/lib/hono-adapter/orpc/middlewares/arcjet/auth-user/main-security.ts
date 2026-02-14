import { standardArcjet } from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/arcjet-instance';
import { base, type AuthedContext } from '@/lib/hono-adapter/orpc/middlewares/base';
//
export const arcjetBase = base.$context<AuthedContext>();
export const ajBase = arcjetBase.middleware(async ({ context, next, errors }) => {
  const userId = context.user.id;
  const decision = await standardArcjet.protect(context.request.clone(), {
    userId,
  });
  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      throw errors.FORBIDDEN({ message: 'Automated traffic is not allowed' });
    }

    if (decision.reason.isShield()) {
      throw errors.FORBIDDEN({ message: 'Request blocked by security rules (WAF)' });
    }

    throw errors.FORBIDDEN({
      message: 'Request Blocked!',
    });
  }
  return next();
});
