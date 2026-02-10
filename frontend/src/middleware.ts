import { defineMiddleware } from 'astro:middleware';
import { auth } from '@/lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  if (
    context.isPrerendered ||
    context.url.pathname.startsWith('/_astro/') ||
    context.url.pathname.startsWith('/api/')
  ) {
    return next();
  }
  const notProtectedPaths = ['/auth'];
  const protectedPaths = ['/dashboard', '/admin', '/settings'];
  const pathname = context.url.pathname;
  const session = await auth.api.getSession({ headers: context.request.headers });
  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;
  }

  // Redirect logged-in users away from login
  if (session && notProtectedPaths.some((path) => pathname.startsWith(path))) {
    const redirectUrl = context.url.searchParams.get('redirect') || '/';
    return new Response(null, { status: 302, headers: { Location: redirectUrl } });
  }

  // Redirect unauthenticated users from protected routes
  if (!session && protectedPaths.some((path) => pathname.startsWith(path))) {
    const redirectTo = encodeURIComponent(context.url.pathname);
    const tabs = encodeURIComponent(context.url.searchParams.get('tab') || 'signin');
    return new Response(null, {
      status: 302,
      headers: { Location: `/auth?tab=${tabs}&redirect=${redirectTo}` },
    });
  }

  const response = await next();

  // Disable caching of authenticated pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');

  return response;
});
