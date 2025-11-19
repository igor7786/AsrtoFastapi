import { envDrizzle } from '@/lib/env/env.drizzle';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './db/migrations',
  schema: './db/shema-index.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: envDrizzle.DB_FILE_NAME,
  },
});
