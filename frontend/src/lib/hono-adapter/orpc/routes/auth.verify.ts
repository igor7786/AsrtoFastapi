import { base } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
import z from 'zod';
import { APIError } from 'better-auth/api';

export const inputVerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  callbackURL: z.string().optional(), // allow relative paths
});

export const verifyEmail = base
  .route({
    method: 'GET',
    path: '/verify-email',
    description: 'Verify email of a new user',
    summary: 'Verify email of a new user account',
    tags: ['Auth'],
    successDescription: 'Email verified successfully',
    successStatus: 302,
  })
  .input(inputVerifyEmailSchema)
  .handler(async ({ input, context, errors }) => {
    try {
      // Call BetterAuth API with full response
      const res = await auth.api.verifyEmail({
        headers: context.reqHeaders,
        returnHeaders: true,
        asResponse: true,
        query: {
          token: input.token,
          callbackURL: input.callbackURL,
        },
      });
      const location = res.headers.get('location') || '/';
      const setCookies = res.headers.getAll('set-cookie');
      // Handle 302 redirect (token verified or already used)
      if (res.status === 302 && setCookies.length > 0) {
        // Copy BetterAuth cookies to ORPC response
        setCookies.forEach((cookie) => {
          context.resHeaders?.append('set-cookie', cookie);
        });
        context.resHeaders?.append('location', location);
        return;
      } else if (res.status === 302 && location === '/?error=token_expired') {
        // Perform an actual redirect

        context.resHeaders?.append('location', '/token/expired');
        return;
      } else if (res.status === 302) {
        context.resHeaders?.append('location', '/token/been-used');
      } else if (res.status === 200) {
        console.log(context);
        return { status: true, user: null };
      } else {
        throw new APIError('UNAUTHORIZED', {
          message: 'Failed to register user',
          code: '401',
          cause: 'Failed to get any cookie',
        });
      }
      // Handle JSON body (successful verification without redirect)
    } catch (err: any) {
      // Handle BetterAuth errors
      if (err.name === 'APIError') {
        throw errors.BAD_REQUEST({ message: err.message || 'Invalid or expired token' });
      }
      throw errors.INTERNAL_SERVER_ERROR({ message: 'Something went wrong' });
    }
  });
