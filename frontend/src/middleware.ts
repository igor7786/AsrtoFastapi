import { auth } from '@/lib/auth';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });
  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
    // Redirect logged-in users away from login page
    if (context.routePattern === '/loginshadcn') {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/?reload=' + Date.now(), // hard refresh
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  return next();
});
