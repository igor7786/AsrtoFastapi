import z from 'zod';
import { JSON_SCHEMA_OUTPUT_REGISTRY, JSON_SCHEMA_INPUT_REGISTRY } from '@orpc/zod/zod4';
import { id } from 'date-fns/locale';
export const PlanetSchema = z.object({
  id: z.number().int().min(1).default(1),
  name: z.string().min(1).max(100).default('Planet1'),
});
// .meta({
//   description: 'Planet schema',
//   examples: [{ id: 1, name: 'Planet1' }],
// });

JSON_SCHEMA_INPUT_REGISTRY.add(PlanetSchema, {
  description: 'Planet schema (input)',
  examples: [{ id: 2, name: 'Mars' }],
});

JSON_SCHEMA_OUTPUT_REGISTRY.add(PlanetSchema, {
  description: 'Planet schema (output)',
  examples: [{ id: 1, name: 'Earth' }],
});

export type typePlanets = z.infer<typeof PlanetSchema>;


