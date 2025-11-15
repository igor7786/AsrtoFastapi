import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import { getTodoById, listTodos } from '@hono-adapt/orpc/routes/todos';

export const router = {
  planet: {
    list: listPlanet,
  },
  todos: {
    list: listTodos,
    todo: getTodoById,
  },
};
