import {
  arcjet,
  shield,
  detectBot,
  slidingWindow,
} from '@hono-adapt/orpc/middlewares/arcjet/main-instance';
import { envServer } from '@/lib/env/env.server';
export const standardArcjetNonAuth = arcjet({
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

export const readArcjet = () =>
  standardArcjetNonAuth.withRule(
    slidingWindow({
      mode: 'LIVE',
      max: 10,
      interval: 60,
    })
  );

export const heavyReadArcjet = () =>
  standardArcjetNonAuth.withRule(
    slidingWindow({
      mode: 'LIVE',
      max: 3,
      interval: 60,
    })
  );

export const writeArcjet = () =>
  standardArcjetNonAuth.withRule(
    slidingWindow({
      mode: 'LIVE',
      max: 5,
      interval: 60,
    })
  );

export const heavyWriteArcjet = () =>
  standardArcjetNonAuth.withRule(
    slidingWindow({
      mode: 'LIVE',
      max: 3,
      interval: 60,
    })
  );
