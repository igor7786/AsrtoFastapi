import { Hono } from 'hono';
import { authMiddleware } from '@/lib/hono-adapter/rpc/auth-middleware';
import { getTodoByUserIdAndOffset } from '@db/queries/queries';
import type { HonoEnv } from '@db/types';
import { todoIdParamValidator } from '@/lib/types-schemas-validator/todo-param-validator';
const todoApi = new Hono<HonoEnv>().use(authMiddleware).get('/:id', todoIdParamValidator, async (c) => {
  const user = c.get('user');
  const { id: offset } = c.req.valid('param'); // validated number ≥ 0

  try {
    const todo = await getTodoByUserIdAndOffset(user.id, offset);

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json(todo, 200);
  } catch (error) {
    console.error('Failed to fetch todo:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default todoApi;
export type TodoType = typeof todoApi;
