import { getTodosByUserId, getTodoByUserIdAndOffset, createTodo as cTodo } from '@db/queries/queries';
// router.ts
import * as z from 'zod';
import { authMiddleware } from '@hono-adapt/orpc/middlewares/auth-middleware';
import { base } from '@hono-adapt/orpc/middlewares/base';
import { createTodoSchema, outputTodoSchema } from '@hono-adapt/orpc/schemas/todos';
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
export const createTodo = base
  .use(authMiddleware)
  .route({
    method: 'POST',
    path: '/create-todo',
    description: 'Create todo',
    summary: 'Create one todo',
    tags: ['todos'],
    successDescription: 'Created single todo',
    successStatus: 201,
  })
  .input(createTodoSchema)
  .output(outputTodoSchema)
  .handler(async ({ input, context, errors }) => {
    try {
      const newTodo = await cTodo({
              userId: context.user.id,
              ...input,
            });
      return newTodo; // ✔ RETURN the data
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR(); // ✔ Correct
    }
  });
