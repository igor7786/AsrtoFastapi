import { eq, desc } from 'drizzle-orm';
import { db } from '@db/db-instance';
import { todos } from '@db/todos-shema';
import type { NewTodo, Todo } from '../types';
export const getTodosByUserId = async (userId: string) => {
  const res = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
  return res;
};

export const getTodoByUserId = async (todoId: string, userId: string) => {
  const res = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId) && eq(todos.id, todoId))
    .limit(1);
  return res;
};

export const createTodo = async (todo: NewTodo) => {
  const [res] = await db.insert(todos).values(todo).returning();
  return res;
};
