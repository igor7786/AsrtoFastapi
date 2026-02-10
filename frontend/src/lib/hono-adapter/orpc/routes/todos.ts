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
import { isAuth } from '@hono-adapt/orpc/middlewares/auth-middleware';
import { baseAuth } from '@hono-adapt/orpc/middlewares/base';
import { arcjetRead, arcjetHeavyRead } from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/read';
import {
  arcjetWrite,
  arcjetHeavyWrite,
} from '@/lib/hono-adapter/orpc/middlewares/arcjet/auth-user/write';
import {
  createTodoSchema,
  deleteTodoSchemabyId,
  findTodoByNumber,
  outputTodoSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/todos';
import { isValErrors } from '@hono-adapt/orpc/middlewares/validation-errors';

// Define the Planet schema with metadata for OpenAPI
const baseTodo = baseAuth
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to fetch data from database',
      code: 500,
    },
    NOT_FOUND: {
      message: 'Failed to find any data',
      status: 404,
    },
  })
  .use(isAuth)
  .use(isValErrors);
// GET route to list todos
export const listTodos = baseTodo
  .use(arcjetHeavyRead)
  .route({
    method: 'GET',
    path: '/get-todos',
    description: 'List todos',
    summary: 'Get all todos',
    tags: ['Todos'],
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
// GET  todo
export const getTodoById = baseTodo
  .use(arcjetRead)
  .route({
    method: 'GET',
    path: '/todos/{id}', // Dynamic route (unchanged)
    description: 'Get a todo by ID',
    summary: 'Fetch one todo',
    tags: ['Todos'],
    successDescription: 'A single todo',
    successStatus: 200,
  })
  .input(findTodoByNumber)
  .output(
    outputTodoSchema // Your Zod schema for a single todo (unchanged)
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
// Create a new todo
export const createTodo = baseTodo
  .use(arcjetWrite)
  .route({
    method: 'POST',
    path: '/create-todo',
    description: 'Create todo',
    summary: 'Create one todo',
    tags: ['Todos'],
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
// Update a todo by ID
export const putTodo = baseTodo
  .use(arcjetWrite)
  .route({
    method: 'PATCH',
    path: '/todos/{id}', // Dynamic route for the todo ID
    description: 'Update a todo by ID',
    summary: 'Partially update a todo',
    tags: ['Todos'],
    successDescription: 'The updated todo',
    successStatus: 200,
  })
  .input(outputTodoSchema)
  .output(
    outputTodoSchema // Your Zod schema for the updated todo (or full select schema if preferred)
  )
  .handler(async ({ context, input, errors }) => {
    let updatedTodo;
    try {
      // Assuming you have an update function; adjust based on your DB layer (e.g., Drizzle)
      updatedTodo = await updateTodo(
        input.id,
        context.user.id,
        { title: input.title, completed: input.completed, description: input.description } // Pass only provided fields
      );
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
    if (!updatedTodo) throw errors.NOT_FOUND();

    return updatedTodo;
  });
// Delete a todo by ID
export const deleteTodo = baseTodo
  .use(arcjetWrite)
  .route({
    method: 'DELETE',
    path: '/delete-todo',
    description: 'Delete todo',
    summary: 'Delete one todo',
    tags: ['Todos'],
    successDescription: 'Deleted single todo',
    successStatus: 204,
  })
  .input(deleteTodoSchemabyId)
  .handler(async ({ input, context, errors }) => {
    let deleted;
    try {
      deleted = await dTodo(input.id, context.user.id);
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR();
    }
    if (!deleted) {
      throw errors.NOT_FOUND({
        message: 'No todo found to delete',
      });
    }
    return null;
  });
// Delete all todos
export const deleteAllTodos = baseTodo
  .use(arcjetHeavyWrite)
  .route({
    method: 'DELETE',
    path: '/delete-all-todos',
    description: 'Delete todos',
    summary: 'Delete all todos',
    tags: ['Todos'],
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
      throw errors.NOT_FOUND({
        message: 'No todos to delete',
      });
    }
    return null;
  });
