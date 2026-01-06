import { baseLogin } from '@hono-adapt/orpc/middlewares/base';
import {
  inputLoginSchema,
  outputRegisterSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { auth } from '@/lib/auth';
import { isValErrors } from '@hono-adapt/orpc/middlewares/validation-errors';
import { APIError } from 'better-auth/api';
import { isLoggedIn } from '@hono-adapt/orpc/middlewares/auth-middleware';
import { getUserByEmail } from '@db/queries/queries';

export const resendEmail = baseLogin
  .use(isValErrors)
  .use(isLoggedIn)
  .route({
    method: 'POST',
    path: '/resend-email',
    description: 'Resend email',
    summary: 'Resend email',
    tags: ['Auth'],
    successDescription: 'Email was sent successfully',
    successStatus: 200,
  })
  .input(inputLoginSchema)
  .output(outputRegisterSchema)
  .handler(async ({ input, errors, context }) => {
    const { email } = input;
    const db = context.db;
    try {
      const user = await getUserByEmail(input, db);
      if (user.error === 'Invalid credentials') {
        throw new APIError('UNAUTHORIZED', {
          message: 'Something went wrong, try again later.',
          code: user.code,
          cause: 'Failed to get user by email and password',
        });
      } else if (user.error === 'Email already verified') {
        throw new APIError('FORBIDDEN', {
          message: 'Something went wrong, try again later.',
          code: user.code,
          cause: 'Failed to get user by email and password',
        });
      }
      const response = await auth.api.sendVerificationEmail({
        returnHeaders: true,
        headers: context.reqHeaders!,
        asResponse: true,
        body: {
          email,
          callbackURL: '/',
        },
      });
      return {
        message: ` ${user.userRecord?.name} Yours verification email was sent to ${user.userRecord?.email}`,
        redirectTo: '/',
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 403) {
        throw errors.FORBIDDEN({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 404) {
        throw errors.NOT_FOUND({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
