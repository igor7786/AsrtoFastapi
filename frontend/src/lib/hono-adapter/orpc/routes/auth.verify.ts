import { base } from '@hono-adapt/orpc/middlewares/base';
import { auth } from '@/lib/auth';
import z from 'zod';

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
      const response = await auth.api.verifyEmail({
        headers: context.reqHeaders,
        returnHeaders: true,
        asResponse: true,
        query: {
          token: input.token,
          callbackURL: input.callbackURL,
        },
      });
      console.log('headers', response);
      const location = response.headers.get('location') || '/';
      // Handle 302 redirect (token verified or already used)
      if (response.status === 302) {
        console.log('headers', response.headers);
        // Copy BetterAuth cookies to ORPC response
        const setCookies = response.headers.get('set-cookie');
        if (setCookies) context.resHeaders?.set('Set-Cookie', setCookies);
        // console.log('Redirecting to:', await response.json());
        // Perform an actual redirect
        context.resHeaders?.set('Location', location);
        return;
      } else {
        context.resHeaders?.set('Location', location);
        return;
      }

      // Handle JSON body (successful verification without redirect)
    } catch (err: any) {
      // Handle BetterAuth errors
      if (err.name === 'APIError') {
        console.error('Email verification APIError:', err);
        throw errors.BAD_REQUEST({ message: err.message || 'Invalid or expired token' });
      }

      console.error('Unexpected error during email verification:', err);
      throw errors.INTERNAL_SERVER_ERROR({ message: 'Something went wrong' });
    }
  });
