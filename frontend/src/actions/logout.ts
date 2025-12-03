import { auth } from '@/lib/auth';
import { ActionError, defineAction } from 'astro:actions';
export const logout = {
  logoutUser: defineAction({
    accept: 'form', // Avoid CSRF for simplicity
    handler: async (_, ctx) => {
      try {
        await auth.api.signOut({
          headers: ctx.request.headers,
          request: ctx.request,
        });
        // ✅ Delete the session cookie
        ctx.cookies.delete('better-auth.session_token', { path: '/' });
        ctx.cookies.delete('better-auth.session_data', { path: '/' });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      } catch (err) {
        if (err instanceof ActionError) {
          console.error('Login action error:', err.message);
          throw err;
        }

        console.error('Unexpected login error:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unexpected login error',
        });
      }
    },
  }),
};
