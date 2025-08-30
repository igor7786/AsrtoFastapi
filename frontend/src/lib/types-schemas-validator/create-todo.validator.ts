import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const createTodoSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters long'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description must be at most 1000 characters long'),
    completed: z.boolean().default(false),
  })
  .strict();

export const createTodoValidator = zValidator('json', createTodoSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      result.error.issues.map((issue) => issue.message),
      400
    );
  }
});
