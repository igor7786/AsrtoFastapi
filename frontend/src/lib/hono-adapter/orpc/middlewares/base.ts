import { os } from '@orpc/server';
import { type RequestHeadersPluginContext } from '@orpc/server/plugins';
export const base = os.$context<RequestHeadersPluginContext>().errors({
  RATE_LIMIT_EXCEEDED: {
    message: 'Rate limit exceeded',
    code: 429,
  },
  UNAUTHORIZED: {
    message: 'You are Unauthorized',
    code: 401,
  },
  FORBIDDEN: {
    message: 'You are Forbidden',
    code: 403,
  },
  NOT_FOUND: {
    message: 'Not Found',
    code: 404,
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    code: 500,
  },
});
