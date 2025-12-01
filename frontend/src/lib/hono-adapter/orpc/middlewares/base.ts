import { os } from '@orpc/server';
import type { RequestHeadersPluginContext } from '@orpc/server/plugins';
import { onError, ORPCError, ValidationError } from '@orpc/server';
import { z } from 'zod';

// 👇 Extend ORPC context with your auth fields
export type AppContext = RequestHeadersPluginContext & {
  session?: any;
  user?: any;
};

export const base = os.$context<AppContext>().errors({
  BAD_REQUEST: { message: 'Bad Request', code: 400 },
  UNAUTHORIZED: { message: 'You are Unauthorized', code: 401 },
  FORBIDDEN: { message: 'You are Forbidden', code: 403 },
  NOT_FOUND: { message: 'Not Found', code: 404 },
  INPUT_VALIDATION_FAILED: { message: 'Input validation failed', code: 422 },
  TOO_MANY_REQUESTS: { message: 'Rate limit exceeded please try again later', code: 429 },
  INTERNAL_SERVER_ERROR: { message: 'Internal Server Error', code: 500 },
});
