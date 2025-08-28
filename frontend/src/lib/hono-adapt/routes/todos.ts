import { Hono } from 'hono';
import { todoSchema } from '@/lib/types-schemas/todo-schema.ts';
import { z } from 'zod';

const todosApi = new Hono();

// Sample data (type inferred)
const todos = [
  { id: 1, title: 'Learn Astro Nowsas' },
  { id: 2, title: 'Integrate React' },
  { id: 3, title: 'Use TanStack Query' },
];

// Zod schema for array
const todosArraySchema = z.array(todoSchema);

// GET /:id
todosApi.get('/:id', (c) => {
  const id = Number(c.req.param('id'));
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  // Validate single todo
  const parsed = todoSchema.parse(todo);
  return c.json(parsed, 200);
});

// GET /
todosApi.get('/', (c) => {
  // Validate array of todos
  const parsed = todosArraySchema.parse(todos);
  return c.json(parsed, 200);
});

export default todosApi;
export type TodosType = typeof todosApi;
