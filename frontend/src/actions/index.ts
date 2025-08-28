import { defineAction, ActionError } from 'astro:actions';
import { loginSchema } from '@/lib/types-schemas/login-schema.ts';

export const server = {
  submitPerson: defineAction({
    accept: 'form',
    input: loginSchema,
    handler: async ({ name, password }, ctx) => {
      try {
        // Simulate async delay (e.g. DB call)
        await new Promise((r) => setTimeout(r, 1000));
        console.log(ctx);
        // Example authentication check
        if (name !== 'admina' || password !== '1234') {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Wrong login or password',
          });
        }

        return { name, success: true };
      } catch (err) {
        // Allow expected ActionErrors to bubble up
        if (err instanceof ActionError) throw err;

        // Catch unexpected issues (e.g. DB down)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    },
  }),
};
