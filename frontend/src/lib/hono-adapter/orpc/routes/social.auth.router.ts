import { auth } from '@/lib/auth';
import {
  inputLoginSocialSchema,
  outputLoginSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { isLoggedIn } from '@hono-adapt/orpc/middlewares/auth-middleware';
import { baseLogin } from '@hono-adapt/orpc/middlewares/base';
import { isValErrors } from '@hono-adapt/orpc/middlewares/validation-errors';
import { APIError } from 'better-auth/api';
export const socialLogin = baseLogin
  .use(isValErrors)
  .use(isLoggedIn)
  .route({
    method: 'POST',
    path: '/social/login',
    description: 'Social login a user',
    summary: 'Social sign in a user',
    tags: ['Auth'],
    successDescription: 'User logged in successfully',
    successStatus: 200,
  })
  .input(inputLoginSocialSchema)
  .output(outputLoginSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      const referer = context.reqHeaders?.get('referer') || '';
      const url = new URL(referer);
      const redirect = url.searchParams.get('redirect') || '';
      const callbackURL = `${redirect}`;

      const { headers, response } = await auth.api.signInSocial({
        headers: context.reqHeaders,
        returnHeaders: true,
        body: {
          provider: input.provider,
          callbackURL,
        },
      });
      const allCookies = headers.getAll('Set-Cookie');
      if (allCookies.length === 0) {
        throw new APIError('BAD_REQUEST', {
          message: 'Failed to login user',
          code: '400',
          cause: 'Failed to get any cookie',
        });
      }

      for (const cookie of allCookies) {
        const isHttps = context.reqHeaders?.get('x-forwarded-proto') === 'https';
        context.resHeaders?.append('Set-Cookie', isHttps ? `${cookie}; Secure` : cookie);
      }
      return {
        redirectTo: response.url,
        message: `Redirecting to ${input.provider}.`,
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 404) {
        throw errors.NOT_FOUND({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
