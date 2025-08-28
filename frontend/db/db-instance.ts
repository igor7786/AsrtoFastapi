import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
const dbFile = process.env.DB_FILE_NAME!;

// Create SQLite instance
const sqlite = new Database(dbFile);

// Create drizzle instance
export const db = drizzle({ client: sqlite });
