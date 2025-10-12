import { defineAction, ActionError, isActionError } from 'astro:actions';
import { loginSchema } from '@/lib/types-schemas-validator/login-schema.ts';

export const server = {
  submitPerson: defineAction({
    accept: 'form',
    input: loginSchema,
    handler: async ({ name, password }, ctx) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Context:', { url: ctx.url, method: ctx.request.method });
        if (name !== 'admina' || password !== '1234') {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Wrong login or password',
          });
        }
        return { name:`${name}`, success: true };
      } catch (err) {
        if (isActionError(err)) throw err;
        console.error('Unexpected error:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    },
  }),
};
