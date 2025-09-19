import { envConfig } from '@/lib/env-vars';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './db/migrations',
  schema: './db/shema-index.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: envConfig.DB_FILE_NAME,
  },
});
