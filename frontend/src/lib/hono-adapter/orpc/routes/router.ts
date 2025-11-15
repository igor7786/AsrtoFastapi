import { listPlanet } from '@hono-adapt/orpc/routes/planet';
import { listTodos } from '@hono-adapt/orpc/routes/todos';

export const router = {
  planet: {
    list: listPlanet,
  },
  todo : {
    list: listTodos,
  }
};
