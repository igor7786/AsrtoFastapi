import { os } from '@orpc/server';
import type { RequestHeadersPluginContext } from '@orpc/server/plugins';

// 👇 Extend ORPC context with your auth fields
export type AppContext = RequestHeadersPluginContext & {
  session?: any;
  user?: any;
};

export const baseErr = os.$context<AppContext>().errors({
  BAD_REQUEST: { message: 'Bad Request', code: 400 },
  UNAUTHORIZED: { message: 'You are Unauthorized', code: 401 },
  FORBIDDEN: { message: 'You are Forbidden', code: 403 },
  NOT_FOUND: { message: 'Not Found', code: 404 },
  TOO_MANY_REQUESTS: { message: 'Rate limit exceeded please try again later', code: 429 },
  INTERNAL_SERVER_ERROR: { message: 'Internal Server Error', code: 500 },
});

import { onError, ORPCError, ValidationError } from '@orpc/server'
import * as z from 'zod'

export const base = baseErr.use(onError((error) => {
  if (
    error instanceof ORPCError
    && error.code === 'BAD_REQUEST'
    && error.cause instanceof ValidationError
  ) {
    // If you only use Zod you can safely cast to ZodIssue[]
    const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[])
       // Combine all issue messages into a single string
    const message = zodError.issues.map((issue) => issue.message).join(', ');
    throw new ORPCError('INPUT_VALIDATION_FAILED', {
      status: 422,
      message: message,
      data: z.flattenError(zodError),
      cause: error.cause,
    })
  }

  if (
    error instanceof ORPCError
    && error.code === 'INTERNAL_SERVER_ERROR'
    && error.cause instanceof ValidationError
  ) {
    throw new ORPCError('OUTPUT_VALIDATION_FAILED', {
      cause: error.cause,
    })
  }
}))
