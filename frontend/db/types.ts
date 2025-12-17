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
export type User = typeof auth.$Infer.Session.user;
