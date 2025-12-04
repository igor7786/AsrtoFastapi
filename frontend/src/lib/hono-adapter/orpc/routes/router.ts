import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import {
  createTodo,
  deleteAllTodos,
  deleteTodo,
  getTodoById,
  listTodos,
  putTodo,
} from '@hono-adapt/orpc/routes/todos';
import { login, register } from '@/lib/hono-adapter/orpc/routes/auth.router';

export const router = {
  planet: {
    listPlanet: listPlanet,
  },
  auth: {
    register: register,
    login: login,
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
