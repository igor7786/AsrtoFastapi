import { envServer } from '@/lib/env/env.server';
import { Redis } from 'ioredis';

const url = envServer.UPSTASH_REDIS_URL;
async function main() {
  const redis = new Redis(url, { maxRetriesPerRequest: null });

  console.log('Flushing Redis...');
  await redis.flushall();
  console.log('✅ Redis cleared');

  await redis.quit();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
