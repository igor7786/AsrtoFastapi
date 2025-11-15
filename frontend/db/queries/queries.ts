import { eq, desc, and } from 'drizzle-orm';
import { db } from '@db/db-instance';
import { todos } from '@db/todos-shema';
import type { NewTodo, Todo } from '../types';

export const getTodoByUserIdAndOffset = async (userId: string, offset: number) => {
  // Validate offset
  const offsetInt = Math.floor(offset - 1);
  const [todo] = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(todos.createdAt)
    .limit(1)
    .offset(offsetInt);
  return todo ?? null; // return single todo or null
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
export const deleteTodo = async (todoId: string, userId: string) => {
  const [deleted] = await db
    .delete(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
    .returning();

  return deleted;
};
export const deleteAllTodos = async (userId: string) => {
  const deleted = await db.delete(todos).where(eq(todos.userId, userId)).run();

  return true;
};
