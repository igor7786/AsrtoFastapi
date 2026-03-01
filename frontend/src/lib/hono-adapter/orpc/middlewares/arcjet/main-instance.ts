import arcjet, { shield, fixedWindow, detectBot, validateEmail, slidingWindow } from '@arcjet/bun';
export { arcjet, shield, fixedWindow, detectBot, validateEmail, slidingWindow };
import { envServer } from '@/lib/env/env.server';
import { base, type IsAuthedContext } from '@/lib/hono-adapter/orpc/middlewares/base';
export const standardArcjet = arcjet({
  key: envServer.ARCJET_KEY,

  rules: [
    // Block common attacks e.g. SQL injection, XSS, CSRF
    shield({
      // Will block requests. Use "DRY_RUN" to log only
      mode: 'LIVE',
    }),
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Googlebot, Bingbot, etc.
        'CATEGORY:PREVIEW', // Link previews (e.g. Slack, Facebook),
        'CATEGORY:MONITOR', // Monitoring tools (e.g. Pingdom, UptimeRobot)
      ],
    }),
  ],
});

export const arcjetBase = base.$context<IsAuthedContext>();
export const ajBase = arcjetBase.middleware(async ({ context, next, errors }) => {
  const decision = await standardArcjet.protect(context.request.clone());
  // console.log('ArcJet details:', decision.results);
  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      throw errors.FORBIDDEN({ message: 'Automated traffic is not allowed' });
    }

    if (decision.reason.isShield()) {
      throw errors.FORBIDDEN({ message: 'Request blocked by security rules (WAF)' });
    }

    throw errors.FORBIDDEN({
      message: 'Request Blocked!',
    });
  }
  return next();
});
