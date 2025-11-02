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

  const session = await auth.api.getSession({ headers: context.request.headers });
  context.locals.user = session?.user ?? null;
  context.locals.session = session?.session ?? null;

  // Redirect logged-in users away from login
  if (session && context.url.pathname === '/loginshadcn') {
    const redirectUrl = context.url.searchParams.get('redirect') || '/';
    return new Response(null, { status: 302, headers: { Location: redirectUrl } });
  }

  // Redirect unauthenticated users from protected routes
  const protectedPaths = ['/dashboard', '/admin', '/settings'];
  if (!session && protectedPaths.some((path) => context.url.pathname.startsWith(path))) {
    const redirectTo = encodeURIComponent(context.url.pathname);
    return new Response(null, {
      status: 302,
      headers: { Location: `/loginshadcn?redirect=${redirectTo}` },
    });
  }

  const response = await next();

  // Disable caching of authenticated pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');

  return response;
});
