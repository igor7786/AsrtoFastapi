import { listPlanet } from '@hono-adapt/orpc/routes/planet';

export const router = {
  planet: {
    list: listPlanet,
  },
};
