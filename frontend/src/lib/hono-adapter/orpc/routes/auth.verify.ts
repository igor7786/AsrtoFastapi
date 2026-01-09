import { base } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import {
  inputVerifyEmailSchema,
  verifyEmailOutputSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/verify';

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
    const { token, callbackURL } = input;
    try {
      /* --------------------------------------------
       * Call BetterAuth
       * -------------------------------------------- */
      const res = await auth.api.verifyEmail({
        headers: context.reqHeaders,
        returnHeaders: true,
        asResponse: true,
        query: {
          token,
          callbackURL,
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
            location: '/resend-email?error=token_expired',
          },
        };
        // Token already used
      } else if (res.status === 302 && cookies.length === 0) {
        // Token already used
        return {
          status: 302,
          headers: {
            location: '/resend-email?error=token_already_used',
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
