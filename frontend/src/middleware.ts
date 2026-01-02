import { defineMiddleware } from 'astro:middleware';
import { auth } from '@/lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/api/auth/verify-email')) {
    const res = await next();

    console.log(res.headers,  await res.text());
    if (context.url.pathname.startsWith('/api/auth/verify-email') && res.status === 302) {
      const location = res.headers.get('location');

      if (location?.includes('error=token_expired')) {
        return Response.redirect('/token-expired', 302);
      }
    }
    return res;
  }
  if (
    context.isPrerendered ||
    context.url.pathname.startsWith('/_astro/') ||
    context.url.pathname.startsWith('/api/')
  ) {
    return next();
  }

  const session = await auth.api.getSession({ headers: context.request.headers });
  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;
  }
  // Redirect logged-in users away from login
  if (session && context.url.pathname === '/auth') {
    const redirectUrl = context.url.searchParams.get('redirect') || '/';
    return new Response(null, { status: 302, headers: { Location: redirectUrl } });
  }

  // Redirect unauthenticated users from protected routes
  const protectedPaths = ['/dashboard', '/admin', '/settings'];
  if (!session && protectedPaths.some((path) => context.url.pathname.startsWith(path))) {
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
