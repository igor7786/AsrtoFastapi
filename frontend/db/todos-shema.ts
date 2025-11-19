import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from '@db/auth-schema'; // adjust the import path
import { v4 as uuidv4 } from 'uuid';

export const todos = sqliteTable('todos', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: text('title', { length: 255 }).notNull(),
  description: text('description', { length: 1000 }).notNull(),
  completed: integer('completed', { mode: 'boolean' })
    .$default(() => false)
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});
