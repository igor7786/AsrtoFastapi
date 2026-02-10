import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { envServer } from '@/lib/env/env.server';
import { LRUCache } from 'lru-cache';

// Define cache type
type CacheType = {
  db: ReturnType<typeof drizzle>;
};

// Create an LRU cache (max 1 entry, never expire)
const cache = new LRUCache<string, CacheType>({
  max: 1,
  ttl: 0, // never expire
});

// Getter function for cached DB instance
export function getDbInstance() {
  if (cache.has('db')) {
    return cache.get('db')!.db;
  }

  // Create SQLite instance
  const sql = neon(envServer.DB_URL);

  // Create Drizzle instance
  const db = drizzle({ client: sql });

  // Cache it
  cache.set('db', { db });

  return db;
}

// Export the singleton DB instance
export const db = getDbInstance();
export type DB = typeof db;
