import { type arcjet } from '@hono-adapt/orpc/middlewares/arcjet/main-instance';
import { ajBase } from '@/lib/hono-adapter/orpc/middlewares/arcjet/main-instance';
import {
  writeArcjet,
  heavyWriteArcjet,
} from '@/lib/hono-adapter/orpc/middlewares/arcjet/non-auth-user/arcjet-instance';

function createArcjetMiddleware(getClient: () => ReturnType<typeof arcjet>) {
  return ajBase.concat(async ({ context, next, errors }) => {
    const client = getClient();
    const decision = await client.protect(context.request.clone());

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.FORBIDDEN({
          message: 'Too many requests. Please slow down!',
        });
      }

      throw errors.FORBIDDEN({ message: 'Request Blocked!' });
    }

    return next();
  });
}
export const arcjetNonAuthWrite = createArcjetMiddleware(writeArcjet);
export const arcjetNonAuthHeavyWrite = createArcjetMiddleware(heavyWriteArcjet);
