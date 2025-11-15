import {
  getTodosByUserId,
  getTodoByUserIdAndOffset,
  createTodo as cTodo,
  deleteTodo as dTodo,
  deleteAllTodos as daTodos,
  updateTodo,
} from '@db/queries/queries';
// router.ts
import * as z from 'zod';
import { authMiddleware } from '@hono-adapt/orpc/middlewares/auth-middleware';
import { base } from '@hono-adapt/orpc/middlewares/base';
import { createTodoSchema, deleteTodoSchema, outputTodoSchema } from '@hono-adapt/orpc/schemas/todos';
// Define the Planet schema with metadata for OpenAPI
const baseTodo = base.errors({
  INTERNAL_SERVER_ERROR: {
    message: 'Failed to fetch data from database',
    code: 500,
  },
  NOT_FOUND: {
    message: 'Failed to find any data',
    code: 404,
  },
});
// GET route to list planets
export const listTodos = baseTodo
  .use(authMiddleware)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to fetch data',
      code: 500,
    },
    NOT_FOUND: {
      message: 'Failed to find any data',
      code: 404,
    },
  })
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

export const getTodoById = baseTodo
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
export const createTodo = baseTodo
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
export const putTodo = baseTodo
  .use(authMiddleware)
  .route({
    method: 'PUT',
    path: '/todos', // no :id param
    description: 'Replace an entire todo',
    summary: 'PUT todo',
    tags: ['todos'],
    successDescription: 'Todo updated',
    successStatus: 204, // No Content
  })
  .input(outputTodoSchema) // entire todo in body
  .handler(async ({ input, context, errors }) => {
    try {
      const { id, ...data } = input;

      const updated = await updateTodo(id, context.user.id, data);

      if (!updated) {
        throw errors.NOT_FOUND({
          message: 'Todo not found',
        });
      }

      return null; // 204 → no content
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const deleteTodo = baseTodo
  .use(authMiddleware)
  .route({
    method: 'DELETE',
    path: '/delete-todo',
    description: 'Delete todo',
    summary: 'Delete one todo',
    tags: ['todos'],
    successDescription: 'Deleted single todo',
    successStatus: 204,
  })
  .input(deleteTodoSchema)
  .handler(async ({ input, context, errors }) => {
    let deleted;
    try {
      deleted = await dTodo(input.id, context.user.id);
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
    if (!deleted) {
      throw errors.NOT_FOUND();
    }
    return null;
  });
export const deleteAllTodos = baseTodo
  .use(authMiddleware)
  .route({
    method: 'DELETE',
    path: '/delete-all-todos',
    description: 'Delete todos',
    summary: 'Delete all todos',
    tags: ['todos'],
    successDescription: 'Deleted all todos',
    successStatus: 204,
  })
  .handler(async ({ context, errors }) => {
    let deleted;
    try {
      deleted = await daTodos(context.user.id);
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
    if (!deleted) {
      throw errors.NOT_FOUND();
    }
    return null;
  });
