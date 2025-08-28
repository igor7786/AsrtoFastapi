import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './db/migrations',
  schema: './db/db-schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
