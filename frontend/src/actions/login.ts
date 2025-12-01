import { auth } from '@/lib/auth';
import { loginSchema } from '@/lib/types-schemas-validator/login-schema';
import { ActionError, defineAction } from 'astro:actions';
import { mapStatusToAstroCode } from '@/actions/error-helper';
import { set } from 'zod';

export const login: any = {
  loginUser: defineAction({
    accept: 'form',
    handler: async (input, ctx) => {
      const data = Object.fromEntries(input.entries());
      const parsed = loginSchema.safeParse(data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
          returnHeaders: true,
        });
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
        } // ✅ Copy cookies to Astro context
        const setCookieHeader = authResponse.headers.get('set-cookie');

        if (setCookieHeader) {
          // Split multiple cookies
          const cookies = setCookieHeader.split(/,(?=[^;]+=[^;]+)/);

          for (const cookieString of cookies) {
            const [cookiePair, ...attributes] = cookieString.split(';').map((s) => s.trim());
            const [name, value] = cookiePair.split('=');
            if (!name || !value) continue;

            const cookieOptions: Record<string, any> = {};

            for (const attr of attributes) {
              const [attrName, attrValue] = attr.split('=');
              switch (attrName.toLowerCase()) {
                case 'path':
                  cookieOptions.path = attrValue || '/';
                  break;
                case 'max-age':
                  cookieOptions.maxAge = attrValue ? parseInt(attrValue, 10) : undefined;
                  break;
                case 'expires':
                  cookieOptions.expires = attrValue ? new Date(attrValue) : undefined;
                  break;
                case 'httponly':
                  cookieOptions.httpOnly = true;
                  break;
                case 'samesite':
                  cookieOptions.sameSite =
                    (attrValue?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax';
                  break;
              }
            }

            // Set the cookie with all attributes from the header
            ctx.cookies.set(name, decodeURIComponent(value), cookieOptions);
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
