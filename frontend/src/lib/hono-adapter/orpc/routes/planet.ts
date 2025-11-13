// router.ts
import { os } from '@orpc/server';
import * as z from 'zod';
import { PlanetSchema } from '@/lib/hono-adapter/orpc/schemas/schema';
// Define the Planet schema with metadata for OpenAPI

// GET route to list planets
export const listPlanet = os
  .route({
    method: 'POST',
    path: '/get-planets',
    description: 'List planets with pagination',
    summary: 'Get all planets',
    tags: ['planets'],
    successDescription: 'A list of planets',
  })
  .input(PlanetSchema) // optional input for pagination
  .output(z.array(PlanetSchema)) // array of PlanetSchema
  .handler(async ({ input }) => {
    console.log('Fetching planets for page:', input);
    // Normally you'd fetch this from DB
    return [
      { id: 1, name: 'Earth' },
      { id: 2, name: 'Mars' },
    ];
  });

// Router export
