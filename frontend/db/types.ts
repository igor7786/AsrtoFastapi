import { auth } from '@/lib/auth';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { todos } from '@db/todos-shema';
export type Todo = InferSelectModel<typeof todos>;

export type NewTodo = InferInsertModel<typeof todos>;

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { todos as todosSchema } from '@db/todos-shema';

// Generate full Zod schema for selecting (reading) todos
export const selectTodoSchema = createSelectSchema(todosSchema);

// Optionally, for inserting new todos (full or partial)
export const insertTodoSchema = createInsertSchema(todosSchema);
// Or a partial insert schema: insertTodoSchema.pick({ title: true, completed: true });
