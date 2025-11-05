import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// This schema will validate the route params
export const todoIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Todo ID must be a number') // must be digits only
    .transform((val) => Number(val)), // convert to number
});

// Wrap it in a zValidator for Hono
export const todoIdParamValidator = zValidator('param', todoIdParamSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues.map((issue) => issue.message).join(', ') }, 400);
  }
});
