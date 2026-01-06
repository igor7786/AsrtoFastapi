import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
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
  const sqlite = new Database(envServer.DB_FILE_NAME);
  sqlite.run('PRAGMA foreign_keys = ON');

  // Create Drizzle instance
  const db = drizzle({ client: sqlite });

  // Cache it
  cache.set('db', { db });

  return db;
}

// Export the singleton DB instance
export const db = getDbInstance();
export type DB = typeof db;
