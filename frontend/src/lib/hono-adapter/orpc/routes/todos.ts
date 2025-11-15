import { getTodosByUserId, createTodo } from '@db/queries/queries';
// router.ts
import { os } from '@orpc/server';
import * as z from 'zod';
import { authMiddleware } from '../middlewares/auth-middleware';
import { base } from '../middlewares/base';
import { todos } from '@db/todos-shema';
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
  .output(
    z.array(
      z.object({
        id: z.string(), // or number — match your DB!
        title: z.string(),
        completed: z.boolean(),
        userId: z.string(), // or number — match DB!
      })
    )
  )
  .handler(async ({ context, errors }) => {
    try {
      const todos = await getTodosByUserId(context.user.id);

      return todos; // ✔ RETURN the data
    } catch (err) {
      console.error(err);
      throw errors.INTERNAL_SERVER_ERROR(); // ✔ Correct
    }
  });

// Router export
