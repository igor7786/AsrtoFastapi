import { auth } from '@/lib/auth';
import { loginSchema } from '@/lib/types-schemas-validator/login-schema';
import { ActionError, defineAction } from 'astro:actions';
import { mapStatusToAstroCode } from '@/actions/error-helper';

export const login = {
  loginUser: defineAction({
    accept: 'form',
    handler: async (input, ctx) => {
      const data = Object.fromEntries(input.entries());
      const parsed = loginSchema.safeParse(data);

      if (!parsed.success) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: parsed.error.issues.map((e) => e.message).join(', '),
        });
      }

      const { name, password } = parsed.data;

      try {
        const authResponse = await auth.api.signInEmail({
          body: { email: name, password },
          asResponse: true,
        });

        console.log('Auth response status:', authResponse.statusText);

        // 🧠 If the response failed, extract its message & status
        if (!authResponse.ok) {
          let errorMessage = authResponse.statusText; // fallback
          try {
            const body = await authResponse.json();
            if (body?.message) errorMessage = body.message;
          } catch {}

          throw new ActionError({
            code: mapStatusToAstroCode(authResponse.status),
            message: errorMessage,
          });
        }

        // ✅ Copy cookies to Astro context
        const setCookieHeader = authResponse.headers.get('set-cookie');
        if (setCookieHeader) {
          const cookies = setCookieHeader.split(/,(?=[^;]+=[^;]+)/);
          for (const cookieString of cookies) {
            const [cookiePair] = cookieString.split(';');
            const [name, value] = cookiePair.split('=');
            if (name && value) {
              ctx.cookies.set(name.trim(), decodeURIComponent(value.trim()), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
              });
            }
          }
        }

        return { success: true, name };
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
