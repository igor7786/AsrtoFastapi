import { eq, desc, and } from 'drizzle-orm';
import { db, type DB } from '@db/db-instance';
import { todos } from '@db/todos-shema';
import type { NewTodo, Todo } from '@db/types';
import { outputTodoSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/todos';
import type z from 'zod';
import { user, account } from '@db/auth-schema';
import { type LoginSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { verifyPassword } from '@/lib/argon2';
type OutputTodo = z.infer<typeof outputTodoSchema>;

export const getUserByEmail = async (input: LoginSchema, db: DB) => {
  const { email, password } = input;

  const [userRecord] = await db.select().from(user).where(eq(user.email, email)).limit(1);
  if (!userRecord) return { error: 'Invalid credentials', code: '401' };

  if (userRecord.emailVerified) return { error: 'Email already verified', code: '403' };

  const [accountRecord] = await db
    .select()
    .from(account)
    .where(eq(account.userId, userRecord.id))
    .limit(1);

  if (!accountRecord?.password) return { error: 'Invalid credentials', code: '401' };

  const isValidPassword = await verifyPassword({ password, hash: accountRecord.password });
  if (!isValidPassword) return { error: 'Invalid credentials', code: '401' };

  return { userRecord, isEmailVerified: false, code: 200 };
};

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

export const updateTodo = async (
  todoId: string,
  userId: string,
  data: Partial<Omit<OutputTodo, 'id'>>
) => {
  const [updated] = await db
    .update(todos)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
    .returning();

  return updated;
};

export const deleteTodo = async (todoId: string, userId: string) => {
  const [deleted] = await db
    .delete(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
    .returning();

  return deleted;
};
export const deleteAllTodos = async (userId: string) => {
  const deleted = await db.delete(todos).where(eq(todos.userId, userId)).returning();
  // @ts-ignore
  if (deleted.length === 0) {
    return false;
  }
  return true;
};
