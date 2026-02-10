import { envServer } from '@/lib/env/env.server';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './db/migrations',
  schema: './db/shema-index.ts',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: envServer.DB_URL,
  },
});
