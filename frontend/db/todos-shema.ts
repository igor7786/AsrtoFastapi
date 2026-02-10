import { pgTable, text, uuid, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { user } from '@db/auth-schema'; // keep your correct import

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(), // PostgreSQL-native UUID generator

  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),

  completed: boolean('completed').notNull().default(false),

  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),

  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});
