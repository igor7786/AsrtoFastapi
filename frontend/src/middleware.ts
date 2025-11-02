import { auth } from '@/lib/auth';
import { defineMiddleware } from 'astro:middleware';
console.log('Middleware loaded');
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
        status: 307,
        headers: {
          Location: '/', // Redirect to home or dashboard
        },
      });
    }
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  const response = await next();
  // 🔒 Ensure no cached HTML pages (especially for auth-sensitive pages)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  return response;
});
