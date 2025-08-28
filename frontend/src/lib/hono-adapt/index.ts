// src/lib/hono-adapt/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import todosApi, { type TodosType } from '@/lib/hono-adapt/routes/todos.ts';
import timeApi, { type TimeType } from '@/lib/hono-adapt/routes/time.ts';
import { auth } from '@/lib/auth';
const app = new Hono().basePath('/api');

//? CORS middleware
app.use('/*', cors());

//? Trailing slash middleware
app.use('/*', async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path !== '/' && path.endsWith('/')) {
    return c.redirect(path.slice(0, -1));
  }
  await next();
});

//? Routes
app.route('/todos', todosApi as TodosType);
app.route('/time', timeApi as TimeType);
app.get('/', (c) => c.json({ message: 'server is healthy' }));
app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));
console.log('scalar api served: http://localhost:4321/api/auth/reference');
export default app;
export type AppType = typeof app;
