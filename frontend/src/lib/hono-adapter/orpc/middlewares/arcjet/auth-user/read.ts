import { ajBase } from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/main-security';
import {
  readArcjet,
  heavyReadArcjet,
} from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/arcjet-instance';
type ArcjetClientWithUser = ReturnType<typeof readArcjet>; // includes userId in properties
function createAuthArcjetMiddleware(getClient: () => ArcjetClientWithUser) {
  return ajBase.concat(async ({ context, next, errors }) => {
    const client = getClient();
    const userId = context.user?.id;
    const decision = await client.protect(context.request, { userId });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.FORBIDDEN({ message: 'Too many requests. Please slow down!' });
      }
      throw errors.FORBIDDEN({ message: 'Request Blocked!' });
    }
    return next();
  });
}

export const arcjetRead = createAuthArcjetMiddleware(readArcjet);
export const arcjetHeavyRead = createAuthArcjetMiddleware(heavyReadArcjet);
