import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
// @ts-ignore
import { Database } from 'bun:sqlite';

// import Database from 'better-sqlite3';
// import { drizzle } from 'drizzle-orm/better-sqlite3';

const dbFile = process.env.DB_FILE_NAME!;
console.log(dbFile);

// Create SQLite instance
const sqlite = new Database(dbFile);

// Create drizzle instance
export const db = drizzle({ client: sqlite });
