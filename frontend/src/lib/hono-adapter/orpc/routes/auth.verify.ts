import { base } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { z } from 'zod';

/* --------------------------------------------------
 * Input schema
 * -------------------------------------------------- */
export const inputVerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  callbackURL: z.string().optional(),
});

/* --------------------------------------------------
 * Output schema (for OpenAPI + ORPC)
 * -------------------------------------------------- */
const verifyEmailOutputSchema = z.union([
  // Redirect with cookies (success)
  z.object({
    status: z.literal(302).describe('record created'),
    headers: z.object({
      location: z.string(),
      'set-cookie': z.array(z.string()).optional(),
    }),
  }),

  // Success without redirect (rare but supported)
  z.object({
    status: z.literal(200),
    body: z.object({
      status: z.literal(true),
      user: z.any().nullable(),
    }),
  }),
]);

/* --------------------------------------------------
 * Route
 * -------------------------------------------------- */
export const verifyEmail = base
  .route({
    method: 'GET',
    path: '/verify-email',
    summary: 'Verify email of a new user account',
    description: 'Verifies email token and redirects user',
    tags: ['Auth'],
    outputStructure: 'detailed',
  })
  .input(inputVerifyEmailSchema)
  .output(verifyEmailOutputSchema)
  .handler(async ({ input, context, errors }) => {
    try {
      /* --------------------------------------------
       * Call BetterAuth
       * -------------------------------------------- */
      const res = await auth.api.verifyEmail({
        headers: context.reqHeaders,
        returnHeaders: true,
        asResponse: true,
        query: {
          token: input.token,
          callbackURL: input.callbackURL,
        },
      });

      const location = res.headers.get('location') ?? '/';
      const cookies = res.headers.getAll('set-cookie');

      /* --------------------------------------------
       * 302 – success / already verified / expired
       * -------------------------------------------- */
      // Successful verification (cookies present)
      if (res.status === 302 && cookies.length > 0) {
        return {
          status: 302,
          headers: {
            location,
            'set-cookie': cookies,
          },
        };
      } else if (res.status === 302 && location === '/?error=token_expired') {
        // Token expired
        return {
          status: 302,
          headers: {
            location: '/token/expired',
          },
        };
        // Token already used
      } else if (res.status === 302 && cookies.length === 0) {
        return {
          status: 302,
          headers: {
            location: '/token/been-used',
          },
        };
      } else if (res.status === 200) {
        /* --------------------------------------------
         * 200 – non-redirect success (edge case)
         * -------------------------------------------- */
        return {
          status: 200,
          body: {
            status: true,
            user: null,
          },
        };
      }
      /* --------------------------------------------
       * Unexpected status
       * -------------------------------------------- */
      throw new APIError('UNAUTHORIZED', {
        message: 'token_expired',
        code: 'TOKEN_EXPIRED',
      });
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({
          message: err.message,
        });
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message: 'Something went wrong',
      });
    }
  });
