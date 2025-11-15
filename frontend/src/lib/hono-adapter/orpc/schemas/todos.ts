import { createSelectSchema } from 'drizzle-zod';
import { todos } from '@db/todos-shema';

export const outputTodoSchema = createSelectSchema(todos).pick({
  id: true,
  title: true,
  description: true,
  completed: true,
});
export const createTodoSchema = outputTodoSchema.pick({
  title: true,
  description: true,
  completed: true,
});
export const deleteTodoSchema = outputTodoSchema.pick({
  id: true,
});
