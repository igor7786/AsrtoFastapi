import { ORPCError, ValidationError } from '@orpc/server';
import { z } from 'zod';
import { base } from '@hono-adapt/orpc/middlewares/base';
export const isValErrors = base.middleware(async ({ context, next, errors }) => {
  try {
    return await next({ context });
  } catch (error) {
    if (
      error instanceof ORPCError &&
      error.code === 'BAD_REQUEST' &&
      error.cause instanceof ValidationError
    ) {
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);
      const message = zodError.issues.map((i) => i.message).join(', ');
      throw new ORPCError('INPUT_VALIDATION_FAILED', {
        status: 422,
        message,
        data: z.flattenError(zodError),
        cause: error.cause,
      });
    }
    if (
      error instanceof ORPCError &&
      error.code === 'INTERNAL_SERVER_ERROR' &&
      error.cause instanceof ValidationError
    ) {
      throw new ORPCError('OUTPUT_VALIDATION_FAILED', {
        cause: error.cause,
      });
    }

    throw error; // rethrow all other errors
  }
});
