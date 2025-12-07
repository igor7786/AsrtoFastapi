import { base } from '@hono-adapt/orpc/middlewares/base';
import {
  inputLoginSchema,
  inputRegisterSchema,
  outputLoginRegisterSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { auth } from '@/lib/auth';
import { validationErrorsMiddleware } from '@hono-adapt/orpc/middlewares/validation-errors';
import { APIError } from 'better-auth/api';
import { authMiddleware } from '../middlewares/auth-middleware';

export const register = base
  .use(validationErrorsMiddleware)
  .route({
    method: 'POST',
    path: '/register',
    description: 'Register a new user',
    summary: 'Create a new user account',
    tags: ['Auth'],
    successDescription: 'User registered successfully',
    successStatus: 201,
  })
  .input(inputRegisterSchema)
  .output(outputLoginRegisterSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      const { headers } = await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
      const allCookies = headers.getAll('Set-Cookie');
      if (allCookies.length === 0) {
        throw new APIError('BAD_REQUEST', {
          message: 'Failed to register user',
          code: '400',
          cause: 'Failed to get any cookie',
        });
      }
      for (const cookie of allCookies) {
        context.resHeaders?.append('Set-Cookie', cookie);
      }
      return {
        message: `Welcome ${input.name.charAt(0).toUpperCase() + input.name.slice(1)}`,
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const login = base
  .use(validationErrorsMiddleware)
  .route({
    method: 'POST',
    path: '/login',
    description: 'Login a user',
    summary: 'Sign in a user',
    tags: ['Auth'],
    successDescription: 'User logged in successfully',
    successStatus: 200,
  })
  .input(inputLoginSchema)
  .output(outputLoginRegisterSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      //? 1️ Check if user is already logged in by checking cookie in header
      const cookieHeader = context.reqHeaders?.toJSON().cookie;
      const match = cookieHeader?.match(/better-auth\.session_data=([^;]+)/);

      if (match) {
        const base64 = match[1];
        const jsonString = Buffer.from(base64, 'base64').toString('utf8');
        const data = JSON.parse(jsonString);

        if (data?.session?.user?.id) {
          // User is already logged in
          throw new APIError('UNPROCESSABLE_ENTITY', {
            message: 'User is already logged in, please logout first',
            code: '422',
            cause: 'User is already logged in',
          });
        }
      }

      //? 2 Proceed with login

      const { headers, response } = await auth.api.signInEmail({
        returnHeaders: true,
        body: {
          email: input.email,
          password: input.password,
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
        context.resHeaders?.append('Set-Cookie', cookie);
      }

      return { message: `Welcome back ${response.user.name}` };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

import { deleteCookie } from '@orpc/server/helpers';
export const logout = base
  .use(validationErrorsMiddleware)
  .use(authMiddleware)
  .route({
    method: 'POST',
    path: '/logout',
    description: 'Logout user',
    summary: 'Sign out user',
    tags: ['Auth'],
    successDescription: 'User logged out successfully',
    successStatus: 200,
  })
  .output(outputLoginRegisterSchema)
  .handler(async ({ errors, context }) => {
    try {
      await auth.api.signOut({
        headers: context.reqHeaders!,
      });
      deleteCookie(context.resHeaders, 'better-auth.session_token');
      deleteCookie(context.resHeaders, 'better-auth.session_data');
      return {
        message: `${context.user.name} have been logged out`,
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
