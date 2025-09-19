import z from 'zod';
import { LRUCache } from 'lru-cache';

const DB_FILE_NAME_SCHEMA = z.string().min(1, { message: 'DB_FILE_NAME must be a non-empty string' });
const BETTER_AUTH_SECRET_SCHEMA = z
  .string()
  .min(1, { message: 'BETTER_AUTH_SECRET must be a non-empty string' });
const BETTER_AUTH_URL_SCHEMA = z
  .string()
  .min(1, { message: 'BETTER_AUTH_URL must be a non-empty string' })
  .url({ message: 'BETTER_AUTH_URL must be a valid URL' });

// Create an LRU cache instance (e.g., max 100 entries, TTL 5 minutes = 300,000 ms)
type EnvVars = {
  DB_FILE_NAME: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

const cache = new LRUCache<string, EnvVars>({
  max: 1, // only need one entry
  ttl: 0, // never expire
});

// Cached getter function for env vars (validates only if not in cache)
function getEnvVars() {
  // Check if already cached
  if (cache.has('envVars')) {
    return cache.get('envVars');
  }

  // Parse and validate env vars (throws ZodError if invalid/missing)
  const DB_FILE_NAME = DB_FILE_NAME_SCHEMA.parse(process.env.DB_FILE_NAME);
  const BETTER_AUTH_SECRET = BETTER_AUTH_SECRET_SCHEMA.parse(process.env.BETTER_AUTH_SECRET);
  const BETTER_AUTH_URL = BETTER_AUTH_URL_SCHEMA.parse(process.env.BETTER_AUTH_URL);

  // Cache the validated values
  const envVars = {
    DB_FILE_NAME,
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
  };

  cache.set('envVars', envVars);
  return envVars;
}

// Export the cached values (calls getEnvVars() only if needed)
const envVars = getEnvVars();

// Optional: Export the full cached config object
export const envConfig = {
  DB_FILE_NAME: envVars!.DB_FILE_NAME,
  BETTER_AUTH_SECRET: envVars!.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: envVars!.BETTER_AUTH_URL,
};
