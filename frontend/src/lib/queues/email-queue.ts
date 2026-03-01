import { Queue } from 'bullmq';
import { redis } from '@/lib/queues/redis';
export const emailQueue = new Queue('emails', {
  // @ts-ignore
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60 * 60 * 2, // ✅ delete after 2 hours
      count: 1000, // safety cap
    },

    removeOnFail: {
      age: 60 * 60 * 24, // keep failed jobs 24h
    },

    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});
