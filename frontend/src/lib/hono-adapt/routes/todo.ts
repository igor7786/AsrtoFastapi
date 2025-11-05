import { Hono } from 'hono';
import { authMiddleware } from '@/lib/hono-adapt/auth-middleware';
import { getTodosByUserId } from '@db/queries/queries';
import type { HonoEnv } from '@db/types';
import { todoIdParamValidator } from '@/lib/types-schemas-validator/todo-param-validator';

const todoApi = new Hono<HonoEnv>().use(authMiddleware).get('/:id', todoIdParamValidator, async (c) => {
  const user = c.get('user');
  const { id: todoId } = c.req.valid('param'); // ✅ validated + converted to number

  try {
    const todosList = await getTodosByUserId(user.id);
    if (!todosList?.length) {
      return c.json({ error: 'No todos found' }, 404);
    }

    const todo = todosList[todoId];
    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json(todo, 200);
  } catch (error) {
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
});

export default todoApi;
export type TodoType = typeof todoApi;
