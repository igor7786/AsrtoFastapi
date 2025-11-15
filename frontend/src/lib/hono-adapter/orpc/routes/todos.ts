import { getTodosByUserId, createTodo, getTodoByUserIdAndOffset } from '@db/queries/queries';
// router.ts
import * as z from 'zod';
import { authMiddleware } from '../middlewares/auth-middleware';
import { base } from '../middlewares/base';
import { outputTodoSchema } from '@db/types';
// Define the Planet schema with metadata for OpenAPI

// GET route to list planets
export const listTodos = base
  .use(authMiddleware)
  .route({
    method: 'GET',
    path: '/get-todos',
    description: 'List todos',
    summary: 'Get all todos',
    tags: ['todos'],
    successDescription: 'A list of todos',
    successStatus: 200,
  })
  .output(z.array(outputTodoSchema))
  .handler(async ({ context, errors }) => {
    try {
      const todos = await getTodosByUserId(context.user.id);

      return todos; // ✔ RETURN the data
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR(); // ✔ Correct
    }
  });

export const getTodoById = base
  .use(authMiddleware)
  .route({
    method: 'GET',
    path: '/todos/{id}', // Dynamic route (unchanged)
    description: 'Get a todo by ID',
    summary: 'Fetch one todo',
    tags: ['todos'],
    successDescription: 'A single todo',
    successStatus: 200,
  })
  .input(
    z.object({
      id: z
        .string()
        .regex(/^\d+$/, 'Todo ID must be a number')
        .transform((val) => Number(val))
        .refine((val) => val > 0, {
          message: 'Todo ID must be a positive number, starting from 1',
        }), // Flat structure: id directly here
    })
  )
  .output(
    outputTodoSchema || null // Your Zod schema for a single todo (unchanged)
  )
  .handler(async ({ context, input, errors }) => {
    let todo;
    try {
      todo = await getTodoByUserIdAndOffset(
        context.user.id,
        input.id // Access input.id directly
      );
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
    if (!todo) {
      throw errors.NOT_FOUND();
    }
    return todo;
  });
