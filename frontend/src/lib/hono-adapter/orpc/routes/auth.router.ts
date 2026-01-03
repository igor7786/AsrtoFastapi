import { base, baseAuth, baseLogin } from '@hono-adapt/orpc/middlewares/base';
import {
  inputLoginSchema,
  inputRegisterSchema,
  outputLoginSchema,
  outputRegisterSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { auth } from '@/lib/auth';
import { isValErrors } from '@hono-adapt/orpc/middlewares/validation-errors';
import { APIError } from 'better-auth/api';
import { isAuth, isLoggedIn } from '@hono-adapt/orpc/middlewares/auth-middleware';

export const register = base
  .use(isValErrors)
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
  .output(outputRegisterSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      const referer = context.reqHeaders?.get('referer') || '';
      const url = new URL(referer);
      const redirect = url.searchParams.get('redirect') || '';
      const callbackURL = `${redirect}`;
      const { headers, response } = await auth.api.signUpEmail({
        returnHeaders: true,
        headers: context.reqHeaders!,
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
          callbackURL: callbackURL,
        },
      });
      const allCookies = headers.getAll('Set-Cookie');
      if (allCookies.length === 0 && !response.token && response.user) {
        if (redirect) {
          const signinUrl = `/auth?tab=signin&redirect=${encodeURIComponent(redirect)}`;
          return {
            name: response.user.name,
            email: response.user.email,
            redirectTo: signinUrl,
          };
        }
        return {
          name: response.user.name,
          email: response.user.email,
          redirectTo: '/auth?tab=signin',
        };
      } else if (allCookies.length === 0) {
        throw new APIError('BAD_REQUEST', {
          message: 'Failed to register user',
          code: '400',
          cause: 'Failed to get any cookie',
        });
      }
      for (const cookie of allCookies) {
        const isHttps = context.reqHeaders?.get('x-forwarded-proto') === 'https';
        context.resHeaders?.append('Set-Cookie', isHttps ? `${cookie}; Secure` : cookie);
      }
      return {
        message: `Welcome ${response.user.name}.`,
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({
          message: `Failed to register ${input.name}, try again later.`,
        });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const login = baseLogin
  .use(isValErrors)
  .use(isLoggedIn)
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
  .output(outputLoginSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      const { headers, response } = await auth.api.signInEmail({
        headers: context.reqHeaders!,
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
        const isHttps = context.reqHeaders?.get('x-forwarded-proto') === 'https';
        context.resHeaders?.append('Set-Cookie', isHttps ? `${cookie}; Secure` : cookie);
      }
      return { message: `Welcome back ${response.user.name}.` };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 401) {
        throw errors.UNAUTHORIZED({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 403) {
        throw errors.FORBIDDEN({ message: err.message });
      } else if (err instanceof APIError && err.statusCode === 422) {
        throw errors.UNPROCESSABLE_CONTENT({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

import { deleteCookie } from '@orpc/server/helpers';
export const logout = baseAuth
  .use(isValErrors)
  .use(isAuth)
  .route({
    method: 'POST',
    path: '/logout',
    description: 'Logout user',
    summary: 'Sign out user',
    tags: ['Auth'],
    successDescription: 'User logged out successfully',
    successStatus: 200,
  })
  .output(outputLoginSchema)
  .handler(async ({ errors, context }) => {
    try {
      await auth.api.signOut({
        headers: context.reqHeaders!,
      });
      const cookiesParams = {
        secure: true,
        sameSite: 'lax' as const,
        httpOnly: true,
        path: '/',
      };
      deleteCookie(context.resHeaders, 'better-auth.session_token');
      deleteCookie(context.resHeaders, 'better-auth.session_data');
      deleteCookie(context.resHeaders, 'better-auth.state');
      deleteCookie(context.resHeaders, '__Secure-better-auth.session_data', cookiesParams);
      deleteCookie(context.resHeaders, '__Secure-better-auth.session_token', cookiesParams);
      deleteCookie(context.resHeaders, '__Secure-better-auth.state', cookiesParams);
      return {
        message: `${context.user.name} see you next time.`,
      };
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 400) {
        throw errors.BAD_REQUEST({ message: err.message });
      }
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
