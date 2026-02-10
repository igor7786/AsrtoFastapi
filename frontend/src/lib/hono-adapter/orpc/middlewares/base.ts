import { os } from '@orpc/server';
import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins';
import type { auth } from '@/lib/auth';
import { type DB } from '@db/db-instance';
import type { Context as HonoContext } from 'hono';

// 👇 Extend ORPC context with your auth fields
export type AppContext = RequestHeadersPluginContext &
  ResponseHeadersPluginContext & {
    db: DB;
    request: Request;
    hono: HonoContext;
  };

export type AuthedContext = AppContext & {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};

export type IsAuthedContext = AppContext & {
  session?: typeof auth.$Infer.Session.session;
  user?: typeof auth.$Infer.Session.user;
};

export const base = os.$context<AppContext>().errors({
  BAD_REQUEST: { message: 'Bad Request', code: 400 },
  UNAUTHORIZED: { message: 'You are Unauthorized', code: 401 },
  FORBIDDEN: { message: 'You are Forbidden', code: 403 },
  NOT_FOUND: { message: 'Not Found', code: 404 },
  CONFLICT: { message: 'Resource conflict', code: 409 },
  UNPROCESSABLE_CONTENT: { message: 'Input validation failed', code: 422 },
  TOO_MANY_REQUESTS: { message: 'Rate limit exceeded please try again later', code: 429 },
  INTERNAL_SERVER_ERROR: { message: 'Internal Server Error', code: 500 },
});

export const arcjetBase = base.$context<AuthedContext>();

export const baseAuth = base.$context<AuthedContext>();
export const baseLogin = base.$context<IsAuthedContext>();
