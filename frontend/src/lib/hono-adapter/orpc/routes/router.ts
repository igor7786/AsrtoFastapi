import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import { createTodo, getTodoById, listTodos } from '@hono-adapt/orpc/routes/todos';

export const router = {
  planet: {
    list: listPlanet,
  },
  todos: {
    list: listTodos,
    getTodo: getTodoById,
    createTodo: createTodo,
  },
};
