import { envServer } from '@/lib/env/env.server';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './db/migrations',
  schema: './db/shema-index.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: envServer.DB_FILE_NAME,
  },
});
