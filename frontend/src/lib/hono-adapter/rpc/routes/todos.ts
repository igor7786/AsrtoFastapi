import { Hono } from 'hono';
import { authMiddleware } from '@/lib/hono-adapter/rpc/auth-middleware';
import { getTodosByUserId, createTodo } from '@db/queries/queries';
import type { HonoEnv } from '@db/types';
import { createTodoValidator } from '@/lib/types-schemas-validator/create-todo.validator';
const todosApi = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get('/', async (c) => {
    const user = c.get('user');
    try {
      const todosList = await getTodosByUserId(user.id);
      return c.json(todosList, 200);
    } catch (error) {
      return c.json({ error: 'Failed to fetch todos' }, 500);
    }
  })
  .post('/', createTodoValidator, async (c) => {
    const user = c.get('user');
    const todoData = c.req.valid('json');
    try {
      const newTodo = await createTodo({
        userId: user.id,
        ...todoData,
      });
      return c.json(newTodo, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create todo' }, 500);
    }
  });
export default todosApi;
export type TodosType = typeof todosApi;
