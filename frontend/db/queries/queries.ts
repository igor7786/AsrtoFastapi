import { eq, desc } from 'drizzle-orm';
import { db } from '@db/db-instance';
import { todos } from '@db/todos-shema';
import type { NewTodo, Todo } from '../types';

export const getTodoByUserIdAndOffset = async (userId: string, offset: number) => {
  // Validate offset
  if (!Number.isInteger(offset) || offset < 0) {
    return null;
  }

  return await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(todos.createdAt) // or todos.id — always order!
    .limit(1)
    .offset(offset)
    .then((rows) => rows[0] ?? null); // return single todo or null
};

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
