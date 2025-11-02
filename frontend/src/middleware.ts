// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { auth } from '@/lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip static assets and prerendered pages and apis
  if (
    context.isPrerendered ||
    context.url.pathname.startsWith('/_astro/') ||
    context.url.pathname.startsWith('/api/')
  ) {
    return next();
  }

  // Check session via Better Auth
  const session = await auth.api.getSession({ headers: context.request.headers });

  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;

    // Redirect logged-in users away from login page
    if (context.routePattern === '/loginshadcn') {
      const redirectUrl = context.url.searchParams.get('redirect') || '/';
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    }
  } else {
    context.locals.user = null;
    context.locals.session = null;
    // Optional: redirect unauthenticated users from protected routes
    const protectedRoutes = ['/dashboard'];

    if (protectedRoutes.includes(context.url.pathname)) {
      const redirectTo = encodeURIComponent(context.url.pathname);
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/loginshadcn?redirect=${redirectTo}`,
        },
      });
    }


  }

  const response = await next();

  // Prevent caching of authenticated pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');

  return response;
});
