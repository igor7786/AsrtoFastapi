import { Redis } from 'ioredis';
import { envServer } from '@/lib/env/env.server';

export const redis = new Redis(envServer.UPSTASH_REDIS_URL, {
  // ⚡ For serverless Redis like Upstash
  maxRetriesPerRequest: null,
  enableOfflineQueue: true, // optional
});

// Optional: Test the connection
(async () => {
  try {
    await redis.set('ping', 'pong');
    const val = await redis.get('ping');
    console.log('Upstash Redis connection OK:', val); // should print "pong"
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();
