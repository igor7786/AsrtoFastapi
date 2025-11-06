import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// This schema will validate the route params
export const todoIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Todo ID must be a number')
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: 'Todo ID must be a positive number, starting from 1',
    }),
});
// Wrap it in a zValidator for Hono
export const todoIdParamValidator = zValidator('param', todoIdParamSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues.map((issue) => issue.message).join(', ') }, 400);
  }
});
