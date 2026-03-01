import { standardArcjet, slidingWindow } from '@hono-adapt/orpc/middlewares/arcjet/main-instance';

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
