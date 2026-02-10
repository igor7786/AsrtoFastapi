import {
  arcjet,
  shield,
  detectBot,
  slidingWindow,
} from '@hono-adapt/orpc/middlewares/arcjet/main-instance';
import { envServer } from '@/lib/env/env.server';

export const standardArcjet = arcjet({
  key: envServer.ARCJET_KEY,
  characteristics: ['userId'],

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
  standardArcjet.withRule(
    slidingWindow({
      characteristics: ['userId'],
      mode: 'LIVE',
      max: 180,
      interval: 60,
    })
  );

export const heavyReadArcjet = () =>
  standardArcjet.withRule(
    slidingWindow({
      characteristics: ['userId'],
      mode: 'LIVE',
      max: 10,
      interval: 60,
    })
  );

export const writeArcjet = () =>
  standardArcjet.withRule(
    slidingWindow({
      characteristics: ['userId'],
      mode: 'LIVE',
      max: 10,
      interval: 60,
    })
  );

export const heavyWriteArcjet = () =>
  standardArcjet.withRule(
    slidingWindow({
      characteristics: ['userId'],
      mode: 'LIVE',
      max: 3,
      interval: 60,
    })
  );
