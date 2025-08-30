import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
// db url
const dbFile = process.env.DB_FILE_NAME!;

// Create SQLite instance
const sqlite = new Database(dbFile);
sqlite.run('PRAGMA foreign_keys = ON');

// Create drizzle instance
export const db = drizzle({ client: sqlite });
