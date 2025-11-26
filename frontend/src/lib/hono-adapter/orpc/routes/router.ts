import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import {
  createTodo,
  deleteAllTodos,
  deleteTodo,
  getTodoById,
  listTodos,
  putTodo,
} from '@hono-adapt/orpc/routes/todos';

export const router = {
  planet: {
    listPlanet: listPlanet,
  },
  todos: {
    listTodos: listTodos,
    getTodo: getTodoById,
    createTodo: createTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos,
    putTodo: putTodo,
  },
};
export type Router = typeof router;
