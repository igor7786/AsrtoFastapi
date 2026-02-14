import { standardArcjetNonAuth } from '@/lib/hono-adapter/orpc/middlewares/arcjet/non-auth-user/arcjet-instance';
import { base, type IsAuthedContext } from '@/lib/hono-adapter/orpc/middlewares/base';
import { standardArcjet } from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/arcjet-instance';


export const arcjetBase = base.$context<IsAuthedContext>();
export const ajBase = arcjetBase.middleware(async ({ context, next, errors }) => {
  const userId = context.user?.id;
  let decision;
  if (userId) {
    decision = await standardArcjet.protect(context.request.clone(), { userId });
  } else {
    decision = await standardArcjetNonAuth.protect(context.request.clone());
  }
  // console.log('ArcJet details:', decision.results);
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
