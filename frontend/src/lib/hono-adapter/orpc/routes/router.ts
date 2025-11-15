import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import {
  createTodo,
  deleteAllTodos,
  deleteTodo,
  getTodoById,
  listTodos,
  putTodo,
} from '@hono-adapt/orpc/routes/todos';
import { de } from 'date-fns/locale';

export const router = {
  planet: {
    list: listPlanet,
  },
  todos: {
    list: listTodos,
    getTodo: getTodoById,
    createTodo: createTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos,
    putTodo: putTodo,
  },
};
