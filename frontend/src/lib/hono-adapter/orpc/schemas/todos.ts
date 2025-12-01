import { z } from 'zod';
// outputTodoSchema
export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(255, { message: 'Title must be at most 255 characters long' }),
  description: z
    .string()
    .trim()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(1000, { message: 'Description must be at most 1000 characters long' }),
  completed: z.boolean().default(false),
});
export const outputTodoSchema = createTodoSchema.extend({
  id: z.string().trim().min(1, { message: 'ID must be at least 1 character long' }),
});
export const deleteTodoSchemabyId = outputTodoSchema.pick({
  id: true,
});
export const findTodoByNumber = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Todo ID must be a positive number')
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: 'Todo ID must be a positive number, starting from 1',
    }), // Flat structure: id directly here
});

export type CreateTodo = z.infer<typeof createTodoSchema>;
export type OutputTodo = z.infer<typeof outputTodoSchema>;
export type DeleteTodoById = z.infer<typeof deleteTodoSchemabyId>;
export type FindTodoByNumber = z.infer<typeof findTodoByNumber>;
