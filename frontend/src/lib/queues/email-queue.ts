import { Queue } from 'bullmq';
import { redis } from '@/lib/queues/redis';
export const emailQueue = new Queue('emails', {
  // @ts-ignore
  connection: redis,
});
